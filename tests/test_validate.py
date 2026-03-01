"""Tests for scripts/validate.py — pure function tests.

Tests cover layer mapping, style parsing, path extraction, and registry
lookup without requiring any real filesystem or .drawio files.
"""

from pathlib import Path

import validate as v


# ── get_archimate_layer() ──────────────────────────────────────


class TestGetArchimateLayer:
    """get_archimate_layer maps shape names to registry layers."""

    def test_application_layer_shape(self):
        assert v.get_archimate_layer("mxgraph.archimate3.application") == "application"

    def test_business_layer_shape(self):
        assert v.get_archimate_layer("mxgraph.archimate3.business") == "business"

    def test_technology_layer_shape(self):
        assert v.get_archimate_layer("mxgraph.archimate3.technology") == "technology"

    def test_tech_alias(self):
        assert v.get_archimate_layer("mxgraph.archimate3.tech") == "technology"

    def test_individual_shape_capability(self):
        assert v.get_archimate_layer("mxgraph.archimate3.capability") == "strategy"

    def test_individual_shape_work_package(self):
        assert v.get_archimate_layer("mxgraph.archimate3.workPackage") == "implementation"

    def test_individual_shape_stakeholder(self):
        assert v.get_archimate_layer("mxgraph.archimate3.stakeholder") == "motivation"

    def test_individual_shape_equipment(self):
        assert v.get_archimate_layer("mxgraph.archimate3.equipment") == "physical"

    def test_individual_shape_location(self):
        assert v.get_archimate_layer("mxgraph.archimate3.location") == "composite"

    def test_junction_returns_none(self):
        assert v.get_archimate_layer("mxgraph.archimate3.junction") is None

    def test_unknown_archimate_shape(self):
        assert v.get_archimate_layer("mxgraph.archimate3.unknownThing") == "unknown"

    def test_non_archimate_shape_returns_none(self):
        assert v.get_archimate_layer("mxgraph.flowchart.database") is None

    def test_empty_string_returns_none(self):
        assert v.get_archimate_layer("") is None


# ── parse_drawio_style() ──────────────────────────────────────


class TestParseDrawioStyle:
    """parse_drawio_style parses semicolon-delimited style strings."""

    def test_basic_style(self):
        result = v.parse_drawio_style("shape=rect;fillColor=#fff;strokeColor=#000")
        assert result == {"shape": "rect", "fillColor": "#fff", "strokeColor": "#000"}

    def test_empty_string(self):
        assert v.parse_drawio_style("") == {}

    def test_none_input(self):
        assert v.parse_drawio_style(None) == {}

    def test_trailing_semicolon(self):
        result = v.parse_drawio_style("shape=rect;fillColor=#fff;")
        assert result == {"shape": "rect", "fillColor": "#fff"}

    def test_value_with_equals(self):
        result = v.parse_drawio_style("shape=mxgraph.archimate3.application;appType=comp")
        assert result["shape"] == "mxgraph.archimate3.application"
        assert result["appType"] == "comp"


# ── build_layer_registry() ────────────────────────────────────


class TestBuildLayerRegistry:
    """build_layer_registry creates a (layer, name) lookup dict."""

    def test_basic_lookup(self):
        elems = [
            {"name": "Order Service", "layer": "application"},
            {"name": "Payment Gateway", "layer": "application"},
        ]
        lookup = v.build_layer_registry(elems)
        assert ("application", "Order Service") in lookup
        assert ("application", "Payment Gateway") in lookup

    def test_different_layers_same_name(self):
        elems = [
            {"name": "Auth", "layer": "application"},
            {"name": "Auth", "layer": "business"},
        ]
        lookup = v.build_layer_registry(elems)
        assert ("application", "Auth") in lookup
        assert ("business", "Auth") in lookup
        assert len(lookup) == 2

    def test_empty_list(self):
        assert v.build_layer_registry([]) == {}


# ── get_domain_from_path() ────────────────────────────────────


class TestGetDomainFromPath:
    """get_domain_from_path extracts the domain from a view file path."""

    def test_standard_path(self):
        path = v.VIEWS_DIR / "customer-management" / "app-landscape.drawio"
        assert v.get_domain_from_path(path) == "customer-management"

    def test_nested_path(self):
        path = v.VIEWS_DIR / "billing-and-payments" / "sub" / "detail.drawio"
        assert v.get_domain_from_path(path) == "billing-and-payments"


# ── get_view_type_from_path() ─────────────────────────────────


class TestGetViewTypeFromPath:
    """get_view_type_from_path extracts the stem of the file."""

    def test_basic(self):
        path = Path("/views/customer-management/application-landscape.drawio")
        assert v.get_view_type_from_path(path) == "application-landscape"

    def test_complex_name(self):
        path = Path("/views/analytics/data-model.drawio")
        assert v.get_view_type_from_path(path) == "data-model"

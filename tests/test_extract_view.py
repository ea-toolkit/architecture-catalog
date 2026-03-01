"""Tests for scripts/extract_view.py — pure function tests.

Tests cover label cleaning, shape/edge classification, color extraction,
view type detection, and domain reference enrichment.
"""

import extract_view as ev


# ── clean_label() ─────────────────────────────────────────────


class TestCleanLabel:
    """clean_label strips HTML and normalises whitespace."""

    def test_strips_tags(self):
        assert ev.clean_label("<b>Order</b> <i>Service</i>") == "Order Service"

    def test_replaces_nbsp_and_amp(self):
        assert ev.clean_label("A&nbsp;&amp;&nbsp;B") == "A & B"

    def test_collapses_whitespace(self):
        assert ev.clean_label("  too   many   spaces  ") == "too many spaces"

    def test_empty_string(self):
        assert ev.clean_label("") == ""

    def test_none_returns_empty(self):
        assert ev.clean_label(None) == ""

    def test_br_tags(self):
        assert ev.clean_label("Line1<br/>Line2<br>Line3") == "Line1 Line2 Line3"


# ── get_shape_type() ──────────────────────────────────────────


class TestGetShapeType:
    """get_shape_type classifies draw.io styles to shape categories."""

    def test_empty_style(self):
        assert ev.get_shape_type("") == "unknown"

    def test_none_style(self):
        assert ev.get_shape_type(None) == "unknown"

    def test_edge_label(self):
        assert ev.get_shape_type("edgeLabel;align=center") == "edge_label"

    def test_group(self):
        assert ev.get_shape_type("group") == "group"

    def test_archimate_component(self):
        assert ev.get_shape_type("shape=mxgraph.archimate3.application;appType=comp;fillColor=#99ffff") == "archimate.component"

    def test_archimate_function(self):
        assert ev.get_shape_type("shape=mxgraph.archimate3.application;appType=func") == "archimate.function"

    def test_archimate_data_object(self):
        assert ev.get_shape_type("shape=mxgraph.archimate3.application;appType=passive") == "archimate.data_object"

    def test_archimate_service(self):
        assert ev.get_shape_type("shape=mxgraph.archimate3.application;appType=serv") == "archimate.service"

    def test_archimate_interface(self):
        assert ev.get_shape_type("shape=mxgraph.archimate3.application;appType=interface") == "archimate.interface"

    def test_archimate_process(self):
        assert ev.get_shape_type("shape=mxgraph.archimate3.application;appType=proc") == "archimate.process"

    def test_archimate_event(self):
        assert ev.get_shape_type("shape=mxgraph.archimate3.application;appType=event") == "archimate.event"

    def test_archimate_business_subtype(self):
        result = ev.get_shape_type("shape=mxgraph.archimate3.business;busType=process")
        assert result == "archimate.business.process"

    def test_archimate_tech_subtype(self):
        result = ev.get_shape_type("shape=mxgraph.archimate3.tech;techType=node")
        assert result == "archimate.tech.node"

    def test_archimate_other(self):
        assert ev.get_shape_type("shape=mxgraph.archimate3.application;fillColor=#99ffff") == "archimate.other"

    def test_database_shape(self):
        assert ev.get_shape_type("shape=mxgraph.flowchart.database") == "database"

    def test_person_shape(self):
        assert ev.get_shape_type("shape=mxgraph.basic.person") == "person"

    def test_fallback_shape(self):
        assert ev.get_shape_type("rounded=1;fillColor=#dae8fc") == "shape"


# ── get_fill_color() ──────────────────────────────────────────


class TestGetFillColor:
    """get_fill_color extracts hex fill color from style strings."""

    def test_extracts_color(self):
        assert ev.get_fill_color("fillColor=#99ffff;strokeColor=#000") == "#99ffff"

    def test_no_fill_returns_none(self):
        assert ev.get_fill_color("strokeColor=#000;rounded=1") is None

    def test_empty_style(self):
        assert ev.get_fill_color("") is None


# ── get_edge_type() ───────────────────────────────────────────


class TestGetEdgeType:
    """get_edge_type classifies edge styles."""

    def test_empty_style(self):
        assert ev.get_edge_type("") == "association"

    def test_none_style(self):
        assert ev.get_edge_type(None) == "association"

    def test_composition(self):
        assert ev.get_edge_type("startArrow=diamondThin;startFill=1;endArrow=open") == "composition"

    def test_aggregation(self):
        assert ev.get_edge_type("startArrow=diamondThin;startFill=0;endArrow=open") == "aggregation"

    def test_realization(self):
        assert ev.get_edge_type("endArrow=block;endFill=0;dashed=1") == "realization"

    def test_generalization(self):
        assert ev.get_edge_type("endArrow=block;endFill=0") == "generalization"

    def test_directed(self):
        assert ev.get_edge_type("endArrow=block;endFill=1") == "directed"

    def test_no_arrow_association(self):
        assert ev.get_edge_type("endArrow=none") == "association"


# ── enrich_element() ──────────────────────────────────────────


class TestEnrichElement:
    """enrich_element looks up data in a domain reference dict."""

    def test_no_reference_returns_none(self):
        assert ev.enrich_element("Order", None) is None

    def test_component_match(self):
        ref = {
            "logical_components": [
                {"name": "Order Manager", "description": "Handles orders", "sourcing": "in-house"},
            ]
        }
        result = ev.enrich_element("Order Manager", ref)
        assert result is not None
        assert result["type"] == "component"
        assert result["description"] == "Handles orders"
        assert result["sourcing"] == "in-house"

    def test_component_alias_match(self):
        ref = {
            "logical_components": [
                {"name": "Order Manager", "aliases": ["OM", "Order Mgr"], "description": "Handles orders"},
            ]
        }
        result = ev.enrich_element("OM", ref)
        assert result is not None
        assert result["type"] == "component"

    def test_data_concept_group_match(self):
        ref = {
            "logical_components": [],
            "data_concept_groups": [
                {"name": "Customer Data", "identifier": "CD", "logical_component": "CRM",
                 "data_aggregates": ["Contact Info", "Address"]},
            ]
        }
        result = ev.enrich_element("Customer Data", ref)
        assert result is not None
        assert result["type"] == "data_concept"
        assert result["identifier"] == "CD"

    def test_data_aggregate_match(self):
        ref = {
            "logical_components": [],
            "data_concept_groups": [
                {"name": "Customer Data", "identifier": "CD", "logical_component": "CRM",
                 "data_aggregates": ["Contact Info"]},
            ]
        }
        result = ev.enrich_element("Contact Info", ref)
        assert result is not None
        assert result["type"] == "data_concept"
        assert result["group"] == "Customer Data"

    def test_no_match_returns_none(self):
        ref = {"logical_components": [], "data_concept_groups": []}
        assert ev.enrich_element("Unknown Thing", ref) is None

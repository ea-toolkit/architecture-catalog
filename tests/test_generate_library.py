"""Tests for scripts/generate_library.py — pure function tests.

Tests cover create_shape_xml which converts an element dict into
a draw.io library shape dict (xml, w, h, title, aspect).
"""

import generate_library as gl


# ── create_shape_xml() ────────────────────────────────────────


class TestCreateShapeXml:
    """create_shape_xml builds draw.io library entries."""

    def test_returns_dict_with_expected_keys(self):
        elem = {
            "name": "Order Service",
            "layer": "application",
            "element_type": "components",
            "domain": "customer-management",
            "owner": "Team A",
            "status": "active",
            "specialization": "",
        }
        result = gl.create_shape_xml(elem)
        assert result is not None
        assert "xml" in result
        assert "w" in result
        assert "h" in result
        assert "title" in result
        assert "aspect" in result

    def test_title_matches_name(self):
        elem = {
            "name": "Payment Gateway",
            "layer": "application",
            "element_type": "components",
            "domain": "billing",
            "owner": "Team B",
            "status": "active",
            "specialization": "",
        }
        result = gl.create_shape_xml(elem)
        assert result["title"] == "Payment Gateway"

    def test_default_dimensions(self):
        elem = {
            "name": "Test",
            "layer": "application",
            "element_type": "functions",
            "domain": "",
            "owner": "",
            "status": "active",
            "specialization": "",
        }
        result = gl.create_shape_xml(elem)
        assert result["w"] == gl.DEFAULT_WIDTH
        assert result["h"] == gl.DEFAULT_HEIGHT

    def test_unknown_type_returns_none(self):
        elem = {
            "name": "Mystery",
            "layer": "nonexistent",
            "element_type": "widgets",
            "domain": "",
            "owner": "",
            "status": "active",
            "specialization": "",
        }
        result = gl.create_shape_xml(elem)
        assert result is None

    def test_xml_contains_encoded_name(self):
        elem = {
            "name": "Order Service",
            "layer": "application",
            "element_type": "components",
            "domain": "customer-management",
            "owner": "Team A",
            "status": "active",
            "specialization": "",
        }
        result = gl.create_shape_xml(elem)
        # The XML is HTML-encoded for draw.io library format
        assert "Order Service" in result["xml"]

    def test_xml_contains_fill_color(self):
        elem = {
            "name": "Svc",
            "layer": "business",
            "element_type": "services",
            "domain": "",
            "owner": "",
            "status": "active",
            "specialization": "",
        }
        result = gl.create_shape_xml(elem)
        # Business layer fill color
        assert gl.LAYER_COLORS["business"].replace("#", "") in result["xml"] or gl.LAYER_COLORS["business"] in result["xml"]

    def test_html_escaping_in_name(self):
        elem = {
            "name": "R&D <Service>",
            "layer": "application",
            "element_type": "components",
            "domain": "",
            "owner": "",
            "status": "active",
            "specialization": "",
        }
        result = gl.create_shape_xml(elem)
        # Name should be HTML-escaped
        assert "R&amp;D" in result["xml"] or "R&amp;amp;D" in result["xml"]

    def test_aspect_is_fixed(self):
        elem = {
            "name": "Test",
            "layer": "application",
            "element_type": "components",
            "domain": "",
            "owner": "",
            "status": "active",
            "specialization": "",
        }
        result = gl.create_shape_xml(elem)
        assert result["aspect"] == "fixed"

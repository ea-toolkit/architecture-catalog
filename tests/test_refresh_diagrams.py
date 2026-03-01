"""Tests for scripts/refresh_diagrams.py — pure function tests.

Tests cover the encode/decode roundtrip, label cleaning,
registry matching, and cell label extraction.
"""

import xml.etree.ElementTree as ET

import refresh_diagrams as rd


# ── encode / decode roundtrip ─────────────────────────────────


class TestCodecRoundtrip:
    """decode_diagram_content / encode_diagram_content preserve data."""

    def test_roundtrip_ascii(self):
        original = '<mxGraphModel><root><mxCell id="0"/></root></mxGraphModel>'
        encoded = rd.encode_diagram_content(original)
        decoded = rd.decode_diagram_content(encoded)
        assert decoded == original

    def test_roundtrip_unicode(self):
        original = '<mxGraphModel><root><mxCell id="0" value="Ångström"/></root></mxGraphModel>'
        encoded = rd.encode_diagram_content(original)
        decoded = rd.decode_diagram_content(encoded)
        assert decoded == original

    def test_decode_passthrough_plain_xml(self):
        """If content is not encoded, decode_diagram_content returns it as-is."""
        plain = '<mxGraphModel><root/></mxGraphModel>'
        assert rd.decode_diagram_content(plain) == plain


# ── clean_label() ─────────────────────────────────────────────


class TestCleanLabel:
    """clean_label strips HTML tags and normalises whitespace."""

    def test_strips_html_tags(self):
        assert rd.clean_label("<b>Order</b> <i>Service</i>") == "Order Service"

    def test_replaces_nbsp(self):
        assert rd.clean_label("A&nbsp;B") == "A B"

    def test_empty_string(self):
        assert rd.clean_label("") == ""

    def test_none_returns_empty(self):
        assert rd.clean_label(None) == ""

    def test_br_tags(self):
        assert rd.clean_label("Order<br>Service") == "Order Service"


# ── get_cell_label() ──────────────────────────────────────────


class TestGetCellLabel:
    """get_cell_label extracts text from object or mxCell elements."""

    def test_object_element(self):
        elem = ET.fromstring('<object label="  Order Service  "/>')
        assert rd.get_cell_label(elem) == "Order Service"

    def test_mxcell_element(self):
        elem = ET.fromstring('<mxCell value="Payment Gateway"/>')
        assert rd.get_cell_label(elem) == "Payment Gateway"

    def test_empty_label(self):
        elem = ET.fromstring('<object label=""/>')
        assert rd.get_cell_label(elem) == ""


# ── find_matching_registry_entry() ────────────────────────────


class TestFindMatchingRegistryEntry:
    """find_matching_registry_entry does exact and case-insensitive match."""

    def test_exact_match(self):
        registry = {"Order Service": {"name": "Order Service"}}
        assert rd.find_matching_registry_entry("Order Service", registry) is not None

    def test_case_insensitive_match(self):
        registry = {"Order Service": {"name": "Order Service"}}
        result = rd.find_matching_registry_entry("order service", registry)
        assert result is not None
        assert result["name"] == "Order Service"

    def test_no_match(self):
        registry = {"Order Service": {"name": "Order Service"}}
        assert rd.find_matching_registry_entry("Unknown Service", registry) is None

    def test_html_in_label_is_cleaned(self):
        registry = {"Order Service": {"name": "Order Service"}}
        result = rd.find_matching_registry_entry("<b>Order Service</b>", registry)
        assert result is not None

    def test_empty_label(self):
        registry = {"Order Service": {"name": "Order Service"}}
        assert rd.find_matching_registry_entry("", registry) is None

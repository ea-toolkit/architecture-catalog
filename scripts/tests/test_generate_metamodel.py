"""Tests for generate_metamodel.py — Piece 2 meta-model generator."""

import sys
from pathlib import Path

import pytest

# Add scripts dir to path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from generate_metamodel import (
    extract_metamodel,
    generate_yaml,
    label_to_folder_segment,
    label_to_key,
    validate_metamodel,
)


EXAMPLE_DIAGRAM = Path(__file__).resolve().parent.parent.parent / "models" / "meta-model-example.drawio"


# ─────────────────────────────────────────────────────────────
# Unit tests: label_to_key
# ─────────────────────────────────────────────────────────────

class TestLabelToKey:
    def test_simple(self) -> None:
        assert label_to_key("Component") == "component"

    def test_multi_word(self) -> None:
        assert label_to_key("Business Capability") == "business_capability"

    def test_special_chars(self) -> None:
        assert label_to_key("API Endpoint (v2)") == "api_endpoint_v2"

    def test_leading_trailing_spaces(self) -> None:
        assert label_to_key("  Domain  ") == "domain"


# ─────────────────────────────────────────────────────────────
# Unit tests: label_to_folder_segment
# ─────────────────────────────────────────────────────────────

class TestLabelToFolderSegment:
    def test_simple(self) -> None:
        assert label_to_folder_segment("Component") == "components"

    def test_multi_word(self) -> None:
        assert label_to_folder_segment("Software System") == "software-systems"

    def test_pluralizes(self) -> None:
        assert label_to_folder_segment("Domain") == "domains"


# ─────────────────────────────────────────────────────────────
# Integration tests: example diagram parsing
# ─────────────────────────────────────────────────────────────

class TestExampleDiagram:
    @pytest.fixture()
    def metamodel(self) -> dict:
        assert EXAMPLE_DIAGRAM.exists(), f"Example diagram not found: {EXAMPLE_DIAGRAM}"
        return extract_metamodel(EXAMPLE_DIAGRAM)

    def test_layers_count(self, metamodel: dict) -> None:
        assert len(metamodel["layers"]) == 4

    def test_layer_keys(self, metamodel: dict) -> None:
        keys = set(metamodel["layers"].keys())
        assert keys == {"business", "organization", "application", "technology"}

    def test_layer_properties(self, metamodel: dict) -> None:
        biz = metamodel["layers"]["business"]
        assert biz["name"] == "Business"
        assert biz["color"] == "#a855f7"
        assert biz["icon"] == "B"

    def test_element_count(self, metamodel: dict) -> None:
        assert len(metamodel["elements"]) == 10

    def test_element_keys(self, metamodel: dict) -> None:
        keys = set(metamodel["elements"].keys())
        assert "domain" in keys
        assert "component" in keys
        assert "software_system" in keys

    def test_domain_is_anchor(self, metamodel: dict) -> None:
        domain = metamodel["elements"]["domain"]
        assert domain["graph_rank"] == 0

    def test_extra_fields(self, metamodel: dict) -> None:
        cap = metamodel["elements"]["business_capability"]
        assert "maturity" in cap["extra_fields"]
        assert "sourcing" in cap["extra_fields"]

    def test_relationships(self, metamodel: dict) -> None:
        domain = metamodel["elements"]["domain"]
        assert "composes_components" in domain["relationships"]
        rel = domain["relationships"]["composes_components"]
        assert rel["target"] == "component"
        assert rel["type"] == "composition"

    def test_relationship_types(self, metamodel: dict) -> None:
        assert "composition" in metamodel["relationship_types"]
        assert "realization" in metamodel["relationship_types"]
        comp = metamodel["relationship_types"]["composition"]
        assert comp["outgoing"] == "Composes"
        assert comp["incoming"] == "Part of"

    def test_relationship_inverse(self, metamodel: dict) -> None:
        domain = metamodel["elements"]["domain"]
        rel = domain["relationships"]["composes_components"]
        assert rel["inverse"] == "parent_domain"


# ─────────────────────────────────────────────────────────────
# Validation tests
# ─────────────────────────────────────────────────────────────

class TestValidation:
    def test_valid_diagram_passes(self) -> None:
        metamodel = extract_metamodel(EXAMPLE_DIAGRAM)
        issues = validate_metamodel(metamodel)
        assert len(issues) == 0

    def test_empty_layers(self) -> None:
        metamodel = {"layers": {}, "elements": {}, "relationship_types": {}}
        issues = validate_metamodel(metamodel)
        assert any("No layers" in i for i in issues)

    def test_empty_elements(self) -> None:
        metamodel = {
            "layers": {"app": {"name": "App"}},
            "elements": {},
            "relationship_types": {},
        }
        issues = validate_metamodel(metamodel)
        assert any("No element types" in i for i in issues)

    def test_unknown_layer_reference(self) -> None:
        metamodel = {
            "layers": {"app": {"name": "App"}},
            "elements": {
                "comp": {
                    "key": "comp",
                    "label": "Component",
                    "layer": "nonexistent",
                    "graph_rank": 0,
                    "extra_fields": {},
                    "relationships": {},
                }
            },
            "relationship_types": {},
        }
        issues = validate_metamodel(metamodel)
        assert any("unknown layer" in i for i in issues)

    def test_unknown_relationship_target(self) -> None:
        metamodel = {
            "layers": {"app": {"name": "App"}},
            "elements": {
                "comp": {
                    "key": "comp",
                    "label": "Component",
                    "layer": "app",
                    "graph_rank": 0,
                    "extra_fields": {},
                    "relationships": {
                        "uses_thing": {
                            "target": "nonexistent",
                            "type": "serving",
                        }
                    },
                }
            },
            "relationship_types": {},
        }
        issues = validate_metamodel(metamodel)
        assert any("unknown element" in i for i in issues)


# ─────────────────────────────────────────────────────────────
# YAML generation tests
# ─────────────────────────────────────────────────────────────

class TestYamlGeneration:
    def test_generates_valid_structure(self) -> None:
        metamodel = extract_metamodel(EXAMPLE_DIAGRAM)
        yaml_data = generate_yaml(metamodel)

        assert yaml_data["version"] == "1.0"
        assert yaml_data["registry_root"] == "registry-v2"
        assert "layers" in yaml_data
        assert "elements" in yaml_data
        assert "relationship_types" in yaml_data
        assert "domain_color_palette" in yaml_data
        assert "site" in yaml_data

    def test_elements_have_standard_fields(self) -> None:
        metamodel = extract_metamodel(EXAMPLE_DIAGRAM)
        yaml_data = generate_yaml(metamodel)

        for key, element in yaml_data["elements"].items():
            fields = element["fields"]
            assert "name" in fields
            assert "type" in fields
            assert "status" in fields

    def test_domain_anchor_skips_domain_field(self) -> None:
        metamodel = extract_metamodel(EXAMPLE_DIAGRAM)
        yaml_data = generate_yaml(metamodel)

        domain_el = yaml_data["elements"]["domain"]
        assert "domain" not in domain_el["fields"]

    def test_non_anchor_has_domain_field(self) -> None:
        metamodel = extract_metamodel(EXAMPLE_DIAGRAM)
        yaml_data = generate_yaml(metamodel)

        comp_el = yaml_data["elements"]["component"]
        assert "domain" in comp_el["fields"]

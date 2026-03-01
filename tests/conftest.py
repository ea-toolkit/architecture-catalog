"""Shared fixtures for init_registry tests."""

import pytest
import yaml
from pathlib import Path


@pytest.fixture
def minimal_mapping() -> dict:
    """A minimal registry-mapping.yaml as a Python dict.

    Contains 2 layers, 2 element types (one with relationships, one without),
    and 1 relationship type — just enough to exercise init_registry.py.
    """
    return {
        "version": "1.0",
        "registry_root": "test-registry",
        "site": {
            "name": "Test Catalog",
            "description": "Test architecture registry",
            "logo_text": "T",
        },
        "layers": {
            "business": {
                "name": "Business",
                "color": "#f59e0b",
                "bg": "#fffbeb",
                "icon": "B",
            },
            "application": {
                "name": "Application",
                "color": "#3b82f6",
                "bg": "#eff6ff",
                "icon": "A",
            },
        },
        "relationship_types": {
            "composition": {
                "outgoing": "Composes",
                "incoming": "Part of",
                "icon": "◆",
            },
        },
        "elements": {
            "service": {
                "label": "Service",
                "layer": "business",
                "folder": "1-business/services",
                "id_field": "name",
                "archimate": "business-service",
                "graph_rank": 1,
                "icon": "⚙️",
                "fields": {
                    "type": {"type": "string", "required": True, "label": "Type"},
                    "name": {"type": "string", "required": True, "label": "Name"},
                    "description": {"type": "string", "required": False, "label": "Description"},
                    "status": {"type": "string", "required": False, "label": "Status"},
                },
                "relationships": {},
            },
            "component": {
                "label": "Component",
                "layer": "application",
                "folder": "2-application/components",
                "id_field": "name",
                "archimate": "application-component",
                "graph_rank": 2,
                "icon": "🧩",
                "fields": {
                    "type": {"type": "string", "required": True, "label": "Type"},
                    "name": {"type": "string", "required": True, "label": "Name"},
                    "description": {"type": "string", "required": False, "label": "Description"},
                    "owner": {"type": "string", "required": False, "label": "Owner"},
                    "status": {"type": "string", "required": False, "label": "Status"},
                },
                "relationships": {
                    "composes_services": {
                        "target": "service",
                        "type": "composition",
                        "cardinality": "many",
                    },
                },
            },
        },
    }


@pytest.fixture
def mapping_file(tmp_path: Path, minimal_mapping: dict) -> Path:
    """Write the minimal mapping to a YAML file in tmp_path and return its path."""
    mapping_path = tmp_path / "models" / "registry-mapping.yaml"
    mapping_path.parent.mkdir(parents=True)
    with open(mapping_path, "w") as f:
        yaml.dump(minimal_mapping, f, default_flow_style=False)
    return mapping_path

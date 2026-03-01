"""Shared fixtures for architecture-catalog tests."""

import sys
import pytest
import yaml
from pathlib import Path

# Add scripts/ to path so all test modules can import scripts
sys.path.insert(0, str(Path(__file__).resolve().parent.parent / "scripts"))


# ── init_registry fixtures ──────────────────────────────────────

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


# ── Shared fixtures for validate / dashboard / library ──────────

@pytest.fixture
def sample_registry_elements() -> list:
    """Mock registry elements for testing stats and grouping."""
    return [
        {"name": "Order Service", "owner": "Team A", "domain": "customer-management",
         "status": "active", "layer": "application", "element_type": "components",
         "sourcing": "in-house", "specialization": ""},
        {"name": "Payment Gateway", "owner": "Team B", "domain": "billing-and-payments",
         "status": "active", "layer": "application", "element_type": "components",
         "sourcing": "vendor", "specialization": ""},
        {"name": "User Management", "owner": "Team A", "domain": "customer-management",
         "status": "active", "layer": "application", "element_type": "functions",
         "sourcing": "in-house", "specialization": ""},
        {"name": "Report Generator", "owner": "Team C", "domain": "analytics-and-insights",
         "status": "active", "layer": "application", "element_type": "components",
         "sourcing": "hybrid", "specialization": ""},
        {"name": "Infra Node", "owner": "Platform", "domain": "customer-management",
         "status": "active", "layer": "technology", "element_type": "nodes",
         "sourcing": "", "specialization": ""},
    ]


@pytest.fixture
def sample_drawio_xml() -> str:
    """Minimal valid .drawio XML with ArchiMate shapes."""
    return '''<?xml version="1.0" encoding="UTF-8"?>
<mxfile>
  <diagram name="Test-View">
    <mxGraphModel>
      <root>
        <mxCell id="0"/>
        <mxCell id="1" parent="0"/>
        <object id="2" label="Order Service">
          <mxCell style="shape=mxgraph.archimate3.application;appType=comp;fillColor=#99ffff" vertex="1" parent="1">
            <mxGeometry x="100" y="100" width="160" height="80" as="geometry"/>
          </mxCell>
        </object>
        <mxCell id="3" value="Payment Gateway" style="shape=mxgraph.archimate3.application;appType=comp;fillColor=#99ffff" vertex="1" parent="1">
          <mxGeometry x="300" y="100" width="160" height="80" as="geometry"/>
        </mxCell>
        <mxCell id="4" value="Business Process" style="shape=mxgraph.archimate3.business;busType=process;fillColor=#ffff99" vertex="1" parent="1">
          <mxGeometry x="100" y="250" width="160" height="80" as="geometry"/>
        </mxCell>
      </root>
    </mxGraphModel>
  </diagram>
</mxfile>'''

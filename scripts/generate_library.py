#!/usr/bin/env python3
"""
Generate draw.io libraries from the element registry.

Creates per-domain libraries organized by element type, so architects
import only what they need. Each library file contains shapes with
embedded properties (owner, domain, status, specialization) visible
in draw.io's "Edit Data" panel.

Usage:
    python3 scripts/generate_library.py
    # Creates libraries/<domain>/<element-type>.xml

Output structure:
    libraries/
      novacrm-platform/
        components.xml
        data-objects.xml
        functions.xml
        actors.xml
      novacrm-platform/
        components.xml
        functions.xml
      cross-cutting/
        principles.xml
        capabilities.xml
      ...
"""

import json
import html
import frontmatter
from pathlib import Path
from collections import defaultdict

REPO_ROOT = Path(__file__).resolve().parent.parent
REGISTRY_DIR = REPO_ROOT / "registry"
LIBRARIES_DIR = REPO_ROOT / "libraries"

# ArchiMate layer fill colors (from real draw.io ArchiMate stencils)
LAYER_COLORS = {
    "application": "#99ffff",
    "business": "#ffff99",
    "technology": "#99ff99",
    "strategy": "#F5DEAA",
    "motivation": "#CCCCFF",
    "implementation": "#FFE0E0",
    "physical": "#99ff99",
    "composite": "#E0E0E0",
}

# Map registry element types to draw.io shape styles
# Using correct draw.io ArchiMate 3 stencil styles
ELEMENT_TYPE_SHAPES = {
    # Application layer
    ("application", "components"): "html=1;outlineConnect=0;whiteSpace=wrap;shape=mxgraph.archimate3.application;appType=comp;archiType=square",
    ("application", "services"): "html=1;outlineConnect=0;whiteSpace=wrap;shape=mxgraph.archimate3.application;appType=serv;archiType=rounded",
    ("application", "interfaces"): "html=1;outlineConnect=0;whiteSpace=wrap;shape=mxgraph.archimate3.application;appType=interface;archiType=square",
    ("application", "functions"): "html=1;outlineConnect=0;whiteSpace=wrap;shape=mxgraph.archimate3.application;appType=func;archiType=rounded",
    ("application", "interactions"): "html=1;outlineConnect=0;whiteSpace=wrap;shape=mxgraph.archimate3.application;appType=interaction;archiType=rounded",
    ("application", "events"): "html=1;outlineConnect=0;whiteSpace=wrap;shape=mxgraph.archimate3.application;appType=event;archiType=rounded",
    ("application", "data-objects"): "html=1;outlineConnect=0;whiteSpace=wrap;shape=mxgraph.archimate3.application;appType=passive;archiType=square",
    ("application", "collaborations"): "html=1;outlineConnect=0;whiteSpace=wrap;shape=mxgraph.archimate3.application;appType=collaboration;archiType=square",
    ("application", "processes"): "html=1;outlineConnect=0;whiteSpace=wrap;shape=mxgraph.archimate3.application;appType=proc;archiType=rounded",

    # Business layer
    ("business", "actors"): "html=1;outlineConnect=0;whiteSpace=wrap;shape=mxgraph.archimate3.application;appType=actor;archiType=square",
    ("business", "roles"): "html=1;outlineConnect=0;whiteSpace=wrap;shape=mxgraph.archimate3.business;busType=role",
    ("business", "processes"): "html=1;outlineConnect=0;whiteSpace=wrap;shape=mxgraph.archimate3.business;busType=process",
    ("business", "services"): "html=1;outlineConnect=0;whiteSpace=wrap;shape=mxgraph.archimate3.business;busType=service",
    ("business", "functions"): "html=1;outlineConnect=0;whiteSpace=wrap;shape=mxgraph.archimate3.business;busType=function",
    ("business", "interfaces"): "html=1;outlineConnect=0;whiteSpace=wrap;shape=mxgraph.archimate3.business;busType=interface",
    ("business", "events"): "html=1;outlineConnect=0;whiteSpace=wrap;shape=mxgraph.archimate3.business;busType=event",
    ("business", "objects"): "html=1;outlineConnect=0;whiteSpace=wrap;shape=mxgraph.archimate3.business;busType=object",
    ("business", "collaborations"): "html=1;outlineConnect=0;whiteSpace=wrap;shape=mxgraph.archimate3.business;busType=collaboration",
    ("business", "interactions"): "html=1;outlineConnect=0;whiteSpace=wrap;shape=mxgraph.archimate3.business;busType=interaction",
    ("business", "contracts"): "html=1;outlineConnect=0;whiteSpace=wrap;shape=mxgraph.archimate3.business;busType=contract",
    ("business", "representations"): "html=1;outlineConnect=0;whiteSpace=wrap;shape=mxgraph.archimate3.business;busType=representation",
    ("business", "products"): "html=1;outlineConnect=0;whiteSpace=wrap;shape=mxgraph.archimate3.application;appType=product;archiType=square",

    # Technology layer
    ("technology", "nodes"): "html=1;outlineConnect=0;whiteSpace=wrap;shape=mxgraph.archimate3.tech;techType=node",
    ("technology", "devices"): "html=1;outlineConnect=0;whiteSpace=wrap;shape=mxgraph.archimate3.tech;techType=device",
    ("technology", "system-software"): "html=1;outlineConnect=0;whiteSpace=wrap;shape=mxgraph.archimate3.tech;techType=systemSoftware",
    ("technology", "artifacts"): "html=1;outlineConnect=0;whiteSpace=wrap;shape=mxgraph.archimate3.tech;techType=artifact",
    ("technology", "services"): "html=1;outlineConnect=0;whiteSpace=wrap;shape=mxgraph.archimate3.tech;techType=service",
    ("technology", "interfaces"): "html=1;outlineConnect=0;whiteSpace=wrap;shape=mxgraph.archimate3.tech;techType=interface",
    ("technology", "functions"): "html=1;outlineConnect=0;whiteSpace=wrap;shape=mxgraph.archimate3.tech;techType=function",
    ("technology", "processes"): "html=1;outlineConnect=0;whiteSpace=wrap;shape=mxgraph.archimate3.tech;techType=process",
    ("technology", "communication-networks"): "html=1;outlineConnect=0;whiteSpace=wrap;shape=mxgraph.archimate3.tech;techType=communicationNetwork",
    ("technology", "paths"): "html=1;outlineConnect=0;whiteSpace=wrap;shape=mxgraph.archimate3.tech;techType=path",
    ("technology", "collaborations"): "html=1;outlineConnect=0;whiteSpace=wrap;shape=mxgraph.archimate3.tech;techType=collaboration",
    ("technology", "interactions"): "html=1;outlineConnect=0;whiteSpace=wrap;shape=mxgraph.archimate3.tech;techType=interaction",

    # Strategy layer
    ("strategy", "capabilities"): "html=1;outlineConnect=0;whiteSpace=wrap;shape=mxgraph.archimate3.capability",
    ("strategy", "resources"): "html=1;outlineConnect=0;whiteSpace=wrap;shape=mxgraph.archimate3.resource",
    ("strategy", "courses-of-action"): "html=1;outlineConnect=0;whiteSpace=wrap;shape=mxgraph.archimate3.courseOfAction",
    ("strategy", "value-streams"): "html=1;outlineConnect=0;whiteSpace=wrap;shape=mxgraph.archimate3.valueStream",

    # Motivation layer
    ("motivation", "stakeholders"): "html=1;outlineConnect=0;whiteSpace=wrap;shape=mxgraph.archimate3.stakeholder",
    ("motivation", "drivers"): "html=1;outlineConnect=0;whiteSpace=wrap;shape=mxgraph.archimate3.driver",
    ("motivation", "assessments"): "html=1;outlineConnect=0;whiteSpace=wrap;shape=mxgraph.archimate3.assessment",
    ("motivation", "goals"): "html=1;outlineConnect=0;whiteSpace=wrap;shape=mxgraph.archimate3.goal",
    ("motivation", "outcomes"): "html=1;outlineConnect=0;whiteSpace=wrap;shape=mxgraph.archimate3.outcome",
    ("motivation", "principles"): "html=1;outlineConnect=0;whiteSpace=wrap;shape=mxgraph.archimate3.principle",
    ("motivation", "requirements"): "html=1;outlineConnect=0;whiteSpace=wrap;shape=mxgraph.archimate3.requirement",
    ("motivation", "constraints"): "html=1;outlineConnect=0;whiteSpace=wrap;shape=mxgraph.archimate3.constraint",
    ("motivation", "meanings"): "html=1;outlineConnect=0;whiteSpace=wrap;shape=mxgraph.archimate3.meaning",
    ("motivation", "values"): "html=1;outlineConnect=0;whiteSpace=wrap;shape=mxgraph.archimate3.value",

    # Implementation layer
    ("implementation", "work-packages"): "html=1;outlineConnect=0;whiteSpace=wrap;shape=mxgraph.archimate3.workPackage",
    ("implementation", "deliverables"): "html=1;outlineConnect=0;whiteSpace=wrap;shape=mxgraph.archimate3.deliverable",
    ("implementation", "plateaus"): "html=1;outlineConnect=0;whiteSpace=wrap;shape=mxgraph.archimate3.plateau",
    ("implementation", "gaps"): "html=1;outlineConnect=0;whiteSpace=wrap;shape=mxgraph.archimate3.gap",

    # Physical layer
    ("physical", "equipment"): "html=1;outlineConnect=0;whiteSpace=wrap;shape=mxgraph.archimate3.equipment",
    ("physical", "facilities"): "html=1;outlineConnect=0;whiteSpace=wrap;shape=mxgraph.archimate3.facility",
    ("physical", "distribution-networks"): "html=1;outlineConnect=0;whiteSpace=wrap;shape=mxgraph.archimate3.distributionNetwork",
    ("physical", "materials"): "html=1;outlineConnect=0;whiteSpace=wrap;shape=mxgraph.archimate3.material",

    # Composite
    ("composite", "locations"): "html=1;outlineConnect=0;whiteSpace=wrap;shape=mxgraph.archimate3.location",
    ("composite", "groupings"): "html=1;outlineConnect=0;whiteSpace=wrap;shape=mxgraph.archimate3.grouping",
}

# Default dimensions for shapes
DEFAULT_WIDTH = 160
DEFAULT_HEIGHT = 80


def load_registry():
    """Load all registered elements from the registry."""
    elements = []
    if not REGISTRY_DIR.exists():
        return elements

    for md_file in REGISTRY_DIR.rglob("*.md"):
        if md_file.name == "_template.md":
            continue
        try:
            post = frontmatter.load(md_file)
            if "name" not in post.metadata:
                continue

            rel = md_file.relative_to(REGISTRY_DIR)
            parts = rel.parts
            layer = parts[0] if len(parts) > 1 else "unknown"
            element_type = parts[1] if len(parts) > 2 else "unknown"

            elements.append({
                "name": post.metadata["name"].strip(),
                "layer": layer,
                "element_type": element_type,
                "domain": post.metadata.get("domain", ""),
                "owner": post.metadata.get("owner", ""),
                "status": post.metadata.get("status", "active"),
                "specialization": post.metadata.get("specialization", ""),
            })
        except Exception as e:
            print(f"  WARNING: Could not parse {md_file}: {e}")

    return elements


def create_shape_xml(element):
    """Create the XML for a single shape in the library.

    Uses <object> wrapper to embed properties (owner, domain, status,
    specialization) that show up in draw.io's Edit Data panel.
    Uses correct draw.io ArchiMate 3 stencil styles with archiType and
    layer-appropriate fill colors.
    """
    name = element["name"]
    layer = element["layer"]
    element_type = element["element_type"]

    # Get the shape style
    key = (layer, element_type)
    shape_style = ELEMENT_TYPE_SHAPES.get(key)
    if not shape_style:
        print(f"  WARNING: No shape mapping for {key}, skipping {name}")
        return None

    # Get fill color for this layer
    fill_color = LAYER_COLORS.get(layer, "#FFFFFF")

    # Build the full style string
    style = f"{shape_style};fillColor={fill_color};"

    # Escape values for XML attributes
    escaped_name = html.escape(name, quote=True)

    # Build property attributes for <object> wrapper
    props = {
        "label": escaped_name,
        "owner": html.escape(element.get("owner", ""), quote=True),
        "domain": html.escape(element.get("domain", ""), quote=True),
        "status": html.escape(element.get("status", "active"), quote=True),
        "layer": html.escape(layer, quote=True),
        "element_type": html.escape(element_type, quote=True),
    }
    if element.get("specialization"):
        props["specialization"] = html.escape(element["specialization"], quote=True)

    # Build the <object> attribute string
    obj_attrs = " ".join(f'{k}="{v}"' for k, v in props.items())

    # Create the mxGraphModel XML using <object> wrapper for properties
    shape_xml = (
        f'<mxGraphModel><root>'
        f'<mxCell id="0"/>'
        f'<mxCell id="1" parent="0"/>'
        f'<object {obj_attrs} id="2">'
        f'<mxCell style="{style}" vertex="1" parent="1">'
        f'<mxGeometry width="{DEFAULT_WIDTH}" height="{DEFAULT_HEIGHT}" as="geometry"/>'
        f'</mxCell>'
        f'</object>'
        f'</root></mxGraphModel>'
    )

    # HTML-encode only angle brackets for draw.io library format
    # (quotes must stay as-is for valid JSON)
    encoded_xml = shape_xml.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")

    return {
        "xml": encoded_xml,
        "w": DEFAULT_WIDTH,
        "h": DEFAULT_HEIGHT,
        "title": name,
        "aspect": "fixed",
    }


def write_library(library_items, output_path):
    """Write a draw.io library file."""
    output_path.parent.mkdir(parents=True, exist_ok=True)
    library_json = json.dumps(library_items, indent=2)
    output_path.write_text(f"<mxlibrary>{library_json}</mxlibrary>\n")
    return len(library_items)


def main():
    print("=" * 60)
    print("draw.io Library Generator")
    print("=" * 60)

    # Load registry
    elements = load_registry()
    print(f"\nLoaded {len(elements)} elements from registry")

    specs = [e for e in elements if e.get("specialization")]
    if specs:
        print(f"  Including {len(specs)} specialized elements")

    # Group elements by domain, then by library category
    # Use specialization name when available (e.g., "Systems", "Data Concepts")
    # Fall back to ArchiMate element type when no specialization exists
    by_domain_category = defaultdict(lambda: defaultdict(list))
    for elem in elements:
        domain = elem.get("domain") or "cross-cutting"
        spec = elem.get("specialization", "").strip()
        if spec:
            # Normalize specialization to kebab-case for filenames
            category = spec.lower().replace(" ", "-")
        else:
            category = elem["element_type"]
        by_domain_category[domain][category].append(elem)

    # Generate per-domain/category libraries
    print(f"\nGenerating per-domain libraries...")
    total_files = 0
    total_shapes = 0

    for domain in sorted(by_domain_category.keys()):
        categories = by_domain_category[domain]
        for category in sorted(categories.keys()):
            elems = sorted(categories[category], key=lambda x: x["name"])
            library_items = []
            for elem in elems:
                shape = create_shape_xml(elem)
                if shape:
                    library_items.append(shape)

            if library_items:
                # Filename encodes the full path: <domain>.<category>.xml
                # This shows clearly in draw.io's shapes panel when multiple
                # domain libraries are imported side by side
                filename = f"{domain}.{category}.xml"
                output_path = LIBRARIES_DIR / domain / filename
                count = write_library(library_items, output_path)
                total_files += 1
                total_shapes += count
                print(f"  {domain}/{filename} — {count} shapes")

    print(f"\nGenerated {total_files} library files with {total_shapes} total shapes")
    print(f"Output: {LIBRARIES_DIR}/")

    print("\nTo use in draw.io:")
    print("  1. Open draw.io (VS Code plugin or web)")
    print("  2. Click '+' in the shapes panel")
    print("  3. Click 'Open Library from' → 'Device'")
    print("  4. Select a library from libraries/<domain>/<type>.xml")
    print("  5. Import as many domain libraries as you need")


if __name__ == "__main__":
    main()

#!/usr/bin/env python3
"""
Validate draw.io architecture diagrams against the element registry.

Parses .drawio files, extracts ArchiMate elements, and checks that
every element used in a diagram is registered in the correct registry layer.

Features:
  - Layer-scoped validation (application shapes → registry/application/)
  - Domain coverage report (elements and views per domain)
  - Domain maturity check (required view types per domain)
  - Layer statistics (elements per ArchiMate layer)
  - Orphan detection (registered elements not used in any diagram)
  - JSON output (--format json) for CI/dashboards
"""

import argparse
import json
import xml.etree.ElementTree as ET
import frontmatter
import sys
from collections import defaultdict
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
REGISTRY_DIR = REPO_ROOT / "registry"
VIEWS_DIR = REPO_ROOT / "views"

# Map draw.io ArchiMate shape styles to registry folders.
# draw.io uses two patterns:
#   1. Layer-level shapes: "mxgraph.archimate3.application" with appType=comp, etc.
#   2. Individual shapes: "mxgraph.archimate3.workPackage", "mxgraph.archimate3.deliverable", etc.
SHAPE_PREFIX = "mxgraph.archimate3."

# Shapes that use the layer-level pattern (shape name = layer)
LAYER_SHAPES = {
    "application": "application",
    "business": "business",
    "tech": "technology",
    "technology": "technology",
    "strategy": "strategy",
    "motivation": "motivation",
    "implementation": "implementation",
}

# Shapes that use individual names (shape name = element type)
INDIVIDUAL_SHAPES = {
    # Implementation & Migration
    "workPackage": "implementation",
    "deliverable": "implementation",
    "plateau": "implementation",
    "gap": "implementation",
    "implementationEvent": "implementation",
    # Strategy
    "capability": "strategy",
    "resource": "strategy",
    "courseOfAction": "strategy",
    "valueStream": "strategy",
    # Motivation
    "stakeholder": "motivation",
    "driver": "motivation",
    "assessment": "motivation",
    "goal": "motivation",
    "outcome": "motivation",
    "principle": "motivation",
    "requirement": "motivation",
    "constraint": "motivation",
    "meaning": "motivation",
    "value": "motivation",
    # Physical
    "equipment": "physical",
    "facility": "physical",
    "distributionNetwork": "physical",
    "material": "physical",
    # Composite
    "location": "composite",
    "grouping": "composite",
    # Junction (structural, not a registered element)
    "junction": None,
}

# ArchiMate layers in display order
LAYER_ORDER = [
    "strategy", "motivation", "business", "application",
    "technology", "physical", "implementation", "composite",
]

# Known domains (derived from views folder structure)
KNOWN_DOMAINS = [
    "novacrm-platform",
]

# Required view types for domain maturity
REQUIRED_VIEW_TYPES = [
    "application-landscape",
    "technology-landscape",
    "data-model",
]


def get_archimate_layer(shape_name):
    """Determine the registry layer for a draw.io ArchiMate shape name."""
    if not shape_name.startswith(SHAPE_PREFIX):
        return None

    suffix = shape_name[len(SHAPE_PREFIX):]

    # Check layer-level shapes first
    if suffix in LAYER_SHAPES:
        return LAYER_SHAPES[suffix]

    # Check individual element shapes
    if suffix in INDIVIDUAL_SHAPES:
        return INDIVIDUAL_SHAPES[suffix]

    # Unknown ArchiMate shape — still flag it so we can add it later
    return "unknown"


def load_registry():
    """Load all registered elements with rich metadata from the registry."""
    elements = []
    if not REGISTRY_DIR.exists():
        return elements

    for md_file in REGISTRY_DIR.rglob("*.md"):
        # Skip template file
        if md_file.name == "_template.md":
            continue
        try:
            post = frontmatter.load(md_file)
            if "name" not in post.metadata:
                continue

            # Derive layer and element_type from file path
            rel = md_file.relative_to(REGISTRY_DIR)
            parts = rel.parts  # e.g. ('application', 'components', 'order-service.md')
            layer = parts[0] if len(parts) > 1 else "unknown"
            element_type = parts[1] if len(parts) > 2 else "unknown"

            elements.append({
                "name": post.metadata["name"].strip(),
                "owner": post.metadata.get("owner", ""),
                "domain": post.metadata.get("domain", ""),
                "status": post.metadata.get("status", ""),
                "layer": layer,
                "element_type": element_type,
                "file": str(md_file.relative_to(REPO_ROOT)),
            })
        except Exception as e:
            print(f"  WARNING: Could not parse {md_file}: {e}")

    return elements


def build_layer_registry(registry_elements):
    """Build a layer-scoped registry lookup: {(layer, name): element}."""
    lookup = {}
    for elem in registry_elements:
        key = (elem["layer"], elem["name"])
        lookup[key] = elem
    return lookup


def parse_drawio_style(style_str):
    """Parse a draw.io style string into a dict."""
    props = {}
    if not style_str:
        return props
    for part in style_str.split(";"):
        if "=" in part:
            key, val = part.split("=", 1)
            props[key.strip()] = val.strip()
    return props


def extract_archimate_elements_from_cells(cells, tab_name):
    """Extract ArchiMate elements from a list of mxCell/object elements."""
    elements = []

    for cell in cells:
        # Handle both plain mxCell and object wrappers
        if cell.tag == "object":
            value = cell.get("label", "")
            inner_cell = cell.find("mxCell")
            if inner_cell is None:
                continue
            style_str = inner_cell.get("style", "")
        else:
            value = cell.get("value", "")
            style_str = cell.get("style", "")

        if not value or not style_str:
            continue

        style = parse_drawio_style(style_str)
        shape = style.get("shape", "")

        layer = get_archimate_layer(shape)
        if layer:
            clean_name = value.replace("<br>", " ").replace("<br/>", " ").strip()
            elements.append({
                "name": clean_name,
                "layer": layer,
                "tab": tab_name,
                "cell_id": cell.get("id"),
            })

    return elements


def extract_archimate_elements(drawio_path):
    """Extract ArchiMate element names and their types from a .drawio file."""
    tree = ET.parse(drawio_path)
    root = tree.getroot()

    elements = []

    # Check if the file has <diagram> tabs (standard draw.io format)
    diagrams = root.findall(".//diagram")

    if diagrams:
        for diagram in diagrams:
            tab_name = diagram.get("name", "unnamed")
            cells = list(diagram.iter("mxCell")) + list(diagram.iter("object"))
            elements.extend(extract_archimate_elements_from_cells(cells, tab_name))
    else:
        # Fallback: no <diagram> wrapper, just a raw <mxGraphModel>
        cells = list(root.iter("mxCell")) + list(root.iter("object"))
        elements.extend(extract_archimate_elements_from_cells(cells, "default"))

    return elements


def get_domain_from_path(file_path):
    """Extract the domain name from a view file path."""
    rel = file_path.relative_to(VIEWS_DIR)
    return rel.parts[0] if rel.parts else "unknown"


def get_view_type_from_path(file_path):
    """Extract the view type from a file name (e.g., 'application-landscape' from 'application-landscape.drawio')."""
    return file_path.stem


def get_domain_files(domain):
    """Get all files in a domain folder."""
    domain_dir = VIEWS_DIR / domain
    if not domain_dir.exists():
        return [], []

    drawio_files = list(domain_dir.glob("*.drawio"))
    other_files = [f for f in domain_dir.iterdir()
                   if f.is_file() and f.suffix != ".drawio" and f.name != ".gitkeep"]
    return drawio_files, other_files


def check_domain_maturity(domain):
    """Check which required view types exist for a domain."""
    domain_dir = VIEWS_DIR / domain
    if not domain_dir.exists():
        return {vt: False for vt in REQUIRED_VIEW_TYPES}

    existing_stems = {f.stem for f in domain_dir.glob("*.drawio")}
    return {vt: vt in existing_stems for vt in REQUIRED_VIEW_TYPES}


def validate(output_format="text"):
    """Run validation: check all diagram elements exist in the correct registry layer."""
    # Load registry with rich metadata
    registry_elements = load_registry()

    # Build layer-scoped lookup: {(layer, name): element}
    layer_registry = build_layer_registry(registry_elements)

    # Also keep a global name set for orphan detection
    all_registered_names = {e["name"] for e in registry_elements}

    # Build domain -> elements mapping
    domain_elements = defaultdict(list)
    for elem in registry_elements:
        domain_elements[elem["domain"]].append(elem)

    # Build layer -> elements mapping
    layer_elements = defaultdict(list)
    for elem in registry_elements:
        layer_elements[elem["layer"]].append(elem)

    # Find all .drawio files in domain folders (new structure: views/*/*.drawio)
    drawio_files = sorted(VIEWS_DIR.glob("*/*.drawio"))
    # Exclude template
    drawio_files = [f for f in drawio_files if f.name != "_template.drawio"]

    # Extract elements from all diagrams
    diagram_results = []
    all_diagram_element_keys = set()  # (layer, name) tuples
    all_diagram_element_names = set()  # just names for orphan detection
    domain_views = defaultdict(list)
    layer_in_diagrams = defaultdict(set)

    for drawio_path in drawio_files:
        rel_path = drawio_path.relative_to(REPO_ROOT)
        domain = get_domain_from_path(drawio_path)
        elements = extract_archimate_elements(drawio_path)
        domain_views[domain].append(str(rel_path))

        for elem in elements:
            all_diagram_element_keys.add((elem["layer"], elem["name"]))
            all_diagram_element_names.add(elem["name"])
            layer_in_diagrams[elem["layer"]].add(elem["name"])

        diagram_results.append({
            "file": str(rel_path),
            "domain": domain,
            "view_type": get_view_type_from_path(drawio_path),
            "elements": elements,
        })

    # Find validation errors using LAYER-SCOPED validation
    errors = []
    for result in diagram_results:
        for elem in result["elements"]:
            # Check if (layer, name) exists in registry
            key = (elem["layer"], elem["name"])
            if key not in layer_registry:
                # Check if name exists in a DIFFERENT layer (helpful error message)
                wrong_layer = None
                for reg_elem in registry_elements:
                    if reg_elem["name"] == elem["name"] and reg_elem["layer"] != elem["layer"]:
                        wrong_layer = reg_elem["layer"]
                        break

                errors.append({
                    "file": result["file"],
                    "element": elem["name"],
                    "layer": elem["layer"],
                    "wrong_layer": wrong_layer,
                })

    # Find orphan elements (registered but not in any diagram)
    orphans = []
    for elem in registry_elements:
        if elem["name"] not in all_diagram_element_names:
            orphans.append(elem)

    # Build domain coverage data
    domain_coverage = []
    for domain in KNOWN_DOMAINS:
        elems = domain_elements.get(domain, [])
        views = domain_views.get(domain, [])
        drawio_files_domain, other_files = get_domain_files(domain)
        maturity = check_domain_maturity(domain)
        maturity_score = sum(1 for v in maturity.values() if v)
        maturity_total = len(REQUIRED_VIEW_TYPES)
        has_content = len(elems) > 0 or len(views) > 0 or len(other_files) > 0

        domain_coverage.append({
            "domain": domain,
            "elements": len(elems),
            "views": len(drawio_files_domain),
            "diagrams": len(other_files),
            "maturity_score": maturity_score,
            "maturity_total": maturity_total,
            "maturity_details": maturity,
            "has_content": has_content,
        })

    # Also include cross-cutting domain if it has elements
    cross_cutting = domain_elements.get("cross-cutting", [])
    if cross_cutting:
        domain_coverage.append({
            "domain": "cross-cutting",
            "elements": len(cross_cutting),
            "views": 0,
            "diagrams": 0,
            "maturity_score": 0,
            "maturity_total": 0,
            "maturity_details": {},
            "has_content": True,
        })

    # Build layer statistics
    layer_stats = []
    for layer in LAYER_ORDER:
        registered_count = len(layer_elements.get(layer, []))
        in_diagrams_count = len(layer_in_diagrams.get(layer, set()))
        if registered_count > 0 or in_diagrams_count > 0:
            layer_stats.append({
                "layer": layer.capitalize(),
                "registered": registered_count,
                "in_diagrams": in_diagrams_count,
            })

    # Total counts
    total_elements_checked = sum(len(r["elements"]) for r in diagram_results)

    # JSON output
    if output_format == "json":
        output = {
            "status": "FAILED" if errors else "PASSED",
            "registry": {
                "total_elements": len(registry_elements),
                "elements": [{"name": e["name"], "layer": e["layer"]}
                           for e in sorted(registry_elements, key=lambda x: x["name"])],
            },
            "diagrams": {
                "total_files": len(drawio_files),
                "total_elements_checked": total_elements_checked,
                "registered": total_elements_checked - len(errors),
                "unregistered": len(errors),
            },
            "errors": errors,
            "domain_coverage": domain_coverage,
            "layer_statistics": layer_stats,
            "orphan_elements": [{
                "name": o["name"],
                "location": f"{o['layer']}/{o['element_type']}",
            } for o in orphans],
        }
        print(json.dumps(output, indent=2))
        return 1 if errors else 0

    # Text output
    print("=" * 60)
    print("Architecture Model Validator")
    print("=" * 60)

    # Registry summary
    print(f"\nRegistry: {len(registry_elements)} elements registered")
    for elem in sorted(registry_elements, key=lambda x: (x["layer"], x["name"])):
        print(f"  - {elem['name']} ({elem['layer']}/{elem['element_type']})")

    if not drawio_files:
        print("\nNo .drawio files found in views/*/")
        return 0

    print(f"\nScanning {len(drawio_files)} diagram(s)...\n")

    # Per-diagram validation
    for result in diagram_results:
        print(f"--- {result['file']} ({len(result['elements'])} ArchiMate elements) ---")
        for elem in result["elements"]:
            tab_info = f" | tab: {elem['tab']}" if elem.get("tab", "default") != "default" else ""
            key = (elem["layer"], elem["name"])
            if key in layer_registry:
                print(f"  OK   {elem['name']} ({elem['layer']}{tab_info})")
            else:
                # Find if it exists in wrong layer
                wrong_layer = None
                for reg_elem in registry_elements:
                    if reg_elem["name"] == elem["name"]:
                        wrong_layer = reg_elem["layer"]
                        break
                if wrong_layer:
                    print(f"  FAIL {elem['name']} ({elem['layer']}{tab_info}) - WRONG LAYER (registered in {wrong_layer})")
                else:
                    print(f"  FAIL {elem['name']} ({elem['layer']}{tab_info}) - NOT IN REGISTRY")

    # Domain coverage report with maturity
    print("\n" + "=" * 60)
    print("Domain Coverage & Maturity:")
    for dc in domain_coverage:
        if dc["maturity_total"] > 0:
            maturity_str = f"{dc['maturity_score']}/{dc['maturity_total']} required views"
            missing = [k for k, v in dc["maturity_details"].items() if not v]
            if missing:
                maturity_str += f" (missing: {', '.join(missing)})"
        else:
            maturity_str = ""

        status = "" if dc["has_content"] else "  \u26a0 NO CONTENT"
        print(f"  {dc['domain']:40s} {dc['elements']:2d} elements, "
              f"{dc['views']:2d} views, {dc['diagrams']:2d} other{status}")
        if maturity_str:
            print(f"    Maturity: {maturity_str}")

    # Layer statistics
    print(f"\nLayer Statistics:")
    for ls in layer_stats:
        print(f"  {ls['layer']:20s} {ls['registered']:3d} registered, "
              f"{ls['in_diagrams']:3d} in diagrams")

    # Orphan elements
    if orphans:
        print(f"\nOrphan Elements (registered but not in any diagram):")
        for o in sorted(orphans, key=lambda x: x["name"]):
            print(f"  - {o['name']} ({o['layer']}/{o['element_type']})")

    # Validation summary
    print("\n" + "=" * 60)
    print(f"Total elements checked: {total_elements_checked}")
    print(f"Registered: {total_elements_checked - len(errors)}")
    print(f"Unregistered: {len(errors)}")

    if errors:
        print("\nFAILED - The following elements are not in the registry:\n")
        for err in errors:
            if err.get("wrong_layer"):
                print(f"  [{err['file']}] {err['element']}")
                print(f"    -> Shape is {err['layer']}, but registered in {err['wrong_layer']}")
                print(f"    -> Either change the shape type or register in registry/{err['layer']}/\n")
            else:
                print(f"  [{err['file']}] {err['element']}")
                suggested = err['element'].lower().replace(' ', '-')
                print(f"    -> Register it: registry/{err['layer']}/<subfolder>/{suggested}.md\n")
        return 1
    else:
        print("\nPASSED - All elements are registered in the correct layer.")
        return 0


def main():
    parser = argparse.ArgumentParser(
        description="Validate draw.io architecture diagrams against the element registry."
    )
    parser.add_argument(
        "--format",
        choices=["text", "json"],
        default="text",
        help="Output format (default: text)",
    )
    args = parser.parse_args()
    sys.exit(validate(output_format=args.format))


if __name__ == "__main__":
    main()

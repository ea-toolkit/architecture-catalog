#!/usr/bin/env python3
"""
Meta-Model Generator — Piece 2

Parses a draw.io meta-model diagram and generates registry-mapping.yaml.

Convention: see models/meta-model-convention.md for how to draw the diagram.

Usage:
    python scripts/generate_metamodel.py <path-to.drawio>
    python scripts/generate_metamodel.py <path-to.drawio> --output models/registry-mapping.yaml
    python scripts/generate_metamodel.py <path-to.drawio> --validate
"""

from __future__ import annotations

import argparse
import re
import sys
import xml.etree.ElementTree as ET
from pathlib import Path
from typing import Any

import yaml


# ─────────────────────────────────────────────────────────────
# Constants
# ─────────────────────────────────────────────────────────────

DEFAULT_LAYERS_PALETTE = [
    {"color": "#a855f7", "bg": "#faf5ff", "icon": "B"},
    {"color": "#f59e0b", "bg": "#fffbeb", "icon": "O"},
    {"color": "#3b82f6", "bg": "#eff6ff", "icon": "A"},
    {"color": "#10b981", "bg": "#ecfdf5", "icon": "T"},
]

DEFAULT_DOMAIN_PALETTE = [
    "#3b82f6", "#8b5cf6", "#ec4899", "#f59e0b", "#06b6d4",
    "#84cc16", "#f97316", "#10b981", "#ef4444", "#6366f1",
]

DEFAULT_RELATIONSHIP_TYPES: dict[str, dict[str, str]] = {
    "composition": {"outgoing": "Composes", "incoming": "Part of", "icon": "◇"},
    "aggregation": {"outgoing": "Owns", "incoming": "Owned by", "icon": "◆"},
    "realization": {"outgoing": "Realizes", "incoming": "Realized by", "icon": "▲"},
    "serving": {"outgoing": "Serves", "incoming": "Served by", "icon": "→"},
    "assignment": {"outgoing": "Assigned to", "incoming": "Assigned from", "icon": "⊕"},
    "access": {"outgoing": "Accesses", "incoming": "Accessed by", "icon": "⊙"},
}

STANDARD_FIELDS: dict[str, dict[str, Any]] = {
    "type": {"type": "string", "required": False, "label": "Element Type"},
    "name": {"type": "string", "required": True, "label": "Name"},
    "description": {"type": "string", "required": False, "label": "Description"},
    "owner": {"type": "string", "required": False, "label": "Owner"},
    "domain": {"type": "string", "required": False, "label": "Domain"},
    "status": {"type": "string", "required": False, "label": "Status"},
}

DEFAULT_ICONS = {"B": "📋", "O": "🎯", "A": "🧩", "T": "🖧"}


# ─────────────────────────────────────────────────────────────
# Parsing
# ─────────────────────────────────────────────────────────────

def label_to_key(label: str) -> str:
    """Convert a human label to a snake_case key."""
    key = label.strip().lower()
    key = re.sub(r"[^a-z0-9]+", "_", key)
    return key.strip("_")


def label_to_folder_segment(label: str) -> str:
    """Convert a human label to a kebab-case folder segment."""
    segment = label.strip().lower()
    segment = re.sub(r"[^a-z0-9]+", "-", segment)
    return segment.strip("-") + "s"  # pluralize


def get_custom_property(cell: ET.Element, prop_name: str) -> str | None:
    """Extract a custom property from a cell's Object child."""
    obj = cell.find("Object[@as='customProperties']")
    if obj is not None:
        return obj.get(prop_name)
    # Also check for inline attributes on the cell
    return cell.get(prop_name)


def get_custom_properties(cell: ET.Element) -> dict[str, str]:
    """Extract all custom properties from a cell."""
    props: dict[str, str] = {}
    obj = cell.find("Object[@as='customProperties']")
    if obj is not None:
        for key, val in obj.attrib.items():
            if key != "as":
                props[key] = val
    return props


def parse_style(style_str: str) -> dict[str, str]:
    """Parse draw.io style string into dict."""
    props: dict[str, str] = {}
    if not style_str:
        return props
    for part in style_str.split(";"):
        if "=" in part:
            k, v = part.split("=", 1)
            props[k.strip()] = v.strip()
        elif part.strip():
            props[part.strip()] = "true"
    return props


# ─────────────────────────────────────────────────────────────
# Core extraction
# ─────────────────────────────────────────────────────────────

def extract_metamodel(drawio_path: Path) -> dict[str, Any]:
    """Parse a draw.io meta-model and return structured data."""
    tree = ET.parse(drawio_path)
    root = tree.getroot()

    diagram = root.find(".//diagram")
    if diagram is None:
        raise ValueError("No <diagram> element found in draw.io file")

    model = diagram.find(".//mxGraphModel")
    if model is None:
        raise ValueError("No <mxGraphModel> found in diagram")

    cells = model.findall(".//mxCell")

    # Categorize cells
    layers: dict[str, dict[str, Any]] = {}
    elements: dict[str, dict[str, Any]] = {}
    relationships: list[dict[str, Any]] = []
    relationship_types: dict[str, dict[str, str]] = {}
    cell_parent_map: dict[str, str] = {}

    # First pass: identify all cells and their parents
    for cell in cells:
        cell_id = cell.get("id", "")
        parent_id = cell.get("parent", "")
        cell_parent_map[cell_id] = parent_id

    # Second pass: identify layers (swimlanes)
    for cell in cells:
        cell_id = cell.get("id", "")
        style_str = cell.get("style", "")
        style = parse_style(style_str)
        value = cell.get("value", "")

        if "swimlane" in style or "swimlane" in style_str:
            props = get_custom_properties(cell)
            layer_key = props.get("layer", label_to_key(value))
            layer_idx = len(layers)
            palette = DEFAULT_LAYERS_PALETTE[layer_idx] if layer_idx < len(DEFAULT_LAYERS_PALETTE) else {}

            layers[cell_id] = {
                "key": layer_key,
                "name": value,
                "color": props.get("layerColor", style.get("strokeColor", palette.get("color", "#666"))),
                "bg": props.get("layerBg", style.get("fillColor", palette.get("bg", "#f5f5f5"))),
                "icon": props.get("layerIcon", palette.get("icon", value[0] if value else "?")),
            }

    # Third pass: identify element types (non-edge cells inside layers)
    for cell in cells:
        cell_id = cell.get("id", "")
        parent_id = cell.get("parent", "")
        is_edge = cell.get("edge") == "1"
        value = cell.get("value", "").strip()

        if is_edge or not value or cell_id in ("0", "1"):
            continue

        # Check if this cell is a relationship types table
        props = get_custom_properties(cell)
        if props.get("metamodel_type") == "relationship_types":
            data = props.get("data", "")
            for row in data.split(";"):
                parts = [p.strip() for p in row.split("|")]
                if len(parts) >= 4:
                    relationship_types[parts[0]] = {
                        "outgoing": parts[1],
                        "incoming": parts[2],
                        "icon": parts[3],
                    }
            continue

        # Skip if it's a layer itself
        if cell_id in layers:
            continue

        # Check if parent is a layer
        if parent_id not in layers:
            continue

        # This is an element type
        layer_info = layers[parent_id]
        key = props.get("key", label_to_key(value))
        icon = props.get("icon", DEFAULT_ICONS.get(layer_info["icon"], "📋"))
        graph_rank = int(props.get("graph_rank", "1"))
        badge_category = props.get("badge_category", key.split("_")[-1] if "_" in key else key)
        id_field = props.get("id_field", "name")

        # Parse extra fields
        extra_fields: dict[str, dict[str, Any]] = {}
        fields_str = props.get("fields", "")
        if fields_str:
            for field_def in fields_str.split(","):
                parts = [p.strip() for p in field_def.split(":")]
                if len(parts) >= 3:
                    extra_fields[parts[0]] = {
                        "type": parts[1],
                        "required": False,
                        "label": parts[2],
                    }
                elif len(parts) == 2:
                    extra_fields[parts[0]] = {
                        "type": parts[1],
                        "required": False,
                        "label": parts[0].replace("_", " ").title(),
                    }

        # Auto-generate folder path
        layer_key = layer_info["key"]
        layer_number = list(layers.values()).index(layer_info) + 1
        folder_prefix = f"{layer_number}-{layer_key}"
        folder_segment = props.get("folder", f"{folder_prefix}/{label_to_folder_segment(value)}")

        elements[cell_id] = {
            "key": key,
            "label": value,
            "layer": layer_key,
            "folder": folder_segment,
            "id_field": id_field,
            "graph_rank": graph_rank,
            "icon": icon,
            "badge_category": badge_category,
            "extra_fields": extra_fields,
            "relationships": {},
        }

    # Fourth pass: extract relationships (edges)
    for cell in cells:
        if cell.get("edge") != "1":
            continue

        source_id = cell.get("source", "")
        target_id = cell.get("target", "")
        value = cell.get("value", "").strip()

        if not source_id or not target_id or not value:
            continue

        props = get_custom_properties(cell)
        rel_type = props.get("type", "serving")
        cardinality = props.get("cardinality", "many")
        resolve_by = props.get("resolve_by", "name")
        inverse = props.get("inverse", "~")
        required = props.get("required", "false").lower() == "true"

        if source_id in elements and target_id in elements:
            target_key = elements[target_id]["key"]
            elements[source_id]["relationships"][value] = {
                "target": target_key,
                "type": rel_type,
                "cardinality": cardinality,
                "resolve_by": resolve_by,
                "inverse": inverse if inverse != "~" else "~",
                "required": required,
            }

    # Use defaults if no relationship types defined
    if not relationship_types:
        relationship_types = DEFAULT_RELATIONSHIP_TYPES

    return {
        "layers": {info["key"]: info for info in layers.values()},
        "elements": {info["key"]: info for info in elements.values()},
        "relationship_types": relationship_types,
    }


# ─────────────────────────────────────────────────────────────
# YAML generation
# ─────────────────────────────────────────────────────────────

def generate_yaml(metamodel: dict[str, Any]) -> dict[str, Any]:
    """Convert extracted meta-model to registry-mapping.yaml structure."""
    output: dict[str, Any] = {
        "version": "1.0",
        "registry_root": "registry-v2",
    }

    # Site metadata
    output["site"] = {
        "name": "Architecture Catalog",
        "company": "Your Company",
        "description": "Enterprise architecture registry",
        "logo_text": "A",
    }

    # Layers
    layers_section: dict[str, Any] = {}
    for key, info in metamodel["layers"].items():
        layers_section[key] = {
            "name": info["name"],
            "color": f'"{info["color"]}"',
            "bg": f'"{info["bg"]}"',
            "icon": info["icon"],
        }
    output["layers"] = layers_section

    # Relationship types
    output["relationship_types"] = metamodel["relationship_types"]

    # Domain color palette
    output["domain_color_palette"] = DEFAULT_DOMAIN_PALETTE

    # Elements
    elements_section: dict[str, Any] = {}
    for key, info in metamodel["elements"].items():
        # Build fields: standard + extra
        fields: dict[str, Any] = {}
        for fname, fdef in STANDARD_FIELDS.items():
            # Skip domain field for domain-anchor elements (graph_rank 0)
            if fname == "domain" and info["graph_rank"] == 0:
                continue
            fields[fname] = dict(fdef)

        for fname, fdef in info["extra_fields"].items():
            fields[fname] = dict(fdef)

        # Build relationships
        relationships: dict[str, Any] = {}
        for rel_name, rel_info in info["relationships"].items():
            rel_entry: dict[str, Any] = {
                "target": rel_info["target"],
                "type": rel_info["type"],
                "cardinality": rel_info["cardinality"],
                "resolve_by": rel_info["resolve_by"],
                "inverse": rel_info["inverse"],
                "required": rel_info["required"],
            }
            relationships[rel_name] = rel_entry

        element_entry: dict[str, Any] = {
            "label": info["label"],
            "layer": info["layer"],
            "folder": info["folder"],
            "id_field": info["id_field"],
            "graph_rank": info["graph_rank"],
            "icon": info["icon"],
            "badge_category": info["badge_category"],
            "fields": fields,
        }
        if relationships:
            element_entry["relationships"] = relationships

        elements_section[key] = element_entry

    output["elements"] = elements_section
    return output


# ─────────────────────────────────────────────────────────────
# Validation
# ─────────────────────────────────────────────────────────────

def validate_metamodel(metamodel: dict[str, Any]) -> list[str]:
    """Validate the extracted meta-model and return list of issues."""
    issues: list[str] = []

    if not metamodel["layers"]:
        issues.append("No layers found. Use swimlane shapes to define layers.")

    if not metamodel["elements"]:
        issues.append("No element types found. Place rectangle shapes inside layer swimlanes.")

    # Check for elements without layers
    known_layers = set(metamodel["layers"].keys())
    for key, info in metamodel["elements"].items():
        if info["layer"] not in known_layers:
            issues.append(f"Element '{key}' references unknown layer '{info['layer']}'")

    # Check for relationships pointing to unknown targets
    known_elements = set(metamodel["elements"].keys())
    for key, info in metamodel["elements"].items():
        for rel_name, rel_info in info["relationships"].items():
            if rel_info["target"] not in known_elements:
                issues.append(
                    f"Element '{key}' relationship '{rel_name}' targets "
                    f"unknown element '{rel_info['target']}'"
                )

    # Check for graph_rank 0 (domain anchor)
    has_anchor = any(
        info["graph_rank"] == 0 for info in metamodel["elements"].values()
    )
    if metamodel["elements"] and not has_anchor:
        issues.append(
            "No element with graph_rank=0 found. One element should be the domain anchor."
        )

    # Check for duplicate keys
    keys = [info["key"] for info in metamodel["elements"].values()]
    dupes = [k for k in set(keys) if keys.count(k) > 1]
    if dupes:
        issues.append(f"Duplicate element keys: {', '.join(dupes)}")

    return issues


# ─────────────────────────────────────────────────────────────
# Output
# ─────────────────────────────────────────────────────────────

def write_yaml(data: dict[str, Any], output_path: Path) -> None:
    """Write the registry-mapping YAML to a file."""

    class QuotedStr(str):
        """String that should be quoted in YAML output."""

    def quoted_representer(dumper: yaml.Dumper, data: QuotedStr) -> yaml.Node:
        return dumper.represent_scalar("tag:yaml.org,2002:str", data, style='"')

    yaml.add_representer(QuotedStr, quoted_representer)

    # Process the data to handle quoted strings (colors)
    def process_values(obj: Any) -> Any:
        if isinstance(obj, dict):
            result = {}
            for k, v in obj.items():
                if isinstance(v, str) and v.startswith('"') and v.endswith('"'):
                    result[k] = QuotedStr(v[1:-1])
                else:
                    result[k] = process_values(v)
            return result
        if isinstance(obj, list):
            return [process_values(item) for item in obj]
        return obj

    processed = process_values(data)
    output_path.parent.mkdir(parents=True, exist_ok=True)

    with open(output_path, "w") as f:
        yaml.dump(
            processed,
            f,
            default_flow_style=False,
            sort_keys=False,
            allow_unicode=True,
            width=120,
        )

    print(f"Generated: {output_path}")


def print_summary(metamodel: dict[str, Any]) -> None:
    """Print a human-readable summary of the meta-model."""
    print("\n── Meta-Model Summary ──────────────────────────")
    print(f"Layers:             {len(metamodel['layers'])}")
    print(f"Element types:      {len(metamodel['elements'])}")
    print(f"Relationship types: {len(metamodel['relationship_types'])}")

    total_rels = sum(
        len(info["relationships"]) for info in metamodel["elements"].values()
    )
    print(f"Relationships:      {total_rels}")

    print("\nLayers:")
    for key, info in metamodel["layers"].items():
        print(f"  {info['icon']} {info['name']} ({key})")

    print("\nElement types:")
    for key, info in metamodel["elements"].items():
        rel_count = len(info["relationships"])
        extra = len(info["extra_fields"])
        print(
            f"  {info['icon']} {info['label']} ({key}) "
            f"— rank {info['graph_rank']}, "
            f"{6 + extra} fields, {rel_count} relationships"
        )

    print("───────────────────────────────────────────────\n")


# ─────────────────────────────────────────────────────────────
# CLI
# ─────────────────────────────────────────────────────────────

def main() -> int:
    parser = argparse.ArgumentParser(
        description="Generate registry-mapping.yaml from a draw.io meta-model diagram"
    )
    parser.add_argument("drawio", type=Path, help="Path to the .drawio meta-model file")
    parser.add_argument(
        "--output", "-o", type=Path, default=None,
        help="Output path (default: <input>.generated.yaml)"
    )
    parser.add_argument(
        "--validate", action="store_true",
        help="Validate only — don't write output"
    )
    args = parser.parse_args()

    if not args.drawio.exists():
        print(f"Error: File not found: {args.drawio}", file=sys.stderr)
        return 1

    try:
        metamodel = extract_metamodel(args.drawio)
    except (ET.ParseError, ValueError) as e:
        print(f"Error parsing diagram: {e}", file=sys.stderr)
        return 1

    # Validate
    issues = validate_metamodel(metamodel)
    if issues:
        print("\nValidation issues:", file=sys.stderr)
        for issue in issues:
            print(f"  ⚠️  {issue}", file=sys.stderr)

    print_summary(metamodel)

    if args.validate:
        if issues:
            print("Validation failed with issues above.", file=sys.stderr)
            return 1
        print("Validation passed.")
        return 0

    # Generate YAML
    yaml_data = generate_yaml(metamodel)
    output_path = args.output or args.drawio.with_suffix(".generated.yaml")
    write_yaml(yaml_data, output_path)

    if issues:
        print(
            f"\nGenerated with {len(issues)} warning(s). Review before using.",
            file=sys.stderr,
        )

    return 0


if __name__ == "__main__":
    sys.exit(main())

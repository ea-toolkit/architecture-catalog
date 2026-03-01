#!/usr/bin/env python3
"""
Generate registry-v2/ folder structure and _template.md files from registry-mapping.yaml.

Reads the YAML schema and creates:
  - One folder per element type (from the `folder:` field)
  - One _template.md per folder with typed YAML frontmatter

Idempotent: safe to re-run. Overwrites _template.md files but never touches
other .md files (real data entries).

Usage:
    python scripts/init_registry.py              # default: models/registry-mapping.yaml
    python scripts/init_registry.py --mapping path/to/mapping.yaml
    python scripts/init_registry.py --dry-run    # show what would be created
"""

import argparse
import sys
from pathlib import Path

import yaml

REPO_ROOT = Path(__file__).resolve().parent.parent


def load_mapping(mapping_path: Path) -> dict:
    with open(mapping_path) as f:
        return yaml.safe_load(f)


def default_value(field_type: str) -> str:
    """Return the YAML default value string for a field type."""
    if field_type == "string":
        return '""'
    elif field_type == "string[]":
        return "[]"
    elif field_type == "number":
        return "0"
    elif field_type == "boolean":
        return "false"
    elif field_type == "object[]":
        return "[]"
    return '""'


def build_template(element_key: str, element: dict, mapping: dict) -> str:
    """Build _template.md content for an element type."""
    label = element.get("label", element_key)
    archimate = element.get("archimate", "~")
    fields = element.get("fields", {})
    relationships = element.get("relationships", {})

    lines = []
    lines.append("---")
    lines.append(f"# {'─' * 60}")
    lines.append(f"# {label}")
    lines.append(f"# Type: {element_key}")
    lines.append(f"# {'─' * 60}")
    lines.append("")

    # Core fields
    lines.append("# ── Core Fields ──────────────────────────────────────────────")
    for field_key, field_def in fields.items():
        ftype = field_def.get("type", "string")
        required = field_def.get("required", False)
        flabel = field_def.get("label", field_key)
        req_marker = "  # required" if required else ""

        if field_key == "status":
            lines.append(f'{field_key}: "draft"  # draft | active | deprecated')
        elif field_key == "type":
            lines.append(f'{field_key}: "{element_key}"')
        else:
            lines.append(f"{field_key}: {default_value(ftype)}{req_marker}")

    # Relationships
    if relationships:
        lines.append("")
        lines.append("# ── Relationships ────────────────────────────────────────────")

        # Look up relationship_types for icon/label
        rel_types = mapping.get("relationship_types", {})

        for rel_key, rel_def in relationships.items():
            target = rel_def.get("target", "?")
            rtype = rel_def.get("type", "association")
            cardinality = rel_def.get("cardinality", "many")

            # Get the relationship verb
            rt = rel_types.get(rtype, {})
            verb = rt.get("outgoing", rtype)
            icon = rt.get("icon", "→")

            # Find the target label
            elements = mapping.get("elements", {})
            target_label = elements.get(target, {}).get("label", target)

            lines.append(f"# {icon} {verb}: {target_label} ({cardinality})")
            if cardinality == "one":
                lines.append(f'{rel_key}: ""')
            else:
                lines.append(f"{rel_key}: []")

    # Alignment reference
    lines.append("")
    lines.append("# ── Alignment (reference only) ───────────────────────────────")
    lines.append(f"archimate_type: {archimate}")

    lines.append("---")
    lines.append("")
    lines.append("<!-- Extended description, notes, context -->")
    lines.append("")

    return "\n".join(lines)


def init_registry(mapping_path: Path, dry_run: bool = False) -> None:
    mapping = load_mapping(mapping_path)
    registry_root_name = mapping.get("registry_root", "registry-v2")
    registry_root = REPO_ROOT / registry_root_name
    elements = mapping.get("elements", {})

    if not elements:
        print("No elements found in mapping file.")
        sys.exit(1)

    created_folders = []
    created_templates = []

    for element_key, element in elements.items():
        folder_rel = element.get("folder")
        if not folder_rel:
            print(f"  SKIP {element_key}: no folder defined")
            continue

        folder_path = registry_root / folder_rel
        template_path = folder_path / "_template.md"

        # Create folder
        if not folder_path.exists():
            if dry_run:
                print(f"  MKDIR {folder_path.relative_to(REPO_ROOT)}")
            else:
                folder_path.mkdir(parents=True, exist_ok=True)
            created_folders.append(folder_path)

        # Generate template
        content = build_template(element_key, element, mapping)
        if dry_run:
            print(f"  WRITE {template_path.relative_to(REPO_ROOT)}")
        else:
            template_path.write_text(content)
        created_templates.append(template_path)

    # Also ensure registry root has a README
    readme_path = registry_root / "README.md"
    if not readme_path.exists() and not dry_run:
        layers = mapping.get("layers", {})
        readme_lines = ["# Registry\n", ""]
        readme_lines.append("Architecture element registry. Each sub-folder represents a layer.\n")
        readme_lines.append("")
        readme_lines.append("## Layers\n")
        for layer_key, layer_def in layers.items():
            name = layer_def.get("name", layer_key)
            readme_lines.append(f"- **{name}**")
        readme_lines.append("")
        readme_path.write_text("\n".join(readme_lines))

    # Summary
    action = "Would create" if dry_run else "Created"
    print(f"\n{action} {len(created_folders)} folders, {len(created_templates)} templates")
    print(f"Registry root: {registry_root.relative_to(REPO_ROOT)}")


def main():
    parser = argparse.ArgumentParser(description="Initialize registry-v2/ from registry-mapping.yaml")
    parser.add_argument(
        "--mapping",
        default=str(REPO_ROOT / "models" / "registry-mapping.yaml"),
        help="Path to registry-mapping.yaml",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Show what would be created without writing files",
    )
    args = parser.parse_args()

    mapping_path = Path(args.mapping)
    if not mapping_path.exists():
        print(f"ERROR: Mapping file not found: {mapping_path}")
        sys.exit(1)

    print(f"Reading mapping: {mapping_path}")
    init_registry(mapping_path, dry_run=args.dry_run)


if __name__ == "__main__":
    main()

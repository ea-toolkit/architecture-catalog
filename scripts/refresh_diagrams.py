#!/usr/bin/env python3
"""
Refresh draw.io diagrams with metadata from the registry.

Syncs enriched registry data (component, sourcing, etc.)
into diagram shapes as custom properties, so the data appears when
you inspect shapes in draw.io and in extracted YAMLs.

Usage:
    python scripts/refresh_diagrams.py                    # Refresh all diagrams
    python scripts/refresh_diagrams.py views/customer-management/*.drawio  # Specific files
    python scripts/refresh_diagrams.py --dry-run          # Preview changes
"""

import argparse
import base64
import copy
import sys
import urllib.parse
import xml.etree.ElementTree as ET
import zlib
from collections import defaultdict
from pathlib import Path

import frontmatter

REPO_ROOT = Path(__file__).resolve().parent.parent
REGISTRY_DIR = REPO_ROOT / "registry"
VIEWS_DIR = REPO_ROOT / "views"

# Registry fields to sync to diagrams (registry field -> diagram property name)
SYNC_FIELDS = {
    # Data objects
    "component": "component",
    "aggregate": "aggregate",
    "source_system": "source_system",
    "classification": "classification",
    # Components
    "parent_domain": "parent_domain",
    "sourcing": "sourcing",
    # Software systems
    "vendor": "vendor",
    # Common
    "domain": "domain",
    "owner": "owner",
    "specialization": "specialization",
}


def load_registry():
    """Load all registered elements with their metadata."""
    elements = {}
    if not REGISTRY_DIR.exists():
        return elements

    for md_file in REGISTRY_DIR.rglob("*.md"):
        if md_file.name == "_template.md":
            continue
        try:
            post = frontmatter.load(md_file)
            if "name" not in post.metadata:
                continue

            name = post.metadata["name"].strip()
            elements[name] = {
                "file": str(md_file.relative_to(REPO_ROOT)),
                **post.metadata,
            }
        except Exception as e:
            print(f"  WARNING: Could not parse {md_file}: {e}")

    return elements


def decode_diagram_content(encoded):
    """Decode draw.io's compressed diagram content."""
    try:
        # URL decode
        decoded = urllib.parse.unquote(encoded)
        # Base64 decode
        decoded_bytes = base64.b64decode(decoded)
        # Decompress (deflate)
        xml_str = zlib.decompress(decoded_bytes, -zlib.MAX_WBITS).decode("utf-8")
        return xml_str
    except Exception:
        # Not encoded, return as-is
        return encoded


def encode_diagram_content(xml_str):
    """Encode diagram content back to draw.io's compressed format."""
    try:
        # Compress (deflate)
        compressed = zlib.compress(xml_str.encode("utf-8"), 9)
        # Remove zlib header (first 2 bytes) and checksum (last 4 bytes)
        deflated = compressed[2:-4]
        # Base64 encode
        b64 = base64.b64encode(deflated).decode("utf-8")
        # URL encode
        encoded = urllib.parse.quote(b64, safe="")
        return encoded
    except Exception as e:
        print(f"  WARNING: Could not encode diagram: {e}")
        return xml_str


def get_cell_label(cell):
    """Extract the label/value from a cell or object element."""
    if cell.tag == "object":
        return cell.get("label", "").strip()
    return cell.get("value", "").strip()


def clean_label(label):
    """Clean HTML from label text."""
    if not label:
        return ""
    # Remove common HTML tags
    import re
    clean = re.sub(r"<[^>]+>", " ", label)
    clean = clean.replace("&nbsp;", " ")
    clean = " ".join(clean.split())
    return clean.strip()


def find_matching_registry_entry(label, registry):
    """Find a registry entry matching the label."""
    clean = clean_label(label)
    if not clean:
        return None

    # Exact match
    if clean in registry:
        return registry[clean]

    # Case-insensitive match
    lower = clean.lower()
    for name, entry in registry.items():
        if name.lower() == lower:
            return entry

    return None


def update_cell_with_registry_data(cell, registry_entry, dry_run=False):
    """Update a cell/object with registry metadata. Returns True if updated."""
    if registry_entry is None:
        return False

    changes = []

    # If it's a plain mxCell, we need to wrap it in an object to add custom properties
    if cell.tag == "mxCell":
        # We can't easily wrap in-place, so we'll add properties via style
        # For now, skip plain mxCells - only update objects
        return False

    # For object elements, add/update attributes
    for reg_field, diagram_prop in SYNC_FIELDS.items():
        if reg_field in registry_entry:
            value = registry_entry[reg_field]
            if value is None:
                continue

            # Convert lists to comma-separated strings
            if isinstance(value, list):
                value = ", ".join(str(v) for v in value)
            else:
                value = str(value)

            current = cell.get(diagram_prop, "")
            if current != value:
                changes.append((diagram_prop, current, value))
                if not dry_run:
                    cell.set(diagram_prop, value)

    return len(changes) > 0, changes


def refresh_diagram(drawio_path, registry, dry_run=False, verbose=False):
    """Refresh a single diagram with registry data."""
    tree = ET.parse(drawio_path)
    root = tree.getroot()

    updates = []
    total_cells = 0
    matched_cells = 0

    # Process all diagram tabs
    for diagram in root.findall(".//diagram"):
        tab_name = diagram.get("name", "unnamed")

        # Check if content is compressed
        if diagram.text and diagram.text.strip():
            # Compressed content
            xml_content = decode_diagram_content(diagram.text.strip())
            inner_root = ET.fromstring(f"<root>{xml_content}</root>")
            cells = list(inner_root.iter("object"))
            is_compressed = True
        else:
            # Uncompressed content in mxGraphModel
            cells = list(diagram.iter("object"))
            is_compressed = False

        for cell in cells:
            total_cells += 1
            label = get_cell_label(cell)
            if not label:
                continue

            entry = find_matching_registry_entry(label, registry)
            if entry:
                matched_cells += 1
                updated, changes = update_cell_with_registry_data(cell, entry, dry_run)
                if updated:
                    updates.append({
                        "tab": tab_name,
                        "label": clean_label(label),
                        "changes": changes,
                    })

        # If compressed, re-encode the content
        if is_compressed and not dry_run and updates:
            # Rebuild the inner XML
            inner_xml = "".join(ET.tostring(c, encoding="unicode") for c in inner_root)
            diagram.text = encode_diagram_content(inner_xml)

    # Write back if there were updates
    if updates and not dry_run:
        tree.write(drawio_path, encoding="utf-8", xml_declaration=True)

    return {
        "file": str(drawio_path.relative_to(REPO_ROOT)),
        "total_cells": total_cells,
        "matched_cells": matched_cells,
        "updates": updates,
    }


def main():
    parser = argparse.ArgumentParser(
        description="Refresh draw.io diagrams with registry metadata."
    )
    parser.add_argument(
        "files",
        nargs="*",
        help="Specific .drawio files to refresh (default: all in views/)",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Preview changes without writing files",
    )
    parser.add_argument(
        "-v", "--verbose",
        action="store_true",
        help="Show detailed output",
    )
    args = parser.parse_args()

    print("=" * 60)
    print("Diagram Refresh Tool")
    print("=" * 60)

    # Load registry
    registry = load_registry()
    print(f"\nLoaded {len(registry)} registry entries")

    # Find diagram files
    if args.files:
        drawio_files = [Path(f) for f in args.files if f.endswith(".drawio")]
    else:
        drawio_files = sorted(VIEWS_DIR.glob("**/*.drawio"))
        drawio_files = [f for f in drawio_files if f.name != "_template.drawio"]

    if not drawio_files:
        print("No .drawio files found")
        return 0

    print(f"Scanning {len(drawio_files)} diagram(s)...\n")

    if args.dry_run:
        print("DRY RUN - no files will be modified\n")

    # Process each diagram
    total_updates = 0
    for drawio_path in drawio_files:
        result = refresh_diagram(drawio_path, registry, args.dry_run, args.verbose)

        if result["updates"]:
            print(f"--- {result['file']} ---")
            print(f"  Matched {result['matched_cells']}/{result['total_cells']} cells")
            for update in result["updates"]:
                print(f"  Updated: {update['label']}")
                if args.verbose:
                    for prop, old, new in update["changes"]:
                        old_str = f"'{old}'" if old else "(empty)"
                        print(f"    {prop}: {old_str} -> '{new}'")
            total_updates += len(result["updates"])
        elif args.verbose:
            print(f"--- {result['file']} ---")
            print(f"  Matched {result['matched_cells']}/{result['total_cells']} cells (no changes)")

    # Summary
    print("\n" + "=" * 60)
    if args.dry_run:
        print(f"DRY RUN complete: {total_updates} cells would be updated")
    else:
        print(f"Refresh complete: {total_updates} cells updated")

    return 0


if __name__ == "__main__":
    sys.exit(main())

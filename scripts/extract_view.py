#!/usr/bin/env python3
"""
Extract structured YAML from draw.io diagram files.

Parses .drawio XML and produces a compact, AI-readable YAML summary
alongside the original file. Uses domain-reference.yaml to enrich
elements with descriptions, sourcing decisions, and data catalog links.

Supports multiple view types:
  - domain-context: Logical components, data concepts, integrations, adjacent domains
  - data-aggregate: Per-component aggregates, owned vs Read Model, entity relationships
  - data-architecture: Entity-relationship model with UML notation
  - security: Trust boundaries, data classification, authentication methods
  - auto: Detect view type from content (default)

Usage:
    python3 scripts/extract_view.py <path-to.drawio>
    python3 scripts/extract_view.py <path-to.drawio> --type domain-context
    python3 scripts/extract_view.py <path-to.drawio> --output /custom/path.yaml

Output is written next to the .drawio file as <filename>.extracted.yaml
"""

import argparse
import re
import sys
import xml.etree.ElementTree as ET
from collections import defaultdict
from pathlib import Path

import yaml

REPO_ROOT = Path(__file__).resolve().parent.parent
DEFAULT_REFERENCE = REPO_ROOT / "domains" / "example" / "domain-reference.yaml"


# ---------------------------------------------------------------------------
# XML parsing helpers
# ---------------------------------------------------------------------------

def parse_drawio(file_path):
    """Parse a .drawio file and return list of diagrams with elements and edges."""
    tree = ET.parse(file_path)
    root = tree.getroot()
    diagrams = []

    for diagram in root.findall(".//diagram"):
        tab_name = diagram.get("name", "Page-1")
        model = diagram.find(".//mxGraphModel")
        if model is None:
            continue

        cells = {}
        edges = []

        for elem in model.iter():
            if elem.tag == "object":
                cell_id = elem.get("id")
                mx = elem.find("mxCell")
                if mx is None:
                    continue
                cells[cell_id] = {
                    "id": cell_id,
                    "label": clean_label(elem.get("label", "")),
                    "style": mx.get("style", ""),
                    "parent": mx.get("parent", ""),
                    "is_edge": mx.get("edge") == "1",
                    "is_vertex": mx.get("vertex") == "1",
                    "source": mx.get("source", ""),
                    "target": mx.get("target", ""),
                    "geometry": extract_geometry(mx),
                    "metadata": extract_metadata(elem),
                    "has_metadata": True,
                }
                if mx.get("edge") == "1":
                    edges.append(cells[cell_id])

            elif elem.tag == "mxCell":
                cell_id = elem.get("id")
                if cell_id in ("0", "1"):
                    continue
                # Skip edge labels (they're captured via parent edge)
                parent_style = cells.get(elem.get("parent", ""), {}).get("style", "")
                if "edgeLabel" in elem.get("style", ""):
                    # Attach label to parent edge
                    parent_id = elem.get("parent", "")
                    if parent_id in cells:
                        cells[parent_id]["label"] = clean_label(elem.get("value", ""))
                    continue

                cells[cell_id] = {
                    "id": cell_id,
                    "label": clean_label(elem.get("value", "")),
                    "style": elem.get("style", ""),
                    "parent": elem.get("parent", ""),
                    "is_edge": elem.get("edge") == "1",
                    "is_vertex": elem.get("vertex") == "1",
                    "source": elem.get("source", ""),
                    "target": elem.get("target", ""),
                    "geometry": extract_geometry(elem),
                    "metadata": {},
                    "has_metadata": False,
                }
                if elem.get("edge") == "1":
                    edges.append(cells[cell_id])

        # Second pass: attach edge labels from edgeLabel cells
        for elem in model.iter():
            if elem.tag == "mxCell" and "edgeLabel" in elem.get("style", ""):
                parent_id = elem.get("parent", "")
                if parent_id in cells and cells[parent_id]["is_edge"]:
                    label = clean_label(elem.get("value", ""))
                    if label:
                        cells[parent_id]["label"] = label

        diagrams.append({
            "tab_name": tab_name,
            "cells": cells,
            "edges": edges,
        })

    return diagrams


def clean_label(raw):
    """Strip HTML tags and clean up whitespace from draw.io labels."""
    if not raw:
        return ""
    text = re.sub(r"<[^>]+>", " ", raw)
    text = text.replace("&nbsp;", " ").replace("&amp;", "&")
    text = re.sub(r"\s+", " ", text).strip()
    return text


def extract_geometry(mx_cell):
    """Extract position and size from mxGeometry child."""
    geo = mx_cell.find("mxGeometry")
    if geo is None:
        return None
    return {
        "x": float(geo.get("x", 0)),
        "y": float(geo.get("y", 0)),
        "w": float(geo.get("width", 0)),
        "h": float(geo.get("height", 0)),
    }


def extract_metadata(obj_elem):
    """Extract all attributes from <object> element as metadata dict."""
    skip = {"id", "label"}
    return {k: v for k, v in obj_elem.attrib.items() if k not in skip}


def get_shape_type(style):
    """Classify a shape based on its draw.io style string."""
    if not style:
        return "unknown"
    if "edgeLabel" in style:
        return "edge_label"
    if "group" in style and "connectable" not in style:
        return "group"
    if style == "group":
        return "group"

    # ArchiMate shapes
    if "mxgraph.archimate3" in style:
        if "appType=func" in style:
            return "archimate.function"
        if "appType=comp" in style:
            return "archimate.component"
        if "appType=passive" in style:
            return "archimate.data_object"
        if "appType=serv" in style:
            return "archimate.service"
        if "appType=interface" in style:
            return "archimate.interface"
        if "appType=actor" in style:
            return "archimate.actor"
        if "appType=proc" in style:
            return "archimate.process"
        if "appType=event" in style:
            return "archimate.event"
        if "appType=interaction" in style:
            return "archimate.interaction"
        if "appType=product" in style:
            return "archimate.product"
        if "busType=" in style:
            bus_match = re.search(r"busType=(\w+)", style)
            if bus_match:
                return f"archimate.business.{bus_match.group(1)}"
        if "techType=" in style:
            tech_match = re.search(r"techType=(\w+)", style)
            if tech_match:
                return f"archimate.tech.{tech_match.group(1)}"
        return "archimate.other"

    # Standard draw.io shapes
    if "shape=mxgraph.flowchart.database" in style:
        return "database"
    if "shape=mxgraph.basic.person" in style:
        return "person"
    if "shape=mxgraph.cisco" in style:
        return "network_device"
    if "shape=mxgraph.flowchart.document" in style:
        return "document"
    if "text;" in style and "html=1" in style:
        return "text_annotation"

    return "shape"


def get_fill_color(style):
    """Extract fill color from style string."""
    match = re.search(r"fillColor=(#[0-9a-fA-F]{6})", style)
    return match.group(1) if match else None


def get_edge_type(style):
    """Classify an edge based on its draw.io style string."""
    if not style:
        return "association"
    if "startArrow=diamondThin;startFill=1" in style:
        return "composition"
    if "startArrow=diamondThin;startFill=0" in style:
        return "aggregation"
    if "endArrow=block;endFill=0" in style and "dashed=1" in style:
        return "realization"
    if "endArrow=block;endFill=0" in style:
        return "generalization"
    if "endArrow=block" in style and "dashed=1" in style:
        return "flow"
    if "endArrow=none" in style:
        return "association"
    if "endArrow=block;endFill=1" in style:
        return "directed"
    return "association"


# ---------------------------------------------------------------------------
# Domain reference loading
# ---------------------------------------------------------------------------

def load_domain_reference(ref_path):
    """Load domain reference YAML for enrichment."""
    if not ref_path or not Path(ref_path).exists():
        return None
    with open(ref_path) as f:
        return yaml.safe_load(f)


def enrich_element(label, ref):
    """Look up an element in the domain reference and return enrichment data."""
    if not ref:
        return None

    # Check logical components
    for lc in ref.get("logical_components", []):
        names = [lc["name"]] + lc.get("aliases", [])
        if label in names:
            desc = lc.get("description") or ""
            result = {"type": "logical_component", "description": desc.strip()}
            if lc.get("sourcing"):
                result["sourcing"] = lc["sourcing"]
            if lc.get("sub_components"):
                result["sub_components"] = lc["sub_components"]
            return result

    # Check data concept groups
    for dc in ref.get("data_concept_groups", []):
        if label == dc["name"] or label in dc.get("data_aggregates", []):
            result = {"type": "data_concept"}
            if label == dc["name"]:
                result["identifier"] = dc.get("identifier")
                result["logical_component"] = dc.get("logical_component")
                result["aggregates"] = dc.get("data_aggregates", [])
            else:
                result["group"] = dc["name"]
                result["group_identifier"] = dc.get("identifier")
                result["logical_component"] = dc.get("logical_component")
            return result

    # Check integration boundaries
    for ib in ref.get("integration_boundaries", []):
        names = [ib["name"]] + ib.get("aliases", [])
        if label in names:
            return {
                "type": "integration_boundary",
                "partner_api": ib.get("partner_api"),
                "external_partners": ib.get("external_partners", []),
            }

    return None


# ---------------------------------------------------------------------------
# Tree builder — resolves parent-child containment
# ---------------------------------------------------------------------------

def build_containment_tree(cells):
    """Build a tree of elements based on parent-child relationships."""
    children_of = defaultdict(list)
    for cid, cell in cells.items():
        if cell["is_edge"]:
            continue
        parent = cell["parent"]
        children_of[parent].append(cid)

    return children_of


def resolve_label(cell_id, cells):
    """Get the display label for a cell, checking group children if needed."""
    cell = cells.get(cell_id)
    if not cell:
        return ""
    if cell["label"]:
        return cell["label"]
    # For groups, label might be on a child
    return ""


# ---------------------------------------------------------------------------
# View type detection
# ---------------------------------------------------------------------------

def detect_view_type(diagram):
    """Auto-detect the view type from diagram content."""
    cells = diagram["cells"]
    styles = [c["style"] for c in cells.values()]
    labels = [c["label"].lower() for c in cells.values()]
    all_styles = " ".join(styles)

    # Security indicators
    security_keywords = ["trust boundary", "untrusted", "dmz", "pii", "gdpr",
                         "data classification", "security zone", "waf",
                         "authentication", "authorization"]
    if any(kw in " ".join(labels) for kw in security_keywords):
        return "security"

    # Data aggregate indicators
    if any("[dc]" in l for l in labels) or any("(rm)" in l for l in labels):
        return "data-aggregate"

    # Data architecture indicators (UML relationships without containment)
    has_composition = "startArrow=diamondThin" in all_styles
    has_generalization = "endArrow=block;endFill=0" in all_styles and "dashed" not in all_styles
    if has_composition or has_generalization:
        archimate_count = sum(1 for s in styles if "mxgraph.archimate3" in s)
        if archimate_count > 0 and has_composition:
            return "data-architecture"

    # Domain context indicators
    has_functions = sum(1 for s in styles if "appType=func" in s)
    has_interfaces = sum(1 for s in styles if "appType=interface" in s)
    has_data_objects = sum(1 for s in styles if "appType=passive" in s)
    if has_functions >= 3 and has_interfaces >= 1:
        return "domain-context"

    # Default
    if "mxgraph.archimate3" in all_styles:
        return "domain-context"
    return "generic"


# ---------------------------------------------------------------------------
# Extractors per view type
# ---------------------------------------------------------------------------

def extract_domain_context(diagram, ref):
    """Extract domain context view into structured dict."""
    cells = diagram["cells"]
    edges = diagram["edges"]
    children_of = build_containment_tree(cells)

    result = {
        "view_type": "domain-context",
        "tab": diagram["tab_name"],
    }

    # Find the domain container (outermost archimate.function)
    domain_container = None
    for cid, cell in cells.items():
        if cell["is_edge"] or not cell["is_vertex"]:
            continue
        shape = get_shape_type(cell["style"])
        if shape == "archimate.function" and cell["parent"] == "1":
            geo = cell.get("geometry")
            if geo and geo["w"] > 1000 and geo["h"] > 1000:
                domain_container = cell
                break

    if domain_container:
        result["domain"] = {
            "name": domain_container["label"],
        }
        if domain_container["has_metadata"]:
            result["domain"]["metadata"] = domain_container["metadata"]
        enrichment = enrich_element(domain_container["label"], ref)
        if enrichment and enrichment.get("description"):
            result["domain"]["description"] = enrichment["description"]

    # Collect logical components, integration boundaries, external elements
    logical_components = []
    integration_areas = []
    external_systems = []
    external_actors = []
    adjacent_domains = []

    # Walk all vertices
    for cid, cell in cells.items():
        if cell["is_edge"] or not cell["is_vertex"]:
            continue
        shape = get_shape_type(cell["style"])
        fill = get_fill_color(cell["style"])
        label = cell["label"]
        if not label:
            continue

        spec = cell.get("metadata", {}).get("specialization", "")

        # Logical components
        if spec == "Logical Component" or (
            shape == "archimate.function"
            and label != (domain_container or {}).get("label", "")
            and _is_inside_domain(cell, domain_container, cells, children_of)
        ):
            lc = _extract_logical_component(cid, cell, cells, edges, children_of, ref)
            if lc:
                logical_components.append(lc)

        # Integration areas (functions with "integration" in name)
        elif shape == "archimate.function" and "integrat" in label.lower():
            ia = _extract_integration_area(cid, cell, cells, children_of, ref)
            if ia:
                integration_areas.append(ia)

        # External systems (components outside domain)
        elif shape == "archimate.component" and not _is_inside_domain(
            cell, domain_container, cells, children_of
        ):
            entry = {"name": label}
            if cell["has_metadata"]:
                entry["metadata"] = {k: v for k, v in cell["metadata"].items()
                                     if k not in ("label",)}
            external_systems.append(entry)

        # External actors
        elif shape == "archimate.actor" or shape == "person":
            entry = {"name": label}
            if fill == "#ffff99":
                entry["layer"] = "business"
            external_actors.append(entry)

        # Adjacent domains (functions outside the domain container with "AA" or "domain" in name)
        elif shape == "archimate.function" and (
            "AA" in label or "domain" in label.lower()
        ) and label != (domain_container or {}).get("label", ""):
            if not _is_inside_domain(cell, domain_container, cells, children_of):
                adj = {"name": label}
                # Collect flows to/from this domain
                adj_flows = _extract_flows_for(cid, cells, edges)
                if adj_flows["incoming"]:
                    adj["receives"] = adj_flows["incoming"]
                if adj_flows["outgoing"]:
                    adj["sends"] = adj_flows["outgoing"]
                adjacent_domains.append(adj)

    if logical_components:
        result["logical_components"] = logical_components
    if integration_areas:
        result["integration_boundaries"] = integration_areas
    if external_systems:
        result["external_systems"] = external_systems
    if external_actors:
        result["external_actors"] = external_actors
    if adjacent_domains:
        result["adjacent_domains"] = adjacent_domains

    # Cross-domain data flows (edges between major areas)
    cross_flows = _extract_cross_domain_flows(cells, edges)
    if cross_flows:
        result["data_flows"] = cross_flows

    return result


def _is_inside_domain(cell, domain_container, cells, children_of):
    """Check if a cell is inside the domain container via parent chain."""
    if not domain_container:
        return False
    dc_id = domain_container["id"]
    current = cell["parent"]
    visited = set()
    while current and current not in ("0", "1") and current not in visited:
        visited.add(current)
        if current == dc_id:
            return True
        parent_cell = cells.get(current)
        if parent_cell:
            current = parent_cell["parent"]
        else:
            break
    # Also check by geometry (spatial containment)
    if cell.get("geometry") and domain_container.get("geometry"):
        cg = cell["geometry"]
        dg = domain_container["geometry"]
        # Resolve absolute position by walking parent chain
        abs_x, abs_y = _absolute_position(cell, cells)
        if (dg["x"] <= abs_x <= dg["x"] + dg["w"] and
                dg["y"] <= abs_y <= dg["y"] + dg["h"]):
            return True
    return False


def _absolute_position(cell, cells):
    """Calculate absolute x, y by walking the parent chain."""
    x = cell.get("geometry", {}).get("x", 0) if cell.get("geometry") else 0
    y = cell.get("geometry", {}).get("y", 0) if cell.get("geometry") else 0
    current = cell.get("parent", "")
    visited = set()
    while current and current not in ("0", "1") and current not in visited:
        visited.add(current)
        parent = cells.get(current)
        if parent and parent.get("geometry"):
            x += parent["geometry"].get("x", 0)
            y += parent["geometry"].get("y", 0)
            current = parent.get("parent", "")
        else:
            break
    return x, y


def _extract_logical_component(cid, cell, cells, edges, children_of, ref):
    """Extract a logical component with its data concepts and flows."""
    lc = {"name": cell["label"]}

    # Enrichment from reference
    enrichment = enrich_element(cell["label"], ref)
    if enrichment:
        if enrichment.get("description"):
            lc["description"] = enrichment["description"]
        if enrichment.get("sourcing"):
            lc["sourcing"] = enrichment["sourcing"]
        if enrichment.get("sub_components"):
            lc["contains"] = enrichment["sub_components"]

    if cell["has_metadata"]:
        lc["status"] = cell["metadata"].get("status", "active")

    # Find data concepts inside this component (via group hierarchy)
    data_concepts = []
    sub_components = []
    _collect_children(cid, cells, children_of, data_concepts, sub_components)

    if data_concepts:
        lc["data_concepts"] = data_concepts
    if sub_components:
        lc["sub_components"] = sub_components

    # Find flows
    flows = _extract_flows_for(cid, cells, edges)
    if flows["incoming"]:
        lc["incoming_flows"] = flows["incoming"]
    if flows["outgoing"]:
        lc["outgoing_flows"] = flows["outgoing"]

    return lc


def _collect_children(parent_id, cells, children_of, data_concepts, sub_components):
    """Recursively collect data concepts and sub-components under a parent."""
    for child_id in children_of.get(parent_id, []):
        child = cells.get(child_id)
        if not child or child["is_edge"]:
            continue

        shape = get_shape_type(child["style"])
        fill = get_fill_color(child["style"])
        label = child["label"]

        if shape == "group":
            # Recurse into groups
            _collect_children(child_id, cells, children_of, data_concepts, sub_components)
        elif shape == "archimate.data_object" and label:
            dc = {"name": label}
            if fill == "#fff2cc":
                dc["ownership"] = "read_model"
            else:
                dc["ownership"] = "owned"
            if child["has_metadata"]:
                spec = child["metadata"].get("specialization", "")
                if spec:
                    dc["specialization"] = spec
            data_concepts.append(dc)
        elif shape == "archimate.function" and label:
            # Sub-component (nested logical component)
            sub = {"name": label}
            sub_data = []
            sub_sub = []
            _collect_children(child_id, cells, children_of, sub_data, sub_sub)
            if sub_data:
                sub["data_concepts"] = sub_data
            sub_components.append(sub)


def _extract_integration_area(cid, cell, cells, children_of, ref):
    """Extract an integration area with its APIs and external partners."""
    ia = {"name": cell["label"]}
    apis = []
    partners = []

    for child_id in children_of.get(cid, []):
        child = cells.get(child_id)
        if not child or child["is_edge"] or not child["label"]:
            continue
        shape = get_shape_type(child["style"])
        if shape == "archimate.interface":
            apis.append(child["label"])
        elif shape == "archimate.component":
            partners.append(child["label"])
        elif shape == "group":
            # Recurse
            for gc_id in children_of.get(child_id, []):
                gc = cells.get(gc_id)
                if gc and gc["label"]:
                    gs = get_shape_type(gc["style"])
                    if gs == "archimate.interface":
                        apis.append(gc["label"])
                    elif gs == "archimate.component":
                        partners.append(gc["label"])

    if apis:
        ia["partner_apis"] = apis
    if partners:
        ia["external_partners"] = partners

    # Enrichment
    enrichment = enrich_element(cell["label"], ref)
    if enrichment and enrichment.get("external_partners"):
        ia["reference_partners"] = enrichment["external_partners"]

    return ia


def _extract_flows_for(cell_id, cells, edges):
    """Extract incoming and outgoing labeled flows for a cell."""
    incoming = []
    outgoing = []

    # Also check if cell is inside a group — need to match group-level edges too
    for edge in edges:
        label = edge.get("label", "")
        source = edge.get("source", "")
        target = edge.get("target", "")

        if source == cell_id and label:
            target_label = cells.get(target, {}).get("label", target)
            if target_label:
                outgoing.append({"to": target_label, "data": label})
        elif target == cell_id and label:
            source_label = cells.get(source, {}).get("label", source)
            if source_label:
                incoming.append({"from": source_label, "data": label})

    return {"incoming": incoming, "outgoing": outgoing}


def _extract_cross_domain_flows(cells, edges):
    """Extract all labeled data flows."""
    flows = []
    seen = set()
    for edge in edges:
        label = edge.get("label", "")
        if not label:
            continue
        source = edge.get("source", "")
        target = edge.get("target", "")
        source_label = cells.get(source, {}).get("label", "")
        target_label = cells.get(target, {}).get("label", "")
        if source_label and target_label:
            key = (source_label, target_label, label)
            if key not in seen:
                seen.add(key)
                flows.append({
                    "from": source_label,
                    "to": target_label,
                    "data": label,
                })
    return flows


# ---------------------------------------------------------------------------
# Data aggregate extractor
# ---------------------------------------------------------------------------

def extract_data_aggregate(diagram, ref):
    """Extract data concept aggregate model into structured dict."""
    cells = diagram["cells"]
    edges = diagram["edges"]
    children_of = build_containment_tree(cells)

    result = {
        "view_type": "data-aggregate",
        "tab": diagram["tab_name"],
        "logical_components": [],
    }

    # Find logical component containers (top-level archimate.function)
    for cid, cell in cells.items():
        if cell["is_edge"] or not cell["is_vertex"]:
            continue
        shape = get_shape_type(cell["style"])
        spec = cell.get("metadata", {}).get("specialization", "")

        if shape == "archimate.function" and (
            spec == "Logical Component" or cell["parent"] == "1"
        ):
            if not cell["label"]:
                continue

            lc = {"name": cell["label"]}
            enrichment = enrich_element(cell["label"], ref)
            if enrichment and enrichment.get("description"):
                lc["description"] = enrichment["description"]

            # Collect contents
            owned = []
            read_models = []
            aggregates = []
            services = []

            # In draw.io, the LC and its data objects are often siblings
            # under a group wrapper (not parent-child). Check the LC's parent
            # group and scan its children too.
            scan_ids = [cid]
            parent_cell = cells.get(cell["parent"])
            if parent_cell and get_shape_type(parent_cell.get("style", "")) == "group":
                scan_ids.append(cell["parent"])

            for scan_id in scan_ids:
                _collect_aggregate_children(
                    scan_id, cells, children_of, owned, read_models, aggregates,
                    exclude_id=cid
                )

            if owned:
                lc["owned_data_concepts"] = owned
            if read_models:
                lc["read_models"] = read_models
            if aggregates:
                lc["aggregate_boundaries"] = aggregates

            # Find services realized
            for edge in edges:
                if edge.get("source") == cid:
                    target = cells.get(edge.get("target", ""))
                    if target and get_shape_type(target["style"]) == "archimate.service":
                        services.append(target["label"])
                elif edge.get("target") == cid:
                    source = cells.get(edge.get("source", ""))
                    # Realization: component → service (dashed arrow)
                    pass

            # Also find services that point to this LC
            for edge in edges:
                source_cell = cells.get(edge.get("source", ""))
                target_cell = cells.get(edge.get("target", ""))
                if source_cell and source_cell["id"] == cid:
                    if target_cell and get_shape_type(target_cell["style"]) == "archimate.service":
                        if target_cell["label"] not in services:
                            services.append(target_cell["label"])
                if target_cell and get_shape_type(target_cell["style"]) == "archimate.service":
                    if source_cell and source_cell["id"] == cid:
                        if target_cell["label"] not in services:
                            services.append(target_cell["label"])

            if services:
                lc["realizes_services"] = services

            # Entity relationships within this component
            relationships = _extract_relationships_in_scope(
                cid, cells, edges, children_of
            )
            if relationships:
                lc["relationships"] = relationships

            result["logical_components"].append(lc)

    return result


def _collect_aggregate_children(parent_id, cells, children_of, owned, read_models, aggregates, exclude_id=None):
    """Recursively collect owned/RM data concepts and aggregate boundaries."""
    for child_id in children_of.get(parent_id, []):
        if child_id == exclude_id:
            continue
        child = cells.get(child_id)
        if not child or child["is_edge"]:
            continue

        shape = get_shape_type(child["style"])
        fill = get_fill_color(child["style"])
        label = child["label"]

        if shape == "group":
            _collect_aggregate_children(child_id, cells, children_of, owned, read_models, aggregates, exclude_id=exclude_id)
        elif shape == "archimate.data_object" and label:
            if fill == "#ffe6cc":
                # Aggregate boundary
                agg = {"name": label}
                agg_owned = []
                agg_rm = []
                _collect_aggregate_children(child_id, cells, children_of, agg_owned, agg_rm, [], exclude_id=exclude_id)
                if agg_owned:
                    agg["owned"] = agg_owned
                if agg_rm:
                    agg["read_models"] = agg_rm
                aggregates.append(agg)
            elif fill == "#fff2cc":
                read_models.append(label.replace(" (RM)", "").strip())
            else:
                entry = label
                # Check for [Entity] suffix
                if "[Entity]" in label:
                    entry = label.replace("[Entity]", "").strip()
                owned.append(entry)
        elif shape == "archimate.function" and label:
            # Could be a sub-container
            _collect_aggregate_children(child_id, cells, children_of, owned, read_models, aggregates, exclude_id=exclude_id)


def _extract_relationships_in_scope(scope_id, cells, edges, children_of):
    """Extract entity relationships within a logical component scope."""
    # Get all cell IDs in scope
    in_scope = set()
    _get_all_descendants(scope_id, children_of, in_scope)

    relationships = []
    for edge in edges:
        source = edge.get("source", "")
        target = edge.get("target", "")
        if source in in_scope or target in in_scope:
            source_label = cells.get(source, {}).get("label", "")
            target_label = cells.get(target, {}).get("label", "")
            if source_label and target_label:
                rel_type = get_edge_type(edge["style"])
                if rel_type != "association" or edge.get("label"):
                    relationships.append({
                        "from": source_label,
                        "to": target_label,
                        "type": rel_type,
                        **({"label": edge["label"]} if edge.get("label") else {}),
                    })
    return relationships


def _get_all_descendants(parent_id, children_of, result):
    """Recursively collect all descendant cell IDs."""
    result.add(parent_id)
    for child_id in children_of.get(parent_id, []):
        _get_all_descendants(child_id, children_of, result)


# ---------------------------------------------------------------------------
# Data architecture extractor
# ---------------------------------------------------------------------------

def extract_data_architecture(diagram, ref):
    """Extract entity-relationship data model."""
    cells = diagram["cells"]
    edges = diagram["edges"]

    result = {
        "view_type": "data-architecture",
        "tab": diagram["tab_name"],
        "entities": [],
        "relationships": [],
    }

    for cid, cell in cells.items():
        if cell["is_edge"] or not cell["is_vertex"]:
            continue
        shape = get_shape_type(cell["style"])
        label = cell["label"]
        if not label or shape in ("group", "text_annotation", "edge_label"):
            continue

        if shape == "archimate.data_object":
            entity = {"name": label}
            if cell["has_metadata"]:
                entity["registered"] = True
                spec = cell["metadata"].get("specialization", "")
                if spec:
                    entity["specialization"] = spec
            else:
                entity["registered"] = False

            enrichment = enrich_element(label, ref)
            if enrichment and enrichment.get("group"):
                entity["data_concept_group"] = enrichment["group"]

            result["entities"].append(entity)

    for edge in edges:
        source = edge.get("source", "")
        target = edge.get("target", "")
        source_label = cells.get(source, {}).get("label", "")
        target_label = cells.get(target, {}).get("label", "")
        if not source_label or not target_label:
            continue

        rel = {
            "from": source_label,
            "to": target_label,
            "type": get_edge_type(edge["style"]),
        }
        if edge.get("label"):
            rel["label"] = edge["label"]
        result["relationships"].append(rel)

    return result


# ---------------------------------------------------------------------------
# Security view extractor
# ---------------------------------------------------------------------------

def extract_security(diagram, ref):
    """Extract security architecture view."""
    cells = diagram["cells"]
    edges = diagram["edges"]
    children_of = build_containment_tree(cells)

    result = {
        "view_type": "security",
        "tab": diagram["tab_name"],
        "trust_boundaries": [],
        "security_controls": [],
        "data_classification_zones": [],
        "external_systems": [],
        "external_actors": [],
        "partner_apis": [],
        "internal_components": [],
        "adjacent_domains": [],
        "data_stores": [],
        "data_flows": [],
    }

    # Identify legend containers to skip
    legend_ids = set()
    for cid, cell in cells.items():
        label = (cell.get("label") or "").lower()
        if "legend" in label or "notation" in label:
            _get_all_descendants(cid, children_of, legend_ids)

    for cid, cell in cells.items():
        if cell["is_edge"] or not cell["is_vertex"]:
            continue
        if cid in legend_ids:
            continue
        style = cell["style"]
        label = cell["label"]
        if not label:
            continue
        shape = get_shape_type(style)
        fill = get_fill_color(style)

        # Skip groups, text annotations, edge labels
        if shape in ("group", "text_annotation", "edge_label"):
            continue

        # Trust boundaries (dashed rectangles with zone keywords)
        if "dashed=1" in style and any(kw in label.lower() for kw in
            ["zone", "boundary", "dmz", "untrusted", "trusted", "adjacent"]):
            stroke = re.search(r"strokeColor=(#[0-9a-fA-F]{6})", style)
            result["trust_boundaries"].append({
                "name": label,
                "color": stroke.group(1) if stroke else None,
            })
            continue

        # Data classification zones (dashed with PII/confidential/internal)
        if "dashed=1" in style and any(kw in label.lower() for kw in
            ["pii", "confidential"]):
            result["data_classification_zones"].append({"name": label})
            continue
        if "dashed=1" in style and "internal" in label.lower() and "zone" not in label.lower():
            result["data_classification_zones"].append({"name": label})
            continue

        # Security controls (WAF, gateway, mesh, IAM, secrets)
        is_control = shape == "network_device" or any(kw in label.lower() for kw in
            ["waf", "gateway", "mesh", "identity", "secrets", "driver identity"])
        if is_control:
            # Extract just the first line as name, rest as details
            lines = label.split("\n") if "\n" in label else [label]
            ctrl = {"name": lines[0].strip()}
            if len(lines) > 1:
                ctrl["details"] = [l.strip() for l in lines[1:] if l.strip()]
            result["security_controls"].append(ctrl)
            continue

        # Classify by fill color into zones
        if fill == "#f8cecc":  # Red — external/untrusted
            if shape == "person":
                result["external_actors"].append({"name": label})
            elif shape == "database":
                result["data_stores"].append({"name": label, "zone": "pii"})
            else:
                result["external_systems"].append({"name": label})
        elif fill == "#dae8fc":  # Blue — internal domain/adjacent
            if "AA" in label or "domain" in label.lower():
                result["adjacent_domains"].append({"name": label})
            else:
                result["internal_components"].append({"name": label})
        elif fill == "#d5e8d4":  # Green — trusted internal
            if shape == "database":
                result["data_stores"].append({"name": label, "zone": "internal"})
            else:
                result["internal_components"].append({"name": label})
        elif fill in ("#fff2cc", "#ffe6cc"):  # Yellow/orange — DMZ
            if "partner" in label.lower() or "api" in label.lower():
                result["partner_apis"].append({"name": label})
            elif shape == "database":
                result["data_stores"].append({"name": label, "zone": "business_confidential"})
            else:
                result["internal_components"].append({"name": label})
        else:
            # Unknown zone, still include
            if shape == "database":
                result["data_stores"].append({"name": label})
            elif shape == "person":
                result["external_actors"].append({"name": label})

    # Data flows — only include labeled edges (these carry architectural meaning)
    for edge in edges:
        source_id = edge.get("source", "")
        target_id = edge.get("target", "")
        if source_id in legend_ids or target_id in legend_ids:
            continue
        source = cells.get(source_id, {}).get("label", "")
        target = cells.get(target_id, {}).get("label", "")
        if source and target:
            flow = {"from": source, "to": target}
            label = edge.get("label", "")
            if label:
                flow["data"] = label
            result["data_flows"].append(flow)

    # Remove empty sections
    result = {k: v for k, v in result.items() if v or k in ("view_type", "tab")}

    return result


# ---------------------------------------------------------------------------
# Generic extractor (fallback)
# ---------------------------------------------------------------------------

def extract_generic(diagram, ref):
    """Generic extraction for unrecognized view types."""
    cells = diagram["cells"]
    edges = diagram["edges"]

    result = {
        "view_type": "generic",
        "tab": diagram["tab_name"],
        "elements": [],
        "connections": [],
    }

    for cid, cell in cells.items():
        if cell["is_edge"] or not cell["is_vertex"]:
            continue
        label = cell["label"]
        if not label:
            continue
        shape = get_shape_type(cell["style"])
        if shape in ("group", "text_annotation", "edge_label"):
            continue
        entry = {"name": label, "type": shape}
        if cell["has_metadata"]:
            entry["metadata"] = cell["metadata"]
        result["elements"].append(entry)

    for edge in edges:
        source = cells.get(edge.get("source", ""), {}).get("label", "")
        target = cells.get(edge.get("target", ""), {}).get("label", "")
        if source and target:
            conn = {"from": source, "to": target}
            if edge.get("label"):
                conn["label"] = edge["label"]
            result["connections"].append(conn)

    return result


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

EXTRACTORS = {
    "domain-context": extract_domain_context,
    "data-aggregate": extract_data_aggregate,
    "data-architecture": extract_data_architecture,
    "security": extract_security,
    "generic": extract_generic,
}


def main():
    parser = argparse.ArgumentParser(description="Extract structured YAML from draw.io files")
    parser.add_argument("drawio_file", help="Path to .drawio file")
    parser.add_argument("--type", choices=list(EXTRACTORS.keys()) + ["auto"],
                        default="auto", help="View type (default: auto-detect)")
    parser.add_argument("--output", help="Output YAML path (default: alongside .drawio)")
    parser.add_argument("--reference", default=str(DEFAULT_REFERENCE),
                        help="Path to domain reference YAML")
    args = parser.parse_args()

    drawio_path = Path(args.drawio_file)
    if not drawio_path.exists():
        print(f"Error: {drawio_path} not found", file=sys.stderr)
        sys.exit(1)

    # Load reference
    ref = load_domain_reference(args.reference)

    # Parse
    print(f"Parsing {drawio_path.name}...")
    diagrams = parse_drawio(drawio_path)
    print(f"  Found {len(diagrams)} tab(s): {', '.join(d['tab_name'] for d in diagrams)}")

    all_results = []

    for diagram in diagrams:
        # Detect or use specified type
        if args.type == "auto":
            view_type = detect_view_type(diagram)
            print(f"  Tab '{diagram['tab_name']}' → detected as: {view_type}")
        else:
            view_type = args.type

        extractor = EXTRACTORS.get(view_type, extract_generic)
        result = extractor(diagram, ref)

        # Add file metadata
        result["source_file"] = drawio_path.name
        result["source_lines"] = sum(1 for _ in open(drawio_path))

        all_results.append(result)

    # Output
    if len(all_results) == 1:
        output_data = all_results[0]
    else:
        output_data = {"tabs": all_results}

    # Determine output path
    if args.output:
        output_path = Path(args.output)
    else:
        output_path = drawio_path.with_suffix(".extracted.yaml")

    # Custom YAML representer for clean output
    class CleanDumper(yaml.SafeDumper):
        pass

    def str_representer(dumper, data):
        if "\n" in data:
            return dumper.represent_scalar("tag:yaml.org,2002:str", data, style="|")
        return dumper.represent_scalar("tag:yaml.org,2002:str", data)

    CleanDumper.add_representer(str, str_representer)

    yaml_output = yaml.dump(output_data, Dumper=CleanDumper,
                            default_flow_style=False, sort_keys=False,
                            allow_unicode=True, width=120)

    output_path.write_text(yaml_output)
    yaml_lines = yaml_output.count("\n")
    print(f"\nOutput: {output_path}")
    print(f"  {result['source_lines']} lines XML → {yaml_lines} lines YAML "
          f"({round(yaml_lines / max(result['source_lines'], 1) * 100)}% of original)")


if __name__ == "__main__":
    main()

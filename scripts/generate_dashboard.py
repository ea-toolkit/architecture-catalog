#!/usr/bin/env python3
"""
Generate HTML dashboard showing architecture model health.

Creates an interactive dashboard with:
- Registry statistics by layer and domain
- Domain maturity scores
- Orphan elements (registered but not in diagrams)
- Validation issues
- Model coverage metrics

Usage:
    python scripts/generate_dashboard.py                  # Generate dashboard.html
    python scripts/generate_dashboard.py -o docs/         # Custom output directory
"""

import argparse
import json
import subprocess
import sys
from collections import defaultdict
from datetime import datetime
from pathlib import Path

import frontmatter

REPO_ROOT = Path(__file__).resolve().parent.parent
REGISTRY_DIR = REPO_ROOT / "registry"
VIEWS_DIR = REPO_ROOT / "views"

# Known domains
KNOWN_DOMAINS = [
    "novacrm-platform",
]

# Layer display order
LAYER_ORDER = ["strategy", "motivation", "business", "application", "technology", "implementation"]


def load_registry():
    """Load all registry entries with metadata."""
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
                "owner": post.metadata.get("owner", ""),
                "domain": post.metadata.get("domain", ""),
                "status": post.metadata.get("status", ""),
                "specialization": post.metadata.get("specialization", ""),
                "make_or_buy": post.metadata.get("make_or_buy", ""),
                "layer": layer,
                "element_type": element_type,
                "file": str(md_file.relative_to(REPO_ROOT)),
            })
        except Exception:
            pass

    return elements


def run_validator():
    """Run the validator and get JSON output."""
    try:
        result = subprocess.run(
            ["python3", str(REPO_ROOT / "scripts" / "validate.py"), "--format", "json"],
            capture_output=True,
            text=True,
            cwd=REPO_ROOT,
        )
        return json.loads(result.stdout)
    except Exception as e:
        return {"status": "ERROR", "error": str(e)}


def calculate_domain_stats(elements):
    """Calculate statistics per domain."""
    stats = defaultdict(lambda: {
        "total": 0,
        "by_layer": defaultdict(int),
        "by_type": defaultdict(int),
        "make_count": 0,
        "buy_count": 0,
        "owners": set(),
    })

    for elem in elements:
        domain = elem["domain"] or "unassigned"
        stats[domain]["total"] += 1
        stats[domain]["by_layer"][elem["layer"]] += 1
        stats[domain]["by_type"][elem["element_type"]] += 1
        if elem["owner"]:
            stats[domain]["owners"].add(elem["owner"])
        if elem["make_or_buy"] == "make":
            stats[domain]["make_count"] += 1
        elif elem["make_or_buy"] == "buy":
            stats[domain]["buy_count"] += 1

    # Convert sets to counts
    for domain in stats:
        stats[domain]["owner_count"] = len(stats[domain]["owners"])
        del stats[domain]["owners"]

    return dict(stats)


def calculate_layer_stats(elements):
    """Calculate statistics per layer."""
    stats = defaultdict(lambda: {"total": 0, "by_type": defaultdict(int)})

    for elem in elements:
        layer = elem["layer"]
        stats[layer]["total"] += 1
        stats[layer]["by_type"][elem["element_type"]] += 1

    return dict(stats)


def get_domain_maturity(domain, elements, validator_data):
    """Calculate maturity score for a domain."""
    domain_elements = [e for e in elements if e["domain"] == domain]

    # Check for different element types
    has_components = any(e["element_type"] == "components" for e in domain_elements)
    has_functions = any(e["element_type"] == "functions" for e in domain_elements)
    has_data = any(e["element_type"] == "data-objects" for e in domain_elements)

    # Check for views
    domain_views = VIEWS_DIR / domain
    has_views = domain_views.exists() and any(domain_views.glob("**/*.drawio"))

    # Check for extracted YAMLs
    has_extracts = domain_views.exists() and any(domain_views.glob("**/*.extracted.yaml"))

    # Calculate score (0-5)
    score = sum([
        has_components,
        has_functions,
        has_data,
        has_views,
        has_extracts,
    ])

    return {
        "score": score,
        "max_score": 5,
        "has_components": has_components,
        "has_functions": has_functions,
        "has_data": has_data,
        "has_views": has_views,
        "has_extracts": has_extracts,
    }


def generate_html(elements, validator_data, output_path):
    """Generate the HTML dashboard."""
    domain_stats = calculate_domain_stats(elements)
    layer_stats = calculate_layer_stats(elements)

    # Calculate maturity for each domain
    maturity = {}
    for domain in KNOWN_DOMAINS:
        maturity[domain] = get_domain_maturity(domain, elements, validator_data)

    # Get orphans and errors from validator
    orphans = validator_data.get("orphan_elements", [])
    errors = validator_data.get("errors", [])

    # Total counts
    total_elements = len(elements)
    total_domains = len(set(e["domain"] for e in elements if e["domain"]))
    total_orphans = len(orphans)
    total_errors = len(errors)

    # Generate HTML
    html = f'''<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Architecture Model Dashboard</title>
    <style>
        * {{ box-sizing: border-box; margin: 0; padding: 0; }}
        body {{
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: #f5f5f5;
            color: #333;
            line-height: 1.6;
        }}
        .container {{ max-width: 1400px; margin: 0 auto; padding: 20px; }}
        header {{
            background: linear-gradient(135deg, #0058a3 0%, #004f93 100%);
            color: white;
            padding: 30px;
            margin-bottom: 30px;
            border-radius: 12px;
        }}
        header h1 {{ font-size: 2em; margin-bottom: 10px; }}
        header p {{ opacity: 0.9; }}

        .stats-grid {{
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }}
        .stat-card {{
            background: white;
            padding: 25px;
            border-radius: 12px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.08);
            text-align: center;
        }}
        .stat-card .number {{
            font-size: 3em;
            font-weight: 700;
            color: #0058a3;
        }}
        .stat-card .label {{
            color: #666;
            font-size: 0.9em;
            margin-top: 5px;
        }}
        .stat-card.warning .number {{ color: #f0a000; }}
        .stat-card.error .number {{ color: #d32f2f; }}
        .stat-card.success .number {{ color: #388e3c; }}

        .section {{
            background: white;
            padding: 25px;
            border-radius: 12px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.08);
            margin-bottom: 25px;
        }}
        .section h2 {{
            font-size: 1.3em;
            margin-bottom: 20px;
            color: #0058a3;
            border-bottom: 2px solid #e0e0e0;
            padding-bottom: 10px;
        }}

        table {{
            width: 100%;
            border-collapse: collapse;
        }}
        th, td {{
            padding: 12px 15px;
            text-align: left;
            border-bottom: 1px solid #eee;
        }}
        th {{
            background: #f8f9fa;
            font-weight: 600;
            color: #555;
        }}
        tr:hover {{ background: #f8f9fa; }}

        .progress-bar {{
            height: 8px;
            background: #e0e0e0;
            border-radius: 4px;
            overflow: hidden;
        }}
        .progress-bar .fill {{
            height: 100%;
            background: linear-gradient(90deg, #4caf50, #8bc34a);
            border-radius: 4px;
            transition: width 0.3s;
        }}
        .progress-bar.low .fill {{ background: linear-gradient(90deg, #f44336, #ff5722); }}
        .progress-bar.medium .fill {{ background: linear-gradient(90deg, #ff9800, #ffc107); }}

        .badge {{
            display: inline-block;
            padding: 4px 10px;
            border-radius: 20px;
            font-size: 0.8em;
            font-weight: 500;
        }}
        .badge-make {{ background: #e3f2fd; color: #1976d2; }}
        .badge-buy {{ background: #fff3e0; color: #f57c00; }}
        .badge-mixed {{ background: #f3e5f5; color: #7b1fa2; }}

        .layer-bar {{
            display: flex;
            height: 30px;
            border-radius: 6px;
            overflow: hidden;
            margin: 10px 0;
        }}
        .layer-bar div {{
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 0.75em;
            font-weight: 500;
        }}
        .layer-strategy {{ background: #9c27b0; }}
        .layer-motivation {{ background: #673ab7; }}
        .layer-business {{ background: #ffeb3b; color: #333 !important; }}
        .layer-application {{ background: #2196f3; }}
        .layer-technology {{ background: #4caf50; }}
        .layer-implementation {{ background: #ff9800; }}

        .timestamp {{
            text-align: center;
            color: #999;
            font-size: 0.85em;
            margin-top: 30px;
        }}

        .issues-list {{
            max-height: 300px;
            overflow-y: auto;
        }}
        .issue-item {{
            padding: 10px;
            border-left: 3px solid #f44336;
            background: #fff5f5;
            margin-bottom: 8px;
            border-radius: 0 6px 6px 0;
        }}
        .issue-item.warning {{
            border-left-color: #ff9800;
            background: #fff8e1;
        }}
    </style>
</head>
<body>
    <div class="container">
        <header>
            <h1>Architecture Model Dashboard</h1>
            <p>Enterprise architecture registry health and compliance overview</p>
        </header>

        <div class="stats-grid">
            <div class="stat-card">
                <div class="number">{total_elements}</div>
                <div class="label">Total Elements</div>
            </div>
            <div class="stat-card">
                <div class="number">{total_domains}</div>
                <div class="label">Active Domains</div>
            </div>
            <div class="stat-card {'warning' if total_orphans > 0 else 'success'}">
                <div class="number">{total_orphans}</div>
                <div class="label">Orphan Elements</div>
            </div>
            <div class="stat-card {'error' if total_errors > 0 else 'success'}">
                <div class="number">{total_errors}</div>
                <div class="label">Validation Errors</div>
            </div>
        </div>

        <div class="section">
            <h2>Domain Maturity</h2>
            <table>
                <thead>
                    <tr>
                        <th>Domain</th>
                        <th>Elements</th>
                        <th>Components</th>
                        <th>Data Objects</th>
                        <th>Views</th>
                        <th>Maturity</th>
                    </tr>
                </thead>
                <tbody>'''

    for domain in KNOWN_DOMAINS:
        stats = domain_stats.get(domain, {"total": 0, "by_type": {}})
        mat = maturity.get(domain, {"score": 0, "max_score": 5})
        pct = (mat["score"] / mat["max_score"]) * 100
        bar_class = "low" if pct < 40 else ("medium" if pct < 70 else "")

        html += f'''
                    <tr>
                        <td><strong>{domain}</strong></td>
                        <td>{stats["total"]}</td>
                        <td>{"✓" if mat.get("has_components") else "—"}</td>
                        <td>{"✓" if mat.get("has_data") else "—"}</td>
                        <td>{"✓" if mat.get("has_views") else "—"}</td>
                        <td style="width: 150px;">
                            <div class="progress-bar {bar_class}">
                                <div class="fill" style="width: {pct}%"></div>
                            </div>
                            <small>{mat["score"]}/{mat["max_score"]}</small>
                        </td>
                    </tr>'''

    html += '''
                </tbody>
            </table>
        </div>

        <div class="section">
            <h2>Registry by Layer</h2>
            <div class="layer-bar">'''

    total = sum(layer_stats.get(l, {}).get("total", 0) for l in LAYER_ORDER)
    for layer in LAYER_ORDER:
        count = layer_stats.get(layer, {}).get("total", 0)
        if count > 0:
            pct = (count / total) * 100 if total > 0 else 0
            html += f'<div class="layer-{layer}" style="width: {pct}%">{layer.title()} ({count})</div>'

    html += '''
            </div>
            <table>
                <thead>
                    <tr>
                        <th>Layer</th>
                        <th>Count</th>
                        <th>Element Types</th>
                    </tr>
                </thead>
                <tbody>'''

    for layer in LAYER_ORDER:
        stats = layer_stats.get(layer, {"total": 0, "by_type": {}})
        if stats["total"] > 0:
            types = ", ".join(f"{t} ({c})" for t, c in sorted(stats["by_type"].items()))
            html += f'''
                    <tr>
                        <td><strong>{layer.title()}</strong></td>
                        <td>{stats["total"]}</td>
                        <td>{types}</td>
                    </tr>'''

    html += '''
                </tbody>
            </table>
        </div>'''

    # Orphans section
    if orphans:
        html += '''
        <div class="section">
            <h2>Orphan Elements</h2>
            <p style="margin-bottom: 15px; color: #666;">Elements registered but not used in any diagram:</p>
            <div class="issues-list">'''
        for orphan in orphans[:20]:  # Limit to 20
            html += f'''
                <div class="issue-item warning">
                    <strong>{orphan.get("name", "Unknown")}</strong>
                    <br><small>{orphan.get("location", "")}</small>
                </div>'''
        if len(orphans) > 20:
            html += f'<p style="color: #666; padding: 10px;">... and {len(orphans) - 20} more</p>'
        html += '''
            </div>
        </div>'''

    # Validation errors section
    if errors:
        html += '''
        <div class="section">
            <h2>Validation Errors</h2>
            <p style="margin-bottom: 15px; color: #666;">Elements in diagrams but not in registry:</p>
            <div class="issues-list">'''
        for err in errors[:20]:
            html += f'''
                <div class="issue-item">
                    <strong>{err.get("element", "Unknown")}</strong>
                    <br><small>{err.get("file", "")} — layer: {err.get("layer", "")}</small>
                </div>'''
        if len(errors) > 20:
            html += f'<p style="color: #666; padding: 10px;">... and {len(errors) - 20} more</p>'
        html += '''
            </div>
        </div>'''

    html += f'''
        <p class="timestamp">Generated: {datetime.now().strftime("%Y-%m-%d %H:%M:%S")}</p>
    </div>
</body>
</html>'''

    output_path.write_text(html)
    return output_path


def main():
    parser = argparse.ArgumentParser(description="Generate architecture model dashboard")
    parser.add_argument("-o", "--output", default=".", help="Output directory")
    args = parser.parse_args()

    print("=" * 60)
    print("Architecture Dashboard Generator")
    print("=" * 60)

    # Load data
    print("\nLoading registry...")
    elements = load_registry()
    print(f"  Found {len(elements)} elements")

    print("\nRunning validator...")
    validator_data = run_validator()
    print(f"  Status: {validator_data.get('status', 'UNKNOWN')}")

    # Generate dashboard
    output_dir = Path(args.output)
    output_dir.mkdir(parents=True, exist_ok=True)
    output_file = output_dir / "dashboard.html"

    print(f"\nGenerating dashboard...")
    generate_html(elements, validator_data, output_file)
    print(f"  Output: {output_file}")

    print("\n" + "=" * 60)
    print(f"Dashboard generated: {output_file}")
    print("Open in browser to view.")

    return 0


if __name__ == "__main__":
    sys.exit(main())

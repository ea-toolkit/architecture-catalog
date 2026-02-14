---
name: dashboard
description: Generate HTML dashboard showing architecture model health, domain maturity, layer statistics, and orphan elements.
allowed-tools: Bash, Read
model: haiku
---

# Generate Architecture Dashboard

Generate the HTML dashboard and summarize key metrics.

## Workflow

1. Run: `python scripts/generate_dashboard.py`
2. Confirm dashboard was generated at `dashboard.html`
3. Summarize key metrics from the dashboard

## Response Format

```
**Dashboard Generated:** dashboard.html

**Summary:**
| Domain | Maturity | Elements |
|--------|----------|----------|
| customer-management | X/5 | X |
| ... | ... | ... |

**Layer Distribution:**
| Layer | Count |
|-------|-------|
| Application | X |
| Technology | X |
| Business | X |
| ... | ... |

**Health Indicators:**
- Validation errors: X
- Orphan elements: X

Open dashboard.html in a browser to view the full interactive report.
```

## Notes

- The dashboard provides a visual overview of model health
- Maturity is based on required views per domain (application-landscape, technology-landscape, data-model)
- Suggest opening in browser for full experience
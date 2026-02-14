---
title: Domains
description: How domains are auto-discovered and organized.
---

Domains are the top-level groupings in your architecture catalog. They're automatically discovered from the `domain` field in your Markdown files.

## Auto-discovery

Set `domain: My New Domain` in any element's frontmatter, and a new domain automatically appears in:

- The sidebar navigation
- The dashboard with a domain card
- Domain overview pages
- Context map graphs

```yaml
---
name: Order Service
domain: Order Management    # <- this creates/joins a domain
status: active
---
```

No configuration needed. Domains emerge from your data.

## Domain cards

Each domain gets a card on the dashboard showing:

- **Element count** by type
- **Maturity badge** based on health scoring
- **Quick link** to the domain overview and context map

## Health scoring

Domains receive a maturity assessment based on their elements' health:

| Maturity | Criteria |
|----------|----------|
| Excellent | >80% of elements are healthy and connected |
| Good | >60% |
| Developing | >30% |
| Initial | <30% |

"Healthy" means the element has all required fields filled in. "Connected" means it has at least one resolved relationship.

## Domain colors

Colors are auto-assigned from the `domain_color_palette` in `registry-mapping.yaml`:

```yaml
domain_color_palette:
  - "#3b82f6"   # first domain
  - "#8b5cf6"   # second domain
  - "#ec4899"   # third domain
  - "#f59e0b"   # cycles back if more domains than colors
```

Domains are sorted by element count (largest first), and colors are assigned in that order.

## Domain slug

The domain ID is derived from the `domain:` field value by lowercasing and replacing spaces with hyphens:

```
"Customer Management" -> "customer-management"
```

This slug is used in URLs: `/domains/customer-management/`

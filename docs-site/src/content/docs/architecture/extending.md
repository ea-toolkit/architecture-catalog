---
title: Extending the UI
description: Add custom pages and React components.
---

## Adding a new page

Create a `.astro` file in `catalog-ui/src/pages/`:

```astro
---
import Layout from '../layouts/Layout.astro';
import { elements, LAYER_META } from '../data/registry';

const apiElements = elements.filter(e => e.type === 'physical_business_api');
---

<Layout title="API Inventory">
  <h1>All APIs ({apiElements.length})</h1>
  <!-- your content -->
</Layout>
```

Astro uses file-based routing. A file at `src/pages/apis.astro` becomes the `/apis` route.

## Adding a React component

Create a `.tsx` file in `catalog-ui/src/components/`:

```tsx
import React from 'react';

interface Props {
  data: { label: string; count: number }[];
}

export default function MyChart({ data }: Props) {
  return (
    <div>
      {data.map(d => (
        <div key={d.label}>{d.label}: {d.count}</div>
      ))}
    </div>
  );
}
```

Use it in an Astro page with a client directive:

```astro
---
import MyChart from '../components/MyChart';
---

<MyChart client:load data={chartData} />
```

- `client:load` -- hydrates immediately on page load
- `client:visible` -- hydrates when the component scrolls into view
- `client:only="react"` -- renders only on the client (no SSR)

## Modifying the graph layout

The context graph uses dagre for automatic layout. Key parameters in `applyDagreLayout`:

```typescript
g.setGraph({
  rankdir: 'LR',     // Left-to-right layout
  nodesep: 60,        // Vertical spacing between nodes
  ranksep: 200,       // Horizontal spacing between ranks
});
```

The `graph_rank` from the mapping determines which dagre rank (column) each element type is placed in.

## Astro pages reference

| Page | Route | Data source |
|------|-------|-------------|
| `index.astro` | `/` | `domains`, `elements`, `LAYER_META`, `SITE_CONFIG` |
| `discover.astro` | `/discover` | `elements`, `TYPE_BADGES` |
| `catalog/[id].astro` | `/catalog/<id>` | `getElementById()`, `REL_TYPE_LABELS` |
| `domains/[id]/index.astro` | `/domains/<id>` | `getDomainById()`, `getElementsByDomain()` |
| `domains/[id]/context-map.astro` | `/domains/<id>/context-map` | Domain edges |

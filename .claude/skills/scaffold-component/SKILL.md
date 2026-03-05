---
name: scaffold-component
description: Scaffold a new React component with test file for the catalog UI.
argument-hint: [ComponentName]
allowed-tools: Read, Write, Glob, Bash
model: sonnet
agent: fe-developer
context: fork
---

# Scaffold Component

Scaffold a new React component in `catalog-ui/src/components/` with a co-located test file.

## Arguments

`$ARGUMENTS` should be a PascalCase component name (e.g., `CapabilityHeatmap`, `DomainSummaryCard`).

If no argument is provided, ask the user for a component name.

## Workflow

1. **Parse component name** from `$ARGUMENTS`. Ensure PascalCase.

2. **Determine target directory** based on component purpose:
   - Graph/visualization component → `catalog-ui/src/components/graphs/`
   - Diagram viewer → `catalog-ui/src/components/`
   - Layout/navigation → `catalog-ui/src/components/` (or subdirectory if pattern exists)
   - General → `catalog-ui/src/components/`
   - Ask the user if unclear.

3. **Read existing context:**
   - Read `models/registry-mapping.yaml` if the component will render registry data.
   - Read an existing similar component in the target directory for pattern reference.
   - Read `catalog-ui/src/lib/types.ts` for TypeScript interfaces.

4. **Create component file** (`ComponentName.tsx`):
   - Export Props interface: `export interface ComponentNameProps { ... }`
   - Named export (not default): `export const ComponentName: React.FC<ComponentNameProps> = ...`
   - CSS via `--ec-*` variables (never inline styles)
   - Semantic HTML (nav, main, section, article — not div for everything)
   - Accessible: aria labels on interactive elements
   - If rendering registry data: drive all behavior from schema properties (graph_rank, layer, icon), never from type name strings

5. **Create test file** (`ComponentName.test.tsx` in same directory or `__tests__/`):
   - At minimum: one render/smoke test + one behavioral test
   - Use Vitest (`import { describe, it, expect } from 'vitest'`)
   - Mock external dependencies (ReactFlow, data loaders) if needed

6. **Verify types:** `cd catalog-ui && npx tsc --noEmit`

## Template Pattern

```tsx
// ComponentName.tsx
import type React from 'react';

export interface ComponentNameProps {
  // Define props here
}

export const ComponentName: React.FC<ComponentNameProps> = (props) => {
  return (
    <section aria-label="Component description">
      {/* Component content */}
    </section>
  );
};
```

```tsx
// ComponentName.test.tsx
import { describe, it, expect } from 'vitest';

describe('ComponentName', () => {
  it('should render without crashing', () => {
    // Render test
  });

  it('should handle user interaction', () => {
    // Behavioral test
  });
});
```

## Rules

- Follow the vocab-agnostic principle for core registry rendering (no type-name conditionals).
- Map views (event, heatmap) are intentionally type-aware — that's fine.
- No hardcoded display data — all data from props, config files, or data imports.
- No `!important` in CSS unless overriding third-party styles.

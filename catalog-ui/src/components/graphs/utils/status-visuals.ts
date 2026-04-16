// catalog-ui/src/components/graphs/utils/status-visuals.ts
// Maps registry frontmatter `status` and `sourcing` values to visual treatment.
// Values come from the registry schema (see registry-v2/**/_template.md),
// not from element type names — so this does not violate the vocab-agnostic rule.

export interface StatusVisuals {
  borderStyle: 'solid' | 'dashed' | 'dotted';
  opacity: number;
  showExternalIndicator: boolean;
  muted: boolean;
}

// Planned work — visualised with a dashed border
const PLANNED_STATUSES = new Set(['draft', 'planned', 'proposed']);

// Retired work — visualised as faded
const DEPRECATED_STATUSES = new Set(['deprecated', 'retired', 'archived']);

// Non-owned sourcing — visualised with a cloud indicator
const EXTERNAL_SOURCINGS = new Set(['vendor', 'saas', 'hybrid', 'buy', 'external']);

export function getStatusVisuals(status?: string, sourcing?: string): StatusVisuals {
  const s = (status || '').toLowerCase().trim();
  const src = (sourcing || '').toLowerCase().trim();

  const isPlanned = PLANNED_STATUSES.has(s);
  const isDeprecated = DEPRECATED_STATUSES.has(s);
  const isExternal = EXTERNAL_SOURCINGS.has(src);

  return {
    borderStyle: isPlanned ? 'dashed' : 'solid',
    opacity: isDeprecated ? 0.55 : 1,
    showExternalIndicator: isExternal,
    muted: isDeprecated,
  };
}

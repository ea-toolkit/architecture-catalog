// catalog-ui/src/lib/heatmap-mapping-loader.ts
// ═══════════════════════════════════════════════════════════════
// Heatmap Mapping Loader
// ═══════════════════════════════════════════════════════════════
//
// Reads the optional models/heatmap-mapping.yaml and resolves
// capability heatmap configuration for domain-scoped views.
//
// The heatmap-mapping.yaml bridges vocabulary-agnostic registry
// types to semantic capability-assessment roles using element
// type KEYS and field KEYS from registry-mapping.yaml.
// ═══════════════════════════════════════════════════════════════

import { readFileSync, existsSync } from 'node:fs';
import { join, resolve } from 'node:path';
import yaml from 'js-yaml';

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────

export interface SizeSpec {
  cols: number;
  rows: number;
}

export interface HeatmapMappingConfig {
  capability_type: string;                    // element type key for "capability" role
  maturity_field: string;                     // field key for maturity dimension
  lifecycle_field: string;                    // field key for lifecycle dimension
  sourcing_field: string;                     // field key for sourcing dimension
  size_field: string;                         // field key for treemap tile size
  maturity_scale: Record<string, string>;     // maturity value → color
  size_scale: Record<string, SizeSpec>;       // size value → grid span (cols, rows)
  realization_field?: string;                 // optional relationship field key to display
  capability_label?: string;                  // optional display override
  maturity_label?: string;                    // optional display override
  lifecycle_label?: string;                   // optional display override
  sourcing_label?: string;                    // optional display override
}

// ─────────────────────────────────────────────────────────────
// Loader
// ─────────────────────────────────────────────────────────────

const WORKSPACE_ROOT = resolve(import.meta.dirname ?? __dirname, '..', '..', '..');

/**
 * Load the heatmap-mapping.yaml config.
 * Returns null if the file doesn't exist (feature is optional).
 */
export function loadHeatmapMapping(): HeatmapMappingConfig | null {
  const configPath = join(WORKSPACE_ROOT, 'models', 'heatmap-mapping.yaml');
  if (!existsSync(configPath)) return null;

  try {
    const raw = readFileSync(configPath, 'utf-8');
    const parsed = yaml.load(raw) as Record<string, unknown>;

    if (!parsed || typeof parsed !== 'object') return null;

    // Parse maturity_scale: { Excellent: '#10b981', ... }
    const maturityScaleRaw = parsed.maturity_scale;
    const maturityScale: Record<string, string> = {};
    if (maturityScaleRaw && typeof maturityScaleRaw === 'object') {
      for (const [key, val] of Object.entries(maturityScaleRaw as Record<string, unknown>)) {
        maturityScale[key] = String(val);
      }
    }

    // Parse size_scale: { s: { cols: 1, rows: 1 }, ... }
    const sizeScaleRaw = parsed.size_scale;
    const sizeScale: Record<string, SizeSpec> = {};
    if (sizeScaleRaw && typeof sizeScaleRaw === 'object') {
      for (const [key, val] of Object.entries(sizeScaleRaw as Record<string, unknown>)) {
        if (val && typeof val === 'object') {
          const spec = val as Record<string, unknown>;
          sizeScale[key] = {
            cols: Number(spec.cols ?? 1),
            rows: Number(spec.rows ?? 1),
          };
        }
      }
    }

    const config: HeatmapMappingConfig = {
      capability_type: String(parsed.capability_type ?? ''),
      maturity_field: String(parsed.maturity_field ?? ''),
      lifecycle_field: String(parsed.lifecycle_field ?? ''),
      sourcing_field: String(parsed.sourcing_field ?? ''),
      size_field: String(parsed.size_field ?? ''),
      maturity_scale: maturityScale,
      size_scale: sizeScale,
      realization_field: parsed.realization_field as string | undefined,
      capability_label: parsed.capability_label as string | undefined,
      maturity_label: parsed.maturity_label as string | undefined,
      lifecycle_label: parsed.lifecycle_label as string | undefined,
      sourcing_label: parsed.sourcing_label as string | undefined,
    };

    // Validate required fields
    if (!config.capability_type || !config.maturity_field || !config.lifecycle_field || !config.sourcing_field || !config.size_field) {
      console.warn('⚠️  heatmap-mapping.yaml is missing required fields (capability_type, maturity_field, lifecycle_field, sourcing_field, size_field)');
      return null;
    }

    if (Object.keys(config.maturity_scale).length === 0) {
      console.warn('⚠️  heatmap-mapping.yaml maturity_scale is empty');
      return null;
    }

    if (Object.keys(config.size_scale).length === 0) {
      console.warn('⚠️  heatmap-mapping.yaml size_scale is empty');
      return null;
    }

    return config;
  } catch (err) {
    console.warn(`⚠️  Failed to parse heatmap-mapping.yaml: ${err instanceof Error ? err.message : err}`);
    return null;
  }
}

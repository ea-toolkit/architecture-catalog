/**
 * Tests for catalog-ui/src/config/meta-model.config.ts
 */

import { describe, it, expect } from 'vitest';
import {
  getElementRank,
  getRelationshipSemantics,
  shouldIncludeEdgeInLayout,
  normalizeEdgeForLayout,
  ELEMENT_HIERARCHY,
} from '../meta-model.config';

describe('getElementRank', () => {
  it('returns 0 for domain (anchor element)', () => {
    expect(getElementRank('domain')).toBe(0);
  });

  it('normalizes hyphens to underscores', () => {
    // "software-system" should match "software_system"
    const rank = getElementRank('software-system');
    expect(rank).toBe(ELEMENT_HIERARCHY['software_system']);
  });

  it('normalizes spaces to underscores', () => {
    const rank = getElementRank('software system');
    expect(rank).toBe(ELEMENT_HIERARCHY['software_system']);
  });

  it('lowercases type before lookup', () => {
    const rank = getElementRank('DOMAIN');
    expect(rank).toBe(0);
  });

  it('returns fallbackRank for unknown type', () => {
    expect(getElementRank('unknown_custom_type', 5)).toBe(5);
  });

  it('returns default 1 when no fallback provided for unknown type', () => {
    expect(getElementRank('unknown_custom_type')).toBe(1);
  });
});

describe('getRelationshipSemantics', () => {
  it('returns semantics for known relationship "composition"', () => {
    const result = getRelationshipSemantics('composition');
    expect(result.direction).toBe('forward');
    expect(result.layoutRelevant).toBe(true);
    expect(result.label).toBe('contains');
  });

  it('returns default forward semantics for unknown relationship', () => {
    const result = getRelationshipSemantics('totally-unknown');
    expect(result.direction).toBe('forward');
    expect(result.layoutRelevant).toBe(false);
    expect(result.arrowStyle).toBe('open');
  });

  it('prettifies unknown relationship type as label', () => {
    const result = getRelationshipSemantics('my-custom-rel');
    expect(result.label).toBe('my custom rel');
  });
});

describe('shouldIncludeEdgeInLayout', () => {
  it('returns true for layout-relevant forward edge respecting hierarchy', () => {
    // composition is layout-relevant and forward
    // domain (rank 0) → component (rank 2) = forward, source <= target
    const result = shouldIncludeEdgeInLayout('domain', 'component', 'composition');
    expect(result).toBe(true);
  });

  it('returns false for non-layout-relevant relationship', () => {
    // "serves" is not layout-relevant
    const result = shouldIncludeEdgeInLayout('domain', 'component', 'serves');
    expect(result).toBe(false);
  });

  it('returns false for forward edge that violates hierarchy', () => {
    // component (rank 2) → domain (rank 0) with forward relationship
    const result = shouldIncludeEdgeInLayout('component', 'domain', 'composition');
    expect(result).toBe(false);
  });
});

describe('normalizeEdgeForLayout', () => {
  it('preserves forward edge direction when ranks are correct', () => {
    // domain (rank 0) → component (rank 2), forward relationship
    const result = normalizeEdgeForLayout('domain-1', 'domain', 'comp-1', 'component', 'composition');
    expect(result.source).toBe('domain-1');
    expect(result.target).toBe('comp-1');
    expect(result.flipped).toBe(false);
  });

  it('flips backward relationship for layout', () => {
    // "realization" is backward — implementation points to abstraction, but layout flips
    const result = normalizeEdgeForLayout('comp-1', 'component', 'svc-1', 'business_service', 'realization');
    // Backward rel always flips: source becomes target, target becomes source
    expect(result.flipped).toBe(true);
    expect(result.source).toBe('svc-1');
    expect(result.target).toBe('comp-1');
  });

  it('flips forward edge when source rank > target rank', () => {
    // component (rank 2) → domain (rank 0), composition (forward)
    const result = normalizeEdgeForLayout('comp-1', 'component', 'domain-1', 'domain', 'composition');
    expect(result.flipped).toBe(true);
    expect(result.source).toBe('domain-1');
    expect(result.target).toBe('comp-1');
  });
});

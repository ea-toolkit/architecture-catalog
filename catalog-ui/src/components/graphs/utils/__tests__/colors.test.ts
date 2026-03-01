/**
 * Tests for catalog-ui/src/components/graphs/utils/colors.ts
 */

import { describe, it, expect } from 'vitest';
import { getNodeStyle, getEdgeStyle, NODE_STYLES, EDGE_STYLES } from '../colors';

describe('getNodeStyle', () => {
  it('returns known style for "component"', () => {
    const style = getNodeStyle('component');
    expect(style).toEqual(NODE_STYLES['component']);
    expect(style.icon).toBe('C');
  });

  it('normalizes hyphens to underscores ("software-system" → "software_system")', () => {
    const style = getNodeStyle('software-system');
    expect(style).toEqual(NODE_STYLES['software_system']);
    expect(style.icon).toBe('SS');
  });

  it('returns generic fallback for unknown type (no fallback arg)', () => {
    const style = getNodeStyle('totally_unknown');
    expect(style.icon).toBe('?');
    expect(style.bg).toBe('#f8fafc');
  });

  it('uses provided fallback for unknown type', () => {
    const style = getNodeStyle('custom_type', { bg: '#ff0000', border: '#000' });
    expect(style.bg).toBe('#ff0000');
    expect(style.border).toBe('#000');
    expect(style.icon).toBe('?');
  });

  it('returns borderStyle, borderRadius, and text for known types', () => {
    const style = getNodeStyle('domain');
    expect(style.borderStyle).toBe('solid');
    expect(style.borderRadius).toBe('12px');
    expect(style.text).toBeTruthy();
  });

  it('returns consistent structure for all known types', () => {
    for (const [key, expected] of Object.entries(NODE_STYLES)) {
      const result = getNodeStyle(key);
      expect(result).toEqual(expected);
    }
  });
});

describe('getEdgeStyle', () => {
  it('returns known style for "composition"', () => {
    const style = getEdgeStyle('composition');
    expect(style).toEqual(EDGE_STYLES['composition']);
    expect(style.label).toBe('composes');
  });

  it('returns default style for unknown relationship', () => {
    const style = getEdgeStyle('nonexistent-relationship');
    expect(style).toEqual(EDGE_STYLES['default']);
    expect(style.label).toBe('');
  });

  it('returns style with strokeDasharray for realization', () => {
    const style = getEdgeStyle('realization');
    expect(style.strokeDasharray).toBe('6 3');
  });
});

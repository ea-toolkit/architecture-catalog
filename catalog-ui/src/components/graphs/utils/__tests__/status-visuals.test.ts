import { describe, it, expect } from 'vitest';
import { getStatusVisuals } from '../status-visuals';

describe('getStatusVisuals', () => {
  describe('borderStyle', () => {
    it('solid for active status', () => {
      expect(getStatusVisuals('active').borderStyle).toBe('solid');
    });

    it('dashed for draft status', () => {
      expect(getStatusVisuals('draft').borderStyle).toBe('dashed');
    });

    it('dashed for planned status (alt vocab)', () => {
      expect(getStatusVisuals('planned').borderStyle).toBe('dashed');
    });

    it('dashed for proposed status (alt vocab)', () => {
      expect(getStatusVisuals('proposed').borderStyle).toBe('dashed');
    });

    it('solid for unknown or missing status', () => {
      expect(getStatusVisuals().borderStyle).toBe('solid');
      expect(getStatusVisuals('').borderStyle).toBe('solid');
      expect(getStatusVisuals('something-custom').borderStyle).toBe('solid');
    });

    it('is case-insensitive', () => {
      expect(getStatusVisuals('DRAFT').borderStyle).toBe('dashed');
      expect(getStatusVisuals(' Draft ').borderStyle).toBe('dashed');
    });
  });

  describe('opacity', () => {
    it('1 for active', () => {
      expect(getStatusVisuals('active').opacity).toBe(1);
    });

    it('0.55 for deprecated', () => {
      expect(getStatusVisuals('deprecated').opacity).toBe(0.55);
    });

    it('0.55 for retired (alt vocab)', () => {
      expect(getStatusVisuals('retired').opacity).toBe(0.55);
    });

    it('1 for draft (not faded — planned is its own treatment)', () => {
      expect(getStatusVisuals('draft').opacity).toBe(1);
    });
  });

  describe('muted', () => {
    it('true only for deprecated-class statuses', () => {
      expect(getStatusVisuals('deprecated').muted).toBe(true);
      expect(getStatusVisuals('retired').muted).toBe(true);
      expect(getStatusVisuals('archived').muted).toBe(true);
      expect(getStatusVisuals('draft').muted).toBe(false);
      expect(getStatusVisuals('active').muted).toBe(false);
    });
  });

  describe('showExternalIndicator', () => {
    it('false for in-house sourcing', () => {
      expect(getStatusVisuals('active', 'in-house').showExternalIndicator).toBe(false);
    });

    it('true for vendor sourcing', () => {
      expect(getStatusVisuals('active', 'vendor').showExternalIndicator).toBe(true);
    });

    it('true for hybrid sourcing', () => {
      expect(getStatusVisuals('active', 'hybrid').showExternalIndicator).toBe(true);
    });

    it('true for saas / buy / external (alt vocab)', () => {
      expect(getStatusVisuals('active', 'saas').showExternalIndicator).toBe(true);
      expect(getStatusVisuals('active', 'buy').showExternalIndicator).toBe(true);
      expect(getStatusVisuals('active', 'external').showExternalIndicator).toBe(true);
    });

    it('false when sourcing is missing', () => {
      expect(getStatusVisuals('active').showExternalIndicator).toBe(false);
      expect(getStatusVisuals('active', '').showExternalIndicator).toBe(false);
    });
  });

  describe('combined scenarios', () => {
    it('deprecated external: faded + solid border + cloud', () => {
      const v = getStatusVisuals('deprecated', 'vendor');
      expect(v.borderStyle).toBe('solid');
      expect(v.opacity).toBe(0.55);
      expect(v.showExternalIndicator).toBe(true);
      expect(v.muted).toBe(true);
    });

    it('planned external: dashed + full opacity + cloud', () => {
      const v = getStatusVisuals('draft', 'vendor');
      expect(v.borderStyle).toBe('dashed');
      expect(v.opacity).toBe(1);
      expect(v.showExternalIndicator).toBe(true);
      expect(v.muted).toBe(false);
    });
  });
});

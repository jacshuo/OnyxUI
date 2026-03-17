import { describe, it, expect } from 'vitest';
import {
  buttonVariants,
  badgeVariants,
  inputVariants,
  labelVariants,
  cardVariants,
  alertVariants,
  dialogContentVariants,
  tooltipVariants,
  accordionVariants,
} from '../styles/theme';

describe('CVA theme variants', () => {
  describe('buttonVariants', () => {
    it('returns default classes', () => {
      const cls = buttonVariants();
      expect(cls).toContain('bg-primary-500');
      expect(cls).toContain('h-9');
    });

    it('applies intent', () => {
      expect(buttonVariants({ intent: 'danger' })).toContain('bg-danger-500');
      expect(buttonVariants({ intent: 'ghost' })).toContain('bg-transparent');
    });

    it('applies size', () => {
      expect(buttonVariants({ size: 'sm' })).toContain('h-7');
      expect(buttonVariants({ size: 'lg' })).toContain('h-11');
    });
  });

  describe('badgeVariants', () => {
    it('returns default (primary)', () => {
      expect(badgeVariants()).toContain('bg-secondary-100');
    });

    it('applies success intent', () => {
      expect(badgeVariants({ intent: 'success' })).toContain('bg-success-100');
    });

    it('applies error intent', () => {
      expect(badgeVariants({ intent: 'error' })).toContain('bg-danger-100');
    });
  });

  describe('inputVariants', () => {
    it('returns default', () => {
      const cls = inputVariants();
      expect(cls).toContain('border');
      expect(cls).toContain('rounded-md');
    });

    it('applies error state', () => {
      expect(inputVariants({ state: 'error' })).toContain('border-danger');
    });
  });

  describe('labelVariants', () => {
    it('returns default', () => {
      expect(labelVariants()).toContain('text-sm');
    });

    it('applies muted intent', () => {
      expect(labelVariants({ intent: 'muted' })).toContain('text-primary-400');
    });
  });

  describe('alertVariants', () => {
    it('returns default (info)', () => {
      expect(alertVariants()).toContain('border-primary');
    });

    it('applies success', () => {
      expect(alertVariants({ intent: 'success' })).toContain('border-success');
    });

    it('applies error', () => {
      expect(alertVariants({ intent: 'error' })).toContain('border-danger');
    });
  });

  describe('dialogContentVariants', () => {
    it('returns default (md)', () => {
      expect(dialogContentVariants()).toContain('max-w');
    });

    it('applies full size', () => {
      expect(dialogContentVariants({ size: 'full' })).toContain('100vw');
    });
  });

  describe('tooltipVariants', () => {
    it('returns default classes', () => {
      const cls = tooltipVariants();
      expect(cls).toContain('absolute');
      expect(cls).toContain('z-');
    });
  });

  describe('accordionVariants', () => {
    it('returns default classes', () => {
      const cls = accordionVariants();
      expect(cls).toBeTruthy();
    });
  });

  describe('cardVariants', () => {
    it('returns default classes', () => {
      const cls = cardVariants();
      expect(cls).toContain('rounded');
    });
  });
});

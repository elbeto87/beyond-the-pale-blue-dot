import { describe, it, expect, beforeEach } from 'vitest';
import { useActiveCategory } from './category.store';

describe('useActiveCategory store', () => {
  beforeEach(() => {
    useActiveCategory.setState({ active: 'hazardous' });
  });

  it('defaults to the hazardous category', () => {
    expect(useActiveCategory.getState().active).toBe('hazardous');
  });

  it('switches the active category', () => {
    useActiveCategory.getState().setActive('large');
    expect(useActiveCategory.getState().active).toBe('large');

    useActiveCategory.getState().setActive('near');
    expect(useActiveCategory.getState().active).toBe('near');
  });
});


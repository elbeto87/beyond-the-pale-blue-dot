import { create } from 'zustand';
import type { AsteroidCategory } from './tabs.config';

interface CategoryState {
  active: AsteroidCategory;
  setActive: (category: AsteroidCategory) => void;
}

export const useActiveCategory = create<CategoryState>((set) => ({
  active: 'hazardous',
  setActive: (active) => set({ active }),
}));
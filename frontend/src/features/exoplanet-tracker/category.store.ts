import { create } from 'zustand';
import type { ExoplanetCategory } from './tabs.config';

interface ExoplanetCategoryState {
  active: ExoplanetCategory;
  setActive: (category: ExoplanetCategory) => void;
}

export const useActiveExoplanetCategory = create<ExoplanetCategoryState>((set) => ({
  active: 'latest',
  setActive: (active) => set({ active }),
}));


import { create } from 'zustand';
import type { Asteroid } from '../../shared/api/types';

interface SelectedAsteroidState {
  selected: Asteroid | null;
  setSelected: (asteroid: Asteroid | null) => void;
}

export const useSelectedAsteroid = create<SelectedAsteroidState>((set) => ({
  selected: null,
  setSelected: (selected) => set({ selected }),
}));


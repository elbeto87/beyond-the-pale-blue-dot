import { create } from 'zustand';
import type { Asteroid, ImpactEvent } from '../../shared/api/types';

interface SelectedAsteroidState {
  asteroid: Asteroid | null;
  events: ImpactEvent[];
  setAsteroid: (asteroid: Asteroid, events: ImpactEvent[]) => void;
  clear: () => void;
}

/**
 * Holds the asteroid picked from the search box together with all of its
 * potential impact events. Selecting one of the listed impact dates promotes
 * that event into `useSelectedImpactEvent` so the data sheet is shown.
 */
export const useSelectedAsteroid = create<SelectedAsteroidState>((set) => ({
  asteroid: null,
  events: [],
  setAsteroid: (asteroid, events) => set({ asteroid, events }),
  clear: () => set({ asteroid: null, events: [] }),
}));


import { create } from 'zustand';
import type { Exoplanet } from '../../shared/api/types';

interface SelectedExoplanetState {
  exoplanet: Exoplanet | null;
  setExoplanet: (exoplanet: Exoplanet) => void;
  clear: () => void;
}

/**
 * Holds the exoplanet picked from the search box so its data sheet can be
 * shown in the exoplanet tracker view.
 */
export const useSelectedExoplanet = create<SelectedExoplanetState>((set) => ({
  exoplanet: null,
  setExoplanet: (exoplanet) => set({ exoplanet }),
  clear: () => set({ exoplanet: null }),
}));


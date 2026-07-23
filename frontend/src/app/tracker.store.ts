import { create } from 'zustand';

export const TRACKER_MODES = [
  { id: 'asteroid', label: 'ASTEROIDS' },
  { id: 'exoplanet', label: 'EXOPLANETS' },
] as const;

export type TrackerMode = (typeof TRACKER_MODES)[number]['id'];

interface TrackerState {
  mode: TrackerMode;
  setMode: (mode: TrackerMode) => void;
}

export const useTrackerMode = create<TrackerState>((set) => ({
  mode: 'asteroid',
  setMode: (mode) => set({ mode }),
}));


import { create } from 'zustand';
import type { ImpactEvent } from '../../shared/api/types';

interface SelectedImpactEventState {
  selected: ImpactEvent | null;
  setSelected: (event: ImpactEvent | null) => void;
}

export const useSelectedImpactEvent = create<SelectedImpactEventState>((set) => ({
  selected: null,
  setSelected: (selected) => set({ selected }),
}));


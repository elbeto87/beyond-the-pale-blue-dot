import { create } from 'zustand';

interface YearRangeState {
  years: number;
  setYears: (years: number) => void;
}

export const useYearRange = create<YearRangeState>((set) => ({
  years: 100,
  setYears: (years) => set({ years }),
}));

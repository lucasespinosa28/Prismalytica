import { create } from 'zustand';

interface TextState {
  candle: string;
  setCandle: (newCandle: string) => void;
  clearCandle: () => void;
}

export const useCandleStore = create<TextState>((set) => ({
  candle: '',
  setCandle: (newCandle) => set({ candle: newCandle }),
  clearCandle: () => set({ candle: '' }),
}));
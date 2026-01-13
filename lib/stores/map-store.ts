import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

import type { MapProvider } from '@/lib/map-providers/map-provider.interface';

interface MapStore {
  provider: MapProvider;
  setProvider: (provider: MapProvider) => void;
}

export const useMapStore = create<MapStore>()(
  persist(
    (set) => ({
      provider: 'google',
      setProvider: (provider) => set({ provider }),
    }),
    {
      name: 'map-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

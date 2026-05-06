import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type FavoritesStore = {
  favoriteIds: string[];
  toggleFavorite: (hotelId: string) => void;
};

export const useFavoritesStore = create<FavoritesStore>()(
  persist(
    set => ({
      favoriteIds: [],
      toggleFavorite: hotelId =>
        set(state => ({
          favoriteIds: state.favoriteIds.includes(hotelId)
            ? state.favoriteIds.filter(id => id !== hotelId)
            : [...state.favoriteIds, hotelId],
        })),
    }),
    {
      name: 'favorites-store',
      partialize: state => ({ favoriteIds: state.favoriteIds }),
    }
  )
);

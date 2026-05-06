import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type FavoritesStore = {
  favoriteIds: string[];
  toggleFavorite: (hotelId: string) => void;
  isFavorite: (hotelId: string) => boolean;
};

export const useFavoritesStore = create<FavoritesStore>()(
  persist(
    (set, get) => ({
      favoriteIds: [],
      toggleFavorite: hotelId =>
        set(state => ({
          favoriteIds: state.favoriteIds.includes(hotelId)
            ? state.favoriteIds.filter(id => id !== hotelId)
            : [...state.favoriteIds, hotelId],
        })),
      isFavorite: hotelId => get().favoriteIds.includes(hotelId),
    }),
    { name: 'favorites-store' }
  )
);

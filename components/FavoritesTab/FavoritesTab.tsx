'use client';

import { useQueries } from '@tanstack/react-query';
import { useFavoritesStore } from '@/lib/store/favoritesStore';
import { fetchHotelDetails } from '@/lib/api/clientApi';
import Image from 'next/image';
import Link from 'next/link';
import FavoriteButton from '@/components/FavoriteButton/FavoriteButton';
import Loader from '@/components/Loader/Loader';
import css from './FavoritesTab.module.css';

export default function FavoritesTab() {
  const favoriteIds = useFavoritesStore(state => state.favoriteIds);

  const results = useQueries({
    queries: favoriteIds.map(id => ({
      queryKey: ['hotelDetails', id],
      queryFn: () => fetchHotelDetails(id),
      staleTime: 5 * 60 * 1000,
    })),
  });

  if (favoriteIds.length === 0) {
    return <div className={css.empty}>Список улюблених порожній</div>;
  }

  const isLoading = results.some(r => r.isPending);
  const hotels = results.flatMap(r => (r.data ? [r.data] : []));

  if (isLoading && hotels.length === 0) return <Loader />;

  return (
    <div className={css.list}>
      {hotels.map(hotel => (
        <div key={hotel._id} className={css.card}>
          <Image
            src={hotel.imageUrl}
            alt={hotel.title}
            width={145}
            height={105}
            className={css.image}
          />
          <div className={css.info}>
            <div className={css.title}>{hotel.title}</div>
            <div className={css.location}>{hotel.location}</div>
            <div className={css.price}>
              {hotel.price.toLocaleString()} грн/ніч
            </div>
          </div>
          <div className={css.actions}>
            <Link href={`/${hotel._id}`} className={css.detailLink}>
              <span>Детальніше</span>
              <span className={css.arrow}> ↗</span>
            </Link>
            <FavoriteButton hotelId={hotel._id} />
          </div>
        </div>
      ))}
    </div>
  );
}

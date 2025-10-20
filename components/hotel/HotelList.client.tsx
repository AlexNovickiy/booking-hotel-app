'use client';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { fetchHotels } from '@/lib/api/clientApi'; // використовуємо серверний fetch для клієнта
import HotelCard from '@/components/hotel/HotelCard';
import css from '@/app/Home.module.css';
import { useState } from 'react';
import { HotelsResponse } from '@/lib/types';

// Це клієнтський компонент, який використовує TanStack Query.
// Початкові дані (initialData) будуть взяті з префетчу на сервері.
type HotelListClientProps = {
  initialData: HotelsResponse;
};

export default function HotelListClient({ initialData }: HotelListClientProps) {
  const [search] = useState(''); // Стан пошуку
  const [guests] = useState(2); // Стан кількості гостей

  // Використовуємо useQuery, щоб отримати дані. Ключ [hotels, search] дозволяє кешувати
  const { data, isLoading, isError } = useQuery({
    queryKey: ['hotels', search, guests],
    queryFn: () => fetchHotels(search, guests),
    placeholderData: keepPreviousData,
    initialData,
  });

  if (isLoading)
    return <p className={css.loadingText}>Завантаження готелів...</p>;
  if (isError)
    return (
      <p className={css.errorText}>
        Помилка завантаження даних. Спробуйте пізніше.
      </p>
    );

  const hotels = data?.hotels || [];

  return (
    <ul className={css.hotelGrid}>
      {hotels.length > 0 ? (
        hotels.map(hotel => (
          <li key={hotel.id}>
            <HotelCard hotel={hotel} />
          </li>
        ))
      ) : (
        <p className={css.noResults}>
          Не знайдено жодного готелю за вашим запитом.
        </p>
      )}
    </ul>
  );
}

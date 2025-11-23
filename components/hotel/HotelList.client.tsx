'use client';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { fetchHotels } from '@/lib/api/clientApi'; // використовуємо серверний fetch для клієнта
import HotelCard from '@/components/hotel/HotelCard';
import css from '@/app/Home.module.css';
import { useState } from 'react';
import { HotelsResponse } from '@/lib/types';
import Pagination from '@/components/Pagination/Pagination';
import { useSearchParams } from 'next/navigation';

// Це клієнтський компонент, який використовує TanStack Query.
// Початкові дані (initialData) будуть взяті з префетчу на сервері.
type HotelListClientProps = {
  initialData: HotelsResponse;
};

export default function HotelListClient({ initialData }: HotelListClientProps) {
  const searchParams = useSearchParams();
  const search = searchParams.get('q') || '';
  const guests = Number(searchParams.get('guests')) || 2;
  const [currentPage, setCurrentPage] = useState(
    Number(searchParams.get('page')) || 1
  );

  const {
    data: response,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['hotels', search, guests, currentPage],
    queryFn: () => fetchHotels(search, currentPage, 10, guests),
    placeholderData: keepPreviousData,
    initialData,
    refetchOnMount: false,
  });

  if (isLoading)
    return <p className={css.loadingText}>Завантаження готелів...</p>;
  if (isError)
    return (
      <p className={css.errorText}>
        Помилка завантаження даних. Спробуйте пізніше.
      </p>
    );

  const hotels = response?.data?.hotels || [];

  return (
    <>
      {response?.data?.totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={response?.data?.totalPages}
          onPageChange={setCurrentPage}
        />
      )}
      <ul className={css.hotelGrid}>
        {hotels.length > 0 ? (
          hotels.map(hotel => (
            <li key={hotel._id}>
              <HotelCard hotel={hotel} />
            </li>
          ))
        ) : (
          <p className={css.noResults}>
            Не знайдено жодного готелю за вашим запитом.
          </p>
        )}
      </ul>
    </>
  );
}

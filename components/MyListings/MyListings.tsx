'use client';
import { useQuery } from '@tanstack/react-query';
import { fetchUserListings } from '@/lib/api/clientApi';
import HotelCard from '@/components/hotel/HotelCard';
import Loader from '@/components/Loader/Loader';
import ErrorMessage from '@/components/ErrorMessage/ErrorMessage';
import css from './MyListings.module.css';
import Link from 'next/link';

export default function MyListings() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['userListings'],
    queryFn: fetchUserListings,
  });

  if (isLoading) return <Loader />;
  if (isError) return <ErrorMessage />;

  const listings = data || [];

  return (
    <div>
      <div className={css.header}>
        <h2>Мої оголошення</h2>
        <Link href="/host/add-listing" className={css.addButton}>
          + Додати
        </Link>
      </div>
      {listings.length > 0 ? (
        <div className={css.listingsGrid}>
          {listings.map(hotel => (
            <HotelCard key={hotel._id} hotel={hotel} />
          ))}
        </div>
      ) : (
        <div className={css.noListings}>
          <p>У вас ще немає оголошень.</p>
          <Link href="/host/add-listing" className={css.createLink}>
            Створити перше?
          </Link>
        </div>
      )}
    </div>
  );
}

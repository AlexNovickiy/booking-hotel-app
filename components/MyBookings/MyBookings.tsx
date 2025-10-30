import { useQuery } from '@tanstack/react-query';
import { fetchMyBookings } from '@/lib/api/clientApi';
import css from './MyBookings.module.css';
import Loader from '@/components/Loader/Loader';
import ErrorMessage from '@/components/ErrorMessage/ErrorMessage';
import Image from 'next/image';
import Link from 'next/link';

export default function MyBookings() {
  const {
    data: bookings,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['myBookings'],
    queryFn: fetchMyBookings,
    staleTime: 3 * 60 * 1000,
  });

  if (isLoading) return <Loader />;
  if (isError || !bookings) return <ErrorMessage />;
  if (bookings.length === 0)
    return <div className={css.empty}>Немає бронювань</div>;

  return (
    <div className={css.list}>
      {bookings.map(b => (
        <div className={css.card} key={b.id}>
          <div className={css.leftBlock}>
            <Image
              src={b.hotel.imageUrl}
              alt={b.hotel.title}
              className={css.image}
              width={145}
              height={105}
            />
            <Link href={`/${b.hotel.id}`} className={css.goHotelBtn}>
              <span>Перейти до готелю</span>
              <span className={css.arrowIcon}> ↗</span>
            </Link>
          </div>
          <div className={css.info}>
            <div className={css.hotelTitle}>{b.hotel.title}</div>
            <div className={css.dates}>
              {b.checkIn} — {b.checkOut}
            </div>
            <div className={css.guests}>Гостей: {b.guests}</div>
            <div className={css.status + ' ' + css[b.status]}>
              {labelStatus(b.status)}
            </div>
            {b.specialRequests && (
              <div className={css.specialReqs}>
                Побажання: {b.specialRequests}
              </div>
            )}
            <div className={css.price}>
              Ціна: {b.hotel.price.toLocaleString()} грн / ніч
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function labelStatus(status: 'pending' | 'confirmed' | 'cancelled') {
  switch (status) {
    case 'pending':
      return 'В обробці';
    case 'confirmed':
      return 'Підтверджено';
    case 'cancelled':
      return 'Скасовано';
    default:
      return status;
  }
}

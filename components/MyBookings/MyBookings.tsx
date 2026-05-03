import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchMyBookings, deleteBooking } from '@/lib/api/clientApi';
import { Booking } from '@/lib/types';
import css from './MyBookings.module.css';
import Loader from '@/components/Loader/Loader';
import ErrorMessage from '@/components/ErrorMessage/ErrorMessage';
import Image from 'next/image';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function MyBookings() {
  const queryClient = useQueryClient();

  const {
    data: bookings,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['myBookings'],
    queryFn: fetchMyBookings,
    staleTime: 3 * 60 * 1000,
  });

  const { mutate: removeBooking, isPending: isDeleting } = useMutation({
    mutationFn: deleteBooking,
    onSuccess: (_, bookingId) => {
      queryClient.setQueryData<Booking[]>(['myBookings'], prev =>
        prev ? prev.filter(b => b._id !== bookingId) : []
      );
      toast.success('Бронювання видалено.');
    },
    onError: () => {
      toast.error('Не вдалося видалити бронювання.');
    },
  });

  if (isLoading) return <Loader />;
  if (isError || !bookings) return <ErrorMessage />;
  if (bookings.length === 0)
    return <div className={css.empty}>Немає бронювань</div>;

  return (
    <div className={css.list}>
      {bookings.map(b => (
        <div className={css.card} key={b._id}>
          <div className={css.leftBlock}>
            <Image
              src={b.hotel.imageUrl}
              alt={b.hotel.title}
              className={css.image}
              width={145}
              height={105}
            />
            <Link href={`/${b.hotel._id}`} className={css.goHotelBtn}>
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
            <div className={css.price}>
              Ціна: {b.hotel.price.toLocaleString()} грн / ніч
            </div>
            {(b.status === 'completed' || b.status === 'cancelled') && (
              <button
                className={css.deleteButton}
                onClick={() => removeBooking(b._id)}
                disabled={isDeleting}
              >
                Видалити
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function labelStatus(status: 'pending' | 'confirmed' | 'cancelled' | 'completed') {
  switch (status) {
    case 'pending':
      return 'В обробці';
    case 'confirmed':
      return 'Підтверджено';
    case 'cancelled':
      return 'Скасовано';
    case 'completed':
      return 'Завершено';
    default:
      return status;
  }
}

'use client';

import { fetchHotelDetails } from '@/lib/api/serverApi';
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import Loader from '@/components/Loader/Loader';
import ErrorMessage from '@/components/ErrorMessage/ErrorMessage';
import css from './DetailPage.module.css';
import Icon from '../ui/Icon';

type DetailPageClientProps = {
  hotelId: string;
};

export default function DetailPageClient({ hotelId }: DetailPageClientProps) {
  const {
    data: hotel,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['hotelDetails', hotelId],
    queryFn: () => fetchHotelDetails(hotelId),
  });

  if (isLoading) return <Loader />;
  if (isError || !hotel) return <ErrorMessage />;

  return (
    <div className={css.container}>
      <h1 className={css.title}>{hotel.title}</h1>
      <div className={css.meta}>
        <div className={css.rating}>
          <Icon name="star" className={css.starIcon} />
          <span>{hotel.ratings_summary.average_rating.toFixed(1)}</span>
          <span className={css.reviewsCount}>
            ({hotel.ratings_summary.total_reviews} відгуків)
          </span>
        </div>
        <div className={css.location}>
          <Icon name="map" className={css.mapIcon} />
          <span>{hotel.location}</span>
        </div>
      </div>

      <div className={css.gallery}>
        <Image
          src={hotel.imageUrl}
          alt={hotel.title}
          width={1200}
          height={600}
          className={css.mainImage}
          priority
        />
      </div>

      <div className={css.detailsGrid}>
        <div className={css.description}>
          <h2>Про помешкання</h2>
          <p>{hotel.description}</p>
        </div>
        <div className={css.bookingBox}>
          <div className={css.price}>
            <span className={css.priceValue}>
              {hotel.price.toLocaleString()} грн
            </span>
            / ніч
          </div>
          <button className={css.bookButton}>Забронювати</button>
        </div>
      </div>

      <div className={css.reviewsSection}>
        <h2>Відгуки</h2>
        {hotel.reviews.length > 0 ? (
          hotel.reviews.map(review => (
            <div key={review.user.id} className={css.reviewCard}>
              <div className={css.reviewHeader}>
                <Image
                  src={review.user.photo}
                  alt={review.user.name}
                  width={40}
                  height={40}
                  className={css.reviewAvatar}
                />
                <div>
                  <p className={css.reviewAuthor}>{review.user.name}</p>
                  <p className={css.reviewDate}>{review.date}</p>
                </div>
              </div>
              <p className={css.reviewText}>{review.text}</p>
            </div>
          ))
        ) : (
          <p>Відгуків ще немає.</p>
        )}
      </div>
    </div>
  );
}

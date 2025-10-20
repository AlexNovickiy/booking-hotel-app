import type { Hotel } from '@/lib/types';
import Image from 'next/image';
import css from './HotelCard.module.css';
import Icon from '../ui/Icon';
import Link from 'next/link';

type HotelCardProps = {
  hotel: Hotel;
};

export default function HotelCard({ hotel }: HotelCardProps) {
  const detailUrl = `/${hotel.id}`;
  const rating = hotel.ratings_summary.average_rating.toFixed(1);

  return (
    <div className={css.card}>
      <Image
        src={hotel.imageUrl}
        alt={hotel.title}
        width={400}
        height={250}
        className={css.image}
        priority
      />
      <div className={css.content}>
        <div className={css.header}>
          <h3 className={css.title}>{hotel.title}</h3>
          <div className={css.rating}>
            <Icon name="star" className={css.starIcon} />
            {rating}
          </div>
        </div>
        <p className={css.location}>{hotel.location}</p>
        <p className={css.price}>
          <span className={css.priceValue}>{hotel.price.toLocaleString()}</span>{' '}
          грн/ніч
        </p>
        <Link href={detailUrl} className={css.button}>
          Деталі та Бронювання
        </Link>
      </div>
    </div>
  );
}

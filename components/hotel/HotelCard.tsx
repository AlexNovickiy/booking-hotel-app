'use client';

import type { Hotel } from '@/lib/types';
import Image from 'next/image';
import css from './HotelCard.module.css';
import Icon from '../ui/Icon';
import Link from 'next/link';
import FavoriteButton from '@/components/FavoriteButton/FavoriteButton';
import { useState } from 'react';

const FALLBACK = '/images/placeholder-image.png';

function resolveImage(url: string): string {
  if (!url || url.includes('placehold.co')) return FALLBACK;
  return url;
}

type HotelCardProps = {
  hotel: Hotel;
};

export default function HotelCard({ hotel }: HotelCardProps) {
  const detailUrl = `/${hotel._id}`;
  const rating = hotel.ratings_summary.average_rating.toFixed(1);
  const [imgSrc, setImgSrc] = useState(() => resolveImage(hotel.imageUrl));

  return (
    <div className={css.card}>
      <div className={css.imageWrapper}>
        <Image
          src={imgSrc}
          alt={hotel.title}
          width={400}
          height={250}
          className={css.image}
          priority
          onError={() => setImgSrc(FALLBACK)}
        />
        <FavoriteButton hotelId={hotel._id} className={css.favoriteBtn} />
      </div>
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

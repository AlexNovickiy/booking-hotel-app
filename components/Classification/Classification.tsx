import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getAllClassificationTopHotels } from '@/lib/api/clientApi';
import css from './Classification.module.css';
import Loader from '@/components/Loader/Loader';
import ErrorMessage from '@/components/ErrorMessage/ErrorMessage';
import { ClassificationTab } from '@/lib/types';
import Link from 'next/link';

const TABS: { key: ClassificationTab; label: string }[] = [
  { key: 'average', label: 'Загальний рейтинг' },
  { key: 'cleanliness', label: 'Найвища чистота' },
  { key: 'location', label: 'Найкраща локація' },
];

function getColorClass(score: number) {
  if (score >= 4.95) return css.scoreGreen;
  if (score >= 4.8) return css.scoreBlue;
  if (score >= 4.5) return css.scoreOrange;
  return css.scoreRed;
}

export const Classification = () => {
  const [activeTab, setActiveTab] = useState<ClassificationTab>('average');

  const { data, isLoading, isError } = useQuery({
    queryKey: ['classification-hotels'],
    queryFn: getAllClassificationTopHotels,
    staleTime: 5 * 60 * 1000,
  });

  if (isLoading) return <Loader />;
  if (isError || !data) return <ErrorMessage />;

  const hotels = data[activeTab];

  return (
    <div>
      <h2 className={css.heading}>Аналітика: Класифікація Найкращих Готелів</h2>
      <div className={css.subheading}>
        Топ-готелів, відсортованих за агрегованими оцінками.
      </div>
      <div className={css.tabsWrap}>
        {TABS.map(tab => (
          <button
            key={tab.key}
            className={activeTab === tab.key ? css.tabActive : css.tab}
            onClick={() => setActiveTab(tab.key)}
            type="button"
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className={css.hotelsWrap}>
        {hotels.map(hotel => (
          <div className={css.hotelCard} key={hotel.id}>
            <div className={getColorClass(hotel.score)}>{hotel.score}</div>
            <div>
              <div className={css.hotelName}>{hotel.title}</div>
              <div className={css.hotelScore}>
                Бал: <span>{hotel.score}</span>
              </div>
            </div>
            <Link className={css.goHotelLink} href={`/${hotel.id}`}>
              Переглянути
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Classification;

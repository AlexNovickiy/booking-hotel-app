'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchRecommendations } from '@/lib/api/clientApi';
import { useAuthStore } from '@/lib/store/authStore';
import HotelCard from './HotelCard';
import css from './RecommendedHotels.module.css';

export default function RecommendedHotels() {
  const token = useAuthStore(state => state.token);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['recommendations'],
    queryFn: () => fetchRecommendations(5),
    enabled: !!token,
    staleTime: 1000 * 60 * 5,
  });

  if (!token) return null;

  if (isLoading) {
    return (
      <section className={css.section}>
        <h2 className={css.title}>Рекомендовано для вас</h2>
        <p className={css.status}>Підбираємо готелі під ваші уподобання…</p>
      </section>
    );
  }

  if (isError || !data || data.length === 0) return null;

  const isPersonalized = data[0]?.recommendation_reason === 'personalized';

  return (
    <section className={css.section}>
      <div className={css.header}>
        <h2 className={css.title}>
          {isPersonalized ? 'Рекомендовано для вас' : 'Найкращі готелі'}
        </h2>
        <span className={css.badge}>
          {isPersonalized
            ? 'На основі ваших бронювань'
            : 'Популярні серед гостей'}
        </span>
      </div>

      <ul className={css.grid}>
        {data.map(hotel => (
          <li key={hotel._id} className={css.cardWrapper}>
            {isPersonalized && hotel.similarity_score !== null && (
              <div className={css.scoreBar}>
                <div
                  className={css.scoreFill}
                  style={{
                    width: `${Math.round(hotel.similarity_score * 100)}%`,
                  }}
                />
                <span className={css.scoreLabel}>
                  Збіг {Math.round(hotel.similarity_score * 100)}%
                </span>
              </div>
            )}
            <HotelCard hotel={hotel} />
          </li>
        ))}
      </ul>
    </section>
  );
}

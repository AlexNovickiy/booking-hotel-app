import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from '@tanstack/react-query';
import { fetchHotels } from '@/lib/api/serverApi';
import HotelListClient from '@/components/hotel/HotelList.client';
import SearchBarClient from '@/components/hotel/SearchBar.client';
import css from '@/app/Home.module.css';

// Server Component
export default async function HomePage() {
  const queryClient = new QueryClient();
  const initialData = await fetchHotels('', 2);
  queryClient.prefetchQuery({
    queryKey: ['hotels', '', 2],
    queryFn: () => initialData,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className={css.homeContainer}>
        <h1 className={css.heroTitle}>
          Знайдіть ідеальне житло для вашої подорожі
        </h1>

        {/* Клієнтські компоненти для інтерактивності */}
        <SearchBarClient />

        <div className={css.hotelGridWrapper}>
          <HotelListClient initialData={initialData} />
        </div>
      </div>
    </HydrationBoundary>
  );
}

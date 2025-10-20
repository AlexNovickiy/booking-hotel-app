import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from '@tanstack/react-query';
import { prefetchUserData } from '@/lib/api/serverApi';
import ProfileClient from '@/components/ProfileClient/ProfileClient';
import { Metadata } from 'next';
import css from './Profile.module.css';
import { Suspense } from 'react';
import Loader from '@/components/Loader/Loader';

export const metadata: Metadata = {
  title: 'Мій профіль - HotelBooking',
  description: 'Керуйте вашим профілем, бронюваннями та оголошеннями.',
};

// SERVER COMPONENT: Data Prefetching
export default async function ProfilePage() {
  const queryClient = new QueryClient();

  await prefetchUserData(queryClient);

  return (
    <div className={css.profileLayout}>
      <Suspense fallback={<Loader />}>
        <HydrationBoundary state={dehydrate(queryClient)}>
          <ProfileClient />
        </HydrationBoundary>
      </Suspense>
    </div>
  );
}

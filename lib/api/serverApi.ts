import { QueryClient } from '@tanstack/react-query';
import { CheckSession } from '@/lib/types';
import { nextServer } from './api';
import { cookies } from 'next/headers';
import { fetchHotelDetails, fetchHotels, getMe } from './clientApi';

// *** TANSTACK QUERY PREFETCHING ***
export const prefetchHotels = async (
  queryClient: QueryClient,
  initialQuery: string = ''
) => {
  await queryClient.prefetchQuery({
    queryKey: ['hotels', initialQuery],
    queryFn: () => fetchHotels(initialQuery),
  });
};

export const prefetchHotelDetails = async (
  queryClient: QueryClient,
  hotelId: string
) => {
  await queryClient.prefetchQuery({
    queryKey: ['hotelDetails', hotelId],
    queryFn: () => fetchHotelDetails(hotelId),
  });
};

export const prefetchUserData = async (queryClient: QueryClient) => {
  await queryClient.prefetchQuery({
    queryKey: ['user'],
    queryFn: getMe,
  });
};

export async function checkServerSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get('Authorization')?.value.split(' ')[1] || '';
  const response = await nextServer.get<CheckSession>('/auth/session', {
    headers: {
      Authorization: `Bearer ${token}`,
      Cookie: cookieStore.toString(),
    },
  });
  return response;
}

import { QueryClient } from '@tanstack/react-query';
import {
  CheckSession,
  Hotel,
  HotelResponse,
  HotelsResponse,
  UserResponse,
} from '@/lib/types';
import { nextServer } from './apiNext';
import { cookies } from 'next/headers';
import { nextClient } from './api';

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
  try {
    const cookieStore = await cookies();
    const response = await nextServer.get<CheckSession>('/auth/session', {
      headers: {
        Cookie: cookieStore.toString(),
      },
    });
    return response;
  } catch (error) {
    console.error('Error in checkServerSession:', error);
    throw error;
  }
}

export async function fetchHotels(
  q: string = '',
  page: number = 1,
  perPage: number = 10
): Promise<HotelsResponse> {
  const query = {
    ...(q && { q }),
    ...(page && { page: page.toString() }),
    ...(perPage && { perPage: perPage.toString() }),
  };
  try {
    const response = await nextServer.get<HotelsResponse>('/hotels', {
      params: query,
    });
    return response.data;
  } catch (error) {
    console.error('Error in fetchHotels:', error);
    throw error;
  }
}

export async function fetchHotelDetails(id: string): Promise<Hotel> {
  const response = await nextServer.get<HotelResponse>(`/hotels/${id}`);
  return response.data.data;
}

export async function getMe(): Promise<UserResponse> {
  const response = await nextClient.get<UserResponse>('/users/me');
  return response.data;
}

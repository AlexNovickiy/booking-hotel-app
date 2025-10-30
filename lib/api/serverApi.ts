import { QueryClient } from '@tanstack/react-query';
import { CheckSession, Hotel, HotelDetails, HotelsResponse } from '@/lib/types';
import { nextServer } from './apiNext';
import { cookies } from 'next/headers';

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

// *** MOCK DATA & FUNCTIONS ***
const mockHotels: Hotel[] = [
  {
    id: '1',
    title: 'Затишний будиночок у Карпатах',
    location: 'Яремче',
    price: 1800,
    description: '...',
    imageUrl: 'https://placehold.co/400x250/1e40af/ffffff?text=Hotel+1',
    ratings_summary: {
      average_rating: 4.8,
      cleanliness_score: 4.9,
      location_score: 4.7,
      total_reviews: 125,
    },
  },
  {
    id: '2',
    title: 'Студія в центрі Києва (Люкс)',
    location: 'Київ',
    price: 3200,
    description: '...',
    imageUrl: 'https://placehold.co/400x250/2563eb/ffffff?text=Hotel+2',
    ratings_summary: {
      average_rating: 4.5,
      cleanliness_score: 4.3,
      location_score: 5.0,
      total_reviews: 300,
    },
  },
  {
    id: '3',
    title: 'Бунгало на березі',
    location: 'Одеса',
    price: 2500,
    description: '...',
    imageUrl: 'https://placehold.co/400x250/065f46/ffffff?text=Hotel+3',
    ratings_summary: {
      average_rating: 4.9,
      cleanliness_score: 4.8,
      location_score: 4.9,
      total_reviews: 80,
    },
  },
];

export async function fetchHotels(
  query: string = '',
  guests: number = 2,
  page: number = 1
): Promise<HotelsResponse> {
  console.log(`[SERVER FETCH] Fetching hotels for query: ${query}`);
  await new Promise(resolve => setTimeout(resolve, 50));

  const filteredHotels = mockHotels.filter(
    h =>
      h.title.toLowerCase().includes(query.toLowerCase()) ||
      h.location.toLowerCase().includes(query.toLowerCase())
  );

  return { hotels: filteredHotels, totalPages: 2, currentPage: page };
}

export async function fetchHotelDetails(id: string): Promise<HotelDetails> {
  console.log(`[SERVER FETCH] Fetching hotel details for ID: ${id}`);
  await new Promise(resolve => setTimeout(resolve, 50));
  const hotel = mockHotels.find(h => h.id === id);
  if (!hotel) throw new Error('Hotel not found');

  return {
    ...hotel,
    description: `Розкішний опис готелю №${id}. Ідеальне місце для відпочинку та роботи.`,
    reviews: [
      {
        user: {
          id: '1',
          name: 'Анна К.',
          email: 'anna@example.com',
          photo: 'https://placehold.co/120x120/1f2937/ffffff?text=U',
        },
        rating: 5,
        text: 'Чудово! Чистота на найвищому рівні. Локація ідеальна, все сподобалось.',
        date: '2025-09-10',
        cleanliness_score: 4,
        location_score: 5,
      },
      {
        user: {
          id: '2',
          name: 'Богдан Л.',
          email: 'bogdan@example.com',
          photo: 'https://placehold.co/120x120/1f2937/ffffff?text=U',
        },
        rating: 4,
        text: 'Трохи шумно вночі, але локація супер.',
        date: '2025-08-25',
        cleanliness_score: 3,
        location_score: 4,
      },
      {
        user: {
          id: '3',
          name: 'Катерина П.',
          email: 'katerina@example.com',
          photo: 'https://placehold.co/120x120/1f2937/ffffff?text=U',
        },
        rating: 5,
        text: 'Власник привітний, все сподобалось.',
        date: '2025-08-01',
        cleanliness_score: 4,
        location_score: 5,
      },
      {
        user: {
          id: '4',
          name: 'Ігор С.',
          email: 'igor@example.com',
          photo: 'https://placehold.co/120x120/1f2937/ffffff?text=U',
        },
        rating: 3,
        text: 'Ціна зависока для такого рівня сервісу.',
        date: '2025-07-15',
        cleanliness_score: 4,
        location_score: 5,
      },
    ],
  };
}

const mockUser = {
  id: 'user-123',
  name: 'Олександр',
  email: 'novickiisasha78@gmail.com',
  photo: 'https://placehold.co/120x120/1f2937/ffffff?text=U',
};

export async function getMe() {
  // const response = await nextServer.get<User>('/users/me');
  // return response.data;
  return mockUser;
}

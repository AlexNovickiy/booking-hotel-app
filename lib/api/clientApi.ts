'use client';

import {
  CheckSession,
  Hotel,
  HotelDetails,
  HotelsResponse,
  LoginCredentials,
  NewUser,
  SessionResponse,
  ClassificationAll,
  NewBooking,
  Booking,
} from '@/lib/types';
import { nextClient } from './api';
import axios from 'axios';
import { useAuthStore } from '@/lib/store/authStore';

const GEMINI_API_URL =
  process.env.NEXT_PUBLIC_GEMINI_API_URL +
    '?key=' +
    process.env.NEXT_PUBLIC_API_KEY_GEMINI || '';

console.log(GEMINI_API_URL);

// Функція для отримання заголовків авторизації
export const getAuthHeaders = () => {
  const { token } = useAuthStore.getState();
  return token ? { Authorization: `Bearer ${token}` } : null;
};

type GeminiPayload = {
  contents: { parts: { text: string }[] }[];
  systemInstruction: { parts: { text: string }[] };
};

// --- GEMINI --- //

const fetchGemini = async (payload: GeminiPayload) => {
  const response = await fetch(GEMINI_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Gemini API error: ${response.statusText}`);
  }

  const result = await response.json();
  const text =
    result.candidates?.[0]?.content?.parts?.[0]?.text ||
    'Не вдалося згенерувати відповідь.';
  return text;
};

export async function generateDescriptionWithGemini(
  title: string,
  location: string
): Promise<string> {
  const systemPrompt =
    'Ти професійний маркетолог нерухомості. Створи привабливий та стислий опис готелю для Airbnb-подібного сайту.';
  const userQuery = `Створи короткий, на 3-4 речення, опис для оголошення: Назва: "${title}", Локація: "${location}". Наголоси на унікальності та комфорті.`;

  const payload = {
    contents: [{ parts: [{ text: userQuery }] }],
    systemInstruction: { parts: [{ text: systemPrompt }] },
  };

  return await fetchGemini(payload);
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
        cleanliness_score: 5,
        location_score: 2,
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
        cleanliness_score: 5,
        location_score: 3,
      },
    ],
  };
}

export async function fetchUserListings(): Promise<Hotel[]> {
  console.log(`[SERVER FETCH] Fetching user listings for profile.`);
  await new Promise(resolve => setTimeout(resolve, 50));
  return mockHotels; // Return the mock hotels as user listings
}

// --- AUTH MOCK ---
export async function loginUser(
  credentials: LoginCredentials
): Promise<SessionResponse> {
  await new Promise(resolve => setTimeout(resolve, 300));

  // В реальному проекті тут буде запит до API
  const mockResponse = {
    data: {
      accessToken: 'mock-jwt-token-1234567890',
    },
  };

  return mockResponse;
}
export async function logoutUser(): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, 300));
}

// --- MUTATIONS ---
export async function postReview(
  hotelId: number,
  reviewData: { text: string; rating: number }
) {
  console.log(`[CLIENT API] Posting review for ${hotelId}:`, reviewData);

  // В реальному проекті тут буде запит з авторизацією

  try {
    // const response = await authAxios.post(`/hotels/${hotelId}/reviews`, reviewData);
    // return response.data;

    // Mock response
    await new Promise(resolve => setTimeout(resolve, 500));
    return { success: true };
  } catch (error) {
    console.error('Error posting review:', error);
    throw error;
  }
}

export async function createNewListing(formData: FormData) {
  const response = await axios.post('/api/listings', formData);

  return response.data;
}

export async function analyzeReviewsWithGemini(
  reviews: string[]
): Promise<string> {
  const reviewText = reviews.map((r, i) => `${i + 1}. ${r}`).join('\n');
  const systemPrompt =
    'Ти аналітик даних. Стисло проаналізуй надані відгуки. Виділи 3-4 основні переваги та 3-4 недоліки у форматі маркованого списку. Відповідь дай лише українською.';
  const userQuery = `Проаналізуй наступні відгуки про готель та виділи ключові моменти:\n\nВідгуки:\n${reviewText}`;

  const payload = {
    contents: [{ parts: [{ text: userQuery }] }],
    systemInstruction: { parts: [{ text: systemPrompt }] },
  };

  return await fetchGemini(payload);
}

export async function checkSession() {
  await new Promise(resolve => setTimeout(resolve, 300));

  // В реальному проекті тут буде запит до API
  const mockResponse = {
    data: {
      accessToken: 'mock-jwt-token-1234567890',
    },
  };

  return mockResponse;
}

const mockUser = {
  id: 'user-123',
  name: 'Олександр',
  email: 'novickiisasha78@gmail.com',
  photo: 'https://placehold.co/120x120/1f2937/ffffff?text=U',
};

export async function getMe() {
  // const response = await nextClient.get<User>('/users/me');
  // return response.data;
  return mockUser;
}

export async function registerUser(userData: NewUser) {
  // const response = await nextClient.post<User>('/auth/register', userData);
  // return response.data;
  return mockUser;
}

export async function getAllClassificationTopHotels(): Promise<ClassificationAll> {
  // Симуляція затримки
  await new Promise(res => setTimeout(res, 200));

  // Всі готелі, сортовані за відповідним рейтингом, slice не використовується
  const average = [...mockHotels]
    .sort(
      (a, b) =>
        b.ratings_summary.average_rating - a.ratings_summary.average_rating
    )
    .map(h => ({
      id: h.id,
      title: h.title,
      score: h.ratings_summary.average_rating,
    }));

  const cleanliness = [...mockHotels]
    .sort(
      (a, b) =>
        b.ratings_summary.cleanliness_score -
        a.ratings_summary.cleanliness_score
    )
    .map(h => ({
      id: h.id,
      title: h.title,
      score: h.ratings_summary.cleanliness_score,
    }));

  const location = [...mockHotels]
    .sort(
      (a, b) =>
        b.ratings_summary.location_score - a.ratings_summary.location_score
    )
    .map(h => ({
      id: h.id,
      title: h.title,
      score: h.ratings_summary.location_score,
    }));

  return { average, cleanliness, location };
}

export async function createBooking(
  newBooking: NewBooking
): Promise<{ success: boolean }> {
  await new Promise(res => setTimeout(res, 300));
  return { success: true };
}

export async function fetchMyBookings(): Promise<Booking[]> {
  await new Promise(res => setTimeout(res, 200));
  return [
    {
      id: '1',
      hotel: {
        id: '1',
        title: 'Затишний будиночок у Карпатах',
        imageUrl: '',
        location: 'Яремче',
        price: 1800,
      },
      user: {
        id: 'user-123',
        name: 'Олександр',
        email: 'novickiisasha78@gmail.com',
      },
      checkIn: '2025-12-12',
      checkOut: '2025-12-15',
      guests: 2,
      status: 'confirmed',
      createdAt: '2025-10-01T09:00:00.000Z',
      specialRequests: 'Тиха кімната',
    },
  ];
}

// --- BOOKINGS BY HOTEL (MOCK) ---
export async function fetchHotelBookings(hotelId: string): Promise<Booking[]> {
  // Імітація затримки та повернення бронювань для конкретного готелю
  await new Promise(res => setTimeout(res, 250));

  // Демонстраційні зайняті періоди для різних готелів
  const demo: Record<string, Booking[]> = {
    '1': [
      {
        id: 'b-101',
        hotel: {
          id: '1',
          title: 'Затишний будиночок у Карпатах',
          imageUrl: '',
          location: 'Яремче',
          price: 1800,
        },
        user: { id: 'u1', name: 'Анна', email: 'anna@example.com' },
        checkIn: '2025-12-01',
        checkOut: '2025-12-03',
        guests: 2,
        status: 'confirmed',
        createdAt: '2025-10-05T12:00:00.000Z',
        specialRequests: '',
      },
      {
        id: 'b-102',
        hotel: {
          id: '1',
          title: 'Затишний будиночок у Карпатах',
          imageUrl: '',
          location: 'Яремче',
          price: 1800,
        },
        user: { id: 'u2', name: 'Ігор', email: 'igor@example.com' },
        checkIn: '2025-12-10',
        checkOut: '2025-12-12',
        guests: 3,
        status: 'confirmed',
        createdAt: '2025-10-06T12:00:00.000Z',
        specialRequests: '',
      },
    ],
    '2': [
      {
        id: 'b-201',
        hotel: {
          id: '2',
          title: 'Студія в центрі Києва (Люкс)',
          imageUrl: '',
          location: 'Київ',
          price: 3200,
        },
        user: { id: 'u3', name: 'Катерина', email: 'katya@example.com' },
        checkIn: '2025-11-20',
        checkOut: '2025-11-25',
        guests: 1,
        status: 'confirmed',
        createdAt: '2025-10-02T12:00:00.000Z',
        specialRequests: '',
      },
    ],
  };

  return demo[hotelId] || [];
}

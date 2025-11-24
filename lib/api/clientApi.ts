'use client';

import {
  CheckSession,
  Hotel,
  HotelsResponse,
  LoginCredentials,
  NewUser,
  SessionResponse,
  ClassificationAll,
  NewBooking,
  Booking,
  User,
  UserResponse,
  BookingsResponse,
  OwnListingsResponse,
  ResponseClassificationAll,
  HotelResponse,
  NewReview,
  Review,
  ResponseReview,
  BookingResponse,
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

export async function fetchHotels(
  q: string = '',
  page: number = 1,
  perPage: number = 10,
  guests: number = 2
): Promise<HotelsResponse> {
  const query = {
    ...(q && { q }),
    ...(page && { page: page.toString() }),
    ...(perPage && { perPage: perPage.toString() }),
    ...(guests && { guests: guests.toString() }),
  };

  try {
    const response = await nextClient.get<HotelsResponse>('/hotels', {
      params: query,
    });
    return response.data;
  } catch (error) {
    console.error('Error in fetchHotels:', error);
    throw error;
  }
}

export async function fetchHotelDetails(id: string): Promise<Hotel> {
  const response = await nextClient.get<HotelResponse>(`/hotels/${id}`);
  return response.data.data;
}

export async function fetchUserListings(): Promise<Hotel[]> {
  const response = await nextClient.get<OwnListingsResponse>(
    '/hotels/my/listings'
  );
  return response.data.data;
}

// --- AUTH MOCK ---
export async function loginUser(
  credentials: LoginCredentials
): Promise<SessionResponse> {
  const response = await nextClient.post<SessionResponse>(
    '/auth/login',
    credentials
  );
  return response.data;
}
export async function logoutUser(): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, 300));
}

// --- MUTATIONS ---
export async function postReview({
  hotelId,
  text,
  rating,
  cleanliness_score,
  location_score,
}: NewReview): Promise<Review> {
  const response = await nextClient.post<ResponseReview>(
    `/hotels/${hotelId}/reviews`,
    {
      text,
      rating,
      cleanliness_score,
      location_score,
    }
  );
  return response.data.data;
}

export async function createNewListing(formData: FormData) {
  const response = await nextClient.post('/hotels', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

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
  const response = await nextClient.post<CheckSession>('/auth/refresh');
  return response.data;
}

export async function getMe(): Promise<UserResponse> {
  const response = await nextClient.get<UserResponse>('/users/me');
  return response.data;
}

export async function registerUser(userData: NewUser) {
  const response = await nextClient.post('/auth/register', userData);
  return response.data;
}

export async function getAllClassificationTopHotels(): Promise<ClassificationAll> {
  const response = await nextClient.get<ResponseClassificationAll>(
    '/hotels/classification'
  );
  return response.data.data;
}

export async function createBooking(newBooking: NewBooking): Promise<Booking> {
  const response = await nextClient.post<BookingResponse>(
    '/bookings',
    newBooking
  );
  return response.data.data;
}

export async function fetchMyBookings(): Promise<Booking[]> {
  const response = await nextClient.get<BookingsResponse>(
    '/bookings/my-bookings'
  );
  return response.data.data;
}

// --- BOOKINGS BY HOTEL (MOCK) ---
export async function fetchHotelBookings(hotelId: string): Promise<Booking[]> {
  const response = await nextClient.get<BookingsResponse>(
    `/bookings/hotel/${hotelId}`
  );
  return response.data.data;
}

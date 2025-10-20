import {
  CheckSession,
  LoginCredentials,
  NewListing,
  NewUser,
  User,
} from '@/lib/types';
import { nextServer } from './api';
// В реальному проекті тут будуть імпорти axios

const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=`;
const API_KEY = '';

type GeminiPayload = {
  contents: { parts: { text: string }[] }[];
  systemInstruction: { parts: { text: string }[] };
};

const fetchGemini = async (payload: GeminiPayload) => {
  const response = await fetch(GEMINI_API_URL + API_KEY, {
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

// --- AUTH MOCK ---
export async function loginUser(credentials: LoginCredentials): Promise<User> {
  await new Promise(resolve => setTimeout(resolve, 300));
  return {
    id: 'user-123',
    email: credentials.email,
    name: 'AlexNovytskyi',
    photo: 'https://placehold.co/120x120/1f2937/ffffff?text=U',
  };
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
  // Тут в реальності має бути запит, який додає відгук до MongoDB
  await new Promise(resolve => setTimeout(resolve, 500));
  return { success: true };
}

export async function createNewListing(data: NewListing) {
  // В реальності: POST запит на /hotels/listings. host_id береться з Bearer Token
  console.log('[CLIENT API] Creating new listing:', data);
  await new Promise(resolve => setTimeout(resolve, 700));
  return { success: true, id: Math.floor(Math.random() * 100) };
}

// --- GEMINI ---
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
  const response = await nextServer.get<CheckSession>('/auth/session');
  return response.data.success;
}

export async function getMe() {
  const response = await nextServer.get<User>('/users/me');
  return response.data;
}

export async function registerUser(userData: NewUser) {
  const response = await nextServer.post<User>('/auth/register', userData);
  return response.data;
}

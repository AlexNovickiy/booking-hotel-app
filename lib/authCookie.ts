const COOKIE_NAME = 'authToken';
const MAX_AGE = 7 * 24 * 60 * 60; // 7 days

export function setAuthCookie(token: string) {
  const secure = window.location.protocol === 'https:' ? '; Secure' : '';
  document.cookie = `${COOKIE_NAME}=${token}; path=/; max-age=${MAX_AGE}; SameSite=Lax${secure}`;
}

export function clearAuthCookie() {
  document.cookie = `${COOKIE_NAME}=; path=/; max-age=0`;
}

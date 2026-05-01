'use client';

import { loginWithGoogle } from '@/lib/api/clientApi';
import { useAuthStore } from '@/lib/store/authStore';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import css from './GetOauthUrl.module.css';

export default function GetOauthUrl() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setUser = useAuthStore(state => state.setUser);
  const setToken = useAuthStore(state => state.setToken);

  useEffect(() => {
    const code = searchParams.get('code');

    if (!code) {
      router.replace('/login');
      return;
    }

    const sendCodeToBackend = async () => {
      try {
        const { data } = await loginWithGoogle({ code });
        if (data?.data?.accessToken) setToken(data.data.accessToken);
        setUser(data.data.user);
        router.push('/');
      } catch (error) {
        console.error('Помилка авторизації через Google:', error);
        router.replace('/login');
      }
    };

    sendCodeToBackend();
  }, [router, searchParams, setUser, setToken]);

  return (
    <div className={css.overlay}>
      <div className={css.loaderBox}>
        <span className={css.spinner}></span>
        <p className={css.text}>Виконується вхід через Google...</p>
      </div>
    </div>
  );
}

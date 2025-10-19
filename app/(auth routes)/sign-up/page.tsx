'use client';
import { useState } from 'react';
import css from './SignUpPage.module.css';
import { NewUser } from '@/types/user';
import { useRouter } from 'next/navigation';
import { registerUser } from '@/lib/api/clientApi';
import { useAuthStore } from '@/lib/store/authStore';
export default function SignUpPage() {
  const router = useRouter();
  const [isError, setIsError] = useState('');
  const setUser = useAuthStore(state => state.setUser);

  const handleSubmit = async (formData: FormData) => {
    try {
      const newUser = Object.fromEntries(formData) as NewUser;
      const user = await registerUser(newUser);
      setUser(user);
      router.push('/profile');
    } catch (error) {
      setIsError(
        typeof error === 'object' && error !== null && 'message' in error
          ? ((error as { message?: string }).message ?? 'Oops... some error')
          : 'Oops... some error'
      );
    }
  };

  return (
    <div className={css.mainContent}>
      <h1 className={css.formTitle}>Sign up</h1>
      <form action={handleSubmit} className={css.form}>
        <div className={css.formGroup}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            name="email"
            className={css.input}
            required
          />
        </div>

        <div className={css.formGroup}>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            name="password"
            className={css.input}
            required
          />
        </div>

        <div className={css.actions}>
          <button type="submit" className={css.submitButton}>
            Register
          </button>
        </div>

        {isError && <p className={css.error}>{isError}</p>}
      </form>
    </div>
  );
}

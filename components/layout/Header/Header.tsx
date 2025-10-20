'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import css from './Header.module.css';
import { useAuthStore } from '@/lib/store/authStore';
import Icon from '@/components/ui/Icon';
import { logoutUser } from '@/lib/api/clientApi';

export default function Header() {
  const { isAuthenticated, user, clearIsAuthenticated } = useAuthStore();
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await logoutUser();
    clearIsAuthenticated();
    router.push('/');
  };

  const isActive = (path: string) =>
    pathname === path ? css.navLinkActive : '';

  return (
    <header className={css.header}>
      <div className={css.headerContent}>
        <Link href="/" className={css.headerTitle}>
          HotelBooking
        </Link>
        <nav className={css.navigation}>
          <Link href="/" className={`${css.navLink} ${isActive('/')}`}>
            Головна
          </Link>

          {isAuthenticated ? (
            <>
              <Link href="/host/add-listing" className={css.navLink}>
                <Icon name="plus" className={css.icon} /> Здати житло
              </Link>
              <Link href="/profile" className={css.navButtonProfile}>
                <Icon name="user" className={css.icon} />{' '}
                {user?.name || 'Профіль'}
              </Link>
              <button onClick={handleLogout} className={css.navButtonLogout}>
                Вихід
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className={css.navButtonLogin}>
                Вхід
              </Link>
              <Link href="/register" className={css.navButtonRegister}>
                Реєстрація
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

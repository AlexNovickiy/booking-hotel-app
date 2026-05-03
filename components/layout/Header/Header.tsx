'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import css from './Header.module.css';
import { useAuthStore } from '@/lib/store/authStore';
import Icon from '@/components/ui/Icon';
import { logoutUser } from '@/lib/api/clientApi';

export default function Header() {
  const { isAuthenticated, user, clearAuth } = useAuthStore();
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logoutUser();
    clearAuth();
    setMenuOpen(false);
    router.push('/');
  };

  const isActive = (path: string) =>
    pathname === path ? css.navLinkActive : '';

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className={css.header}>
      <div className={css.headerContent}>
        <Link href="/" className={css.headerTitle} onClick={closeMenu}>
          HotelBooking
        </Link>

        <button
          className={`${css.burger} ${menuOpen ? css.burgerOpen : ''}`}
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label="Меню"
          aria-expanded={menuOpen}
        >
          <span className={css.burgerLine} />
          <span className={css.burgerLine} />
          <span className={css.burgerLine} />
        </button>

        <nav className={`${css.navigation} ${menuOpen ? css.navigationOpen : ''}`}>
          <Link
            href="/"
            className={`${css.navLink} ${isActive('/')}`}
            onClick={closeMenu}
          >
            Головна
          </Link>

          {isAuthenticated ? (
            <>
              <Link
                href="/host/add-listing"
                className={css.navLink}
                onClick={closeMenu}
              >
                <Icon name="plus" className={css.icon} /> Здати житло
              </Link>
              <Link
                href="/profile"
                className={css.navButtonProfile}
                onClick={closeMenu}
              >
                <Icon name="user" className={css.icon} />{' '}
                {user?.name || 'Профіль'}
              </Link>
              <button onClick={handleLogout} className={css.navButtonLogout}>
                Вихід
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className={css.navButtonLogin} onClick={closeMenu}>
                Вхід
              </Link>
              <Link href="/register" className={css.navButtonRegister} onClick={closeMenu}>
                Реєстрація
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

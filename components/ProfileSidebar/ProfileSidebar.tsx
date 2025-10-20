import Image from 'next/image';
import css from './Sidebar.module.css';
import type { User } from '@/lib/types';

type ProfileSection =
  | 'my-listings'
  | 'bookings'
  | 'settings'
  | 'classification'; // Add new section

type SidebarProps = {
  user: User;
  activeSection: string;
  setActiveSection: (section: ProfileSection) => void;
};

export default function Sidebar({
  user,
  activeSection,
  setActiveSection,
}: SidebarProps) {
  const getLinkClass = (section: string) => {
    return `${css.navLink} ${activeSection === section ? css.navLinkActive : ''}`;
  };

  return (
    <aside className={css.sidebar}>
      <div className={css.sidebarHeader}>
        <Image
          src={user.photo}
          alt="User avatar"
          width={60}
          height={60}
          className={css.avatar}
        />
        <div>
          <h2 className={css.userName}>{user.name}</h2>
          <p className={css.userEmail}>{user.email}</p>
        </div>
      </div>
      <nav>
        <button
          onClick={() => setActiveSection('my-listings')}
          className={getLinkClass('my-listings')}
        >
          Мої оголошення
        </button>
        <button
          onClick={() => setActiveSection('bookings')}
          className={getLinkClass('bookings')}
        >
          Мої бронювання
        </button>
        <button
          onClick={() => setActiveSection('classification')} // Add new button
          className={getLinkClass('classification')}
        >
          Аналіз відгуків
        </button>
        <button
          onClick={() => setActiveSection('settings')}
          className={getLinkClass('settings')}
        >
          Налаштування
        </button>
      </nav>
    </aside>
  );
}

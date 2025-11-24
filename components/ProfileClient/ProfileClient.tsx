'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getMe } from '@/lib/api/clientApi';
import Sidebar from '@/components/ProfileSidebar/ProfileSidebar';
import MyListings from '@/components/MyListings/MyListings';
import css from './ProfileClient.module.css';
import Loader from '@/components/Loader/Loader';
import ErrorMessage from '@/components/ErrorMessage/ErrorMessage';
import Classification from '@/components/Classification/Classification';
import MyBookings from '@/components/MyBookings/MyBookings';
import { useProfileTabStore } from '@/lib/store/profileTabStore';

type ProfileSection =
  | 'my-listings'
  | 'bookings'
  | 'settings'
  | 'classification';

export default function ProfileClient() {
  const { activeTab, setActiveTab } = useProfileTabStore();
  const [activeSection, setActiveSection] = useState<ProfileSection>(
    (activeTab as ProfileSection) || 'my-listings'
  );

  const {
    data: user,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['user'],
    queryFn: getMe,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  useEffect(() => {
    setActiveTab(activeSection);
  }, [activeSection, setActiveTab]);

  if (isLoading) return <Loader />;
  if (isError || !user) return <ErrorMessage />;

  const renderSection = () => {
    switch (activeSection) {
      case 'my-listings':
        return <MyListings />;
      case 'bookings':
        return <MyBookings />;
      case 'settings':
        return <div>Налаштування (в розробці)</div>;
      case 'classification':
        return <Classification />;
      default:
        return <MyListings />;
    }
  };

  return (
    <div className={css.profileGrid}>
      <Sidebar
        user={user.data}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />
      <div className={css.profileContent}>{renderSection()}</div>
    </div>
  );
}

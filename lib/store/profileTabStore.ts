import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type profileTabStore = {
  activeTab: string;
  setActiveTab: (tab: string) => void;
};

export const useProfileTabStore = create<profileTabStore>()(
  persist(
    set => {
      return {
        activeTab: 'my-listings',
        setActiveTab: (tab: string) => set({ activeTab: tab }),
      };
    },
    {
      name: 'profile-tab-store',
      partialize: state => ({
        activeTab: state.activeTab,
      }),
    }
  )
);

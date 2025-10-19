import { CreateNote } from '@/types/note';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const initialDraft: CreateNote = {
  title: '',
  content: '',
  tag: 'Todo',
};

type NoteStore = {
  draft: CreateNote;
  setDraft: (newDraft: CreateNote) => void;
  clearDraft: () => void;
};

export const useNoteStore = create<NoteStore>()(
  persist(
    set => {
      return {
        draft: initialDraft,
        setDraft: (newDraft: CreateNote) => set({ draft: newDraft }),
        clearDraft: () => set({ draft: initialDraft }),
      };
    },
    {
      name: 'note-draft',
      partialize: state => ({ draft: state.draft }),
    }
  )
);

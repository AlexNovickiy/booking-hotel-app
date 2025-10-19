import { Metadata } from 'next';
import css from './CreateNote.module.css';
import NoteForm from '@/components/NoteForm/NoteForm';

export const metadata: Metadata = {
  title: 'Create Note',
  description: 'Create a new note',
  openGraph: {
    title: 'Create Note',
    description: 'Create a new note',
    url: 'https://08-zustand-eight-virid.vercel.app/notes/action/create',
    images: [
      {
        url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
        width: 1200,
        height: 630,
        alt: 'NoteHub - A platform for note-taking and organization',
      },
    ],
  },
};

export default function CreateNotePage() {
  return (
    <div className={css.main}>
      <div className={css.container}>
        <h1 className={css.title}>Create note</h1>
        <NoteForm />
      </div>
    </div>
  );
}

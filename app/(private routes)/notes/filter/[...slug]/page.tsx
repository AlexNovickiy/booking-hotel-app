import { fetchNotes } from '@/lib/api/serverApi';
import NotesClient from './Notes.client';
import { Metadata } from 'next';

type NotesPageProps = {
  params: Promise<{ slug: string[] }>;
};

export async function generateMetadata({
  params,
}: NotesPageProps): Promise<Metadata> {
  const { slug } = await params;
  const tag = slug[0] === 'All' ? undefined : slug[0];
  return {
    title: `Notes - ${tag || 'All'}`,
    description: `Browse notes${tag ? ` tagged with "${tag}"` : ''}.`,
    openGraph: {
      title: `Notes - ${tag || 'All'}`,
      description: `Browse notes${tag ? ` tagged with "${tag}"` : ''}.`,
      url: `https://08-zustand-eight-virid.vercel.app/${slug.join('/')}`,
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
}

export default async function NotesPage({ params }: NotesPageProps) {
  const { slug } = await params;
  const tag = slug[0] === 'All' ? undefined : slug[0];
  const initialData = await fetchNotes('', 1, tag);

  return <NotesClient initialData={initialData} tag={tag} />;
}

import { fetchNoteById } from '@/lib/api/serverApi';
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from '@tanstack/react-query';
import NotesDetailsClient from './NoteDetails.client';
import { Metadata } from 'next';

type NoteDetailsProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({
  params,
}: NoteDetailsProps): Promise<Metadata> {
  const { id } = await params;
  const note = await fetchNoteById(id);
  return {
    title: `Note - ${note.title}`,
    description: `Browse note tagged with ${note.tag}`,
    openGraph: {
      title: `Notes - ${note.title}`,
      description: `Browse note tagged with ${note.tag}`,
      url: `https://08-zustand-eight-virid.vercel.app/notes/${id}`,
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

export default async function NoteDetails({ params }: NoteDetailsProps) {
  const { id } = await params;
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['note', id],
    queryFn: () => fetchNoteById(id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesDetailsClient />
    </HydrationBoundary>
  );
}

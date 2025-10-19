import { fetchNoteById } from '@/lib/api/serverApi';
import NotePreviewClient from './NotePreview.client';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';

type NoteDetailsModalProps = {
  params: Promise<{ id: string }>;
};

export default async function NoteDetailsModal({
  params,
}: NoteDetailsModalProps) {
  const { id } = await params;

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['note', id],
    queryFn: () => fetchNoteById(id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotePreviewClient />
    </HydrationBoundary>
  );
}

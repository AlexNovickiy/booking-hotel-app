'use client';

import Modal from '@/components/Modal/Modal';
import css from '@/components/Modal/Modal.module.css';
import { useParams, useRouter } from 'next/navigation';
import { useCallback } from 'react';
import React from 'react';
import type { Params } from '@/app/(private routes)/notes/[id]/NoteDetails.client';
import { useQuery } from '@tanstack/react-query';
import { fetchNoteById } from '@/lib/api/clientApi';

const MemoModal = React.memo(Modal);

export default function NotePreviewClient() {
  const { id }: Params = useParams();
  const router = useRouter();

  const {
    data: note,
    isFetching,
    error,
  } = useQuery({
    queryKey: ['note', id],
    queryFn: () => fetchNoteById(id),
    refetchOnMount: false,
  });

  const handleCloseModal = useCallback(() => {
    router.back();
  }, [router]);

  return (
    <>
      {isFetching && <p>Loading, please wait...</p>}
      {(error || !note) && <p>Something went wrong.</p>}
      {note && (
        <MemoModal onClose={handleCloseModal}>
          <>
            <h2 className={css.title}>Note Details</h2>
            <p className={css.content}>ID: {note.id}</p>
            <p className={css.content}>Title: {note.title}</p>
            <p className={css.content}>Content: {note.content}</p>
            <p className={css.content}>Tag: {note.tag}</p>
            {note.createdAt ? (
              <p className={css.content}>
                Created At: {new Date(note.createdAt).toLocaleString()}
              </p>
            ) : (
              <p className={css.content}>
                Updated At: {new Date(note.updatedAt ?? '').toLocaleString()}
              </p>
            )}
          </>
        </MemoModal>
      )}
    </>
  );
}

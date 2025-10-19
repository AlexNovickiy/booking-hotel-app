'use client';

import type { ErrorProps } from '@/app/(private routes)/notes/error';

export default function Error({ error }: ErrorProps) {
  return <p>Could not fetch note details. {error.message}</p>;
}

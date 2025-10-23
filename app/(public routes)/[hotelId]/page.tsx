import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from '@tanstack/react-query';
import { prefetchHotelDetails } from '@/lib/api/serverApi';
import { fetchHotelDetails } from '@/lib/api/clientApi';
import DetailPageClient from '@/components/hotel/DetailPage.client';
import { Metadata } from 'next';

type DetailPageProps = {
  params: Promise<{ hotelId: string }>;
};

// SERVER COMPONENT: Metadata Generation (SEO)
export async function generateMetadata({
  params,
}: DetailPageProps): Promise<Metadata> {
  const { hotelId } = await params;
  const hotel = await fetchHotelDetails(hotelId);
  return {
    title: hotel.title,
    description: hotel.description.substring(0, 150) + '...',
    openGraph: {
      title: hotel.title,
      description: hotel.description.substring(0, 150) + '...',
      url: `http://localhost:3000/hotels/${hotelId}`,
      images: [
        {
          url: hotel.imageUrl,
          width: 1200,
          height: 630,
          alt: hotel.title,
        },
      ],
    },
  };
}

// SERVER COMPONENT: Data Prefetching
export default async function DetailPage({ params }: DetailPageProps) {
  const { hotelId } = await params;
  const queryClient = new QueryClient();

  await prefetchHotelDetails(queryClient, hotelId);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <DetailPageClient hotelId={hotelId} />
    </HydrationBoundary>
  );
}

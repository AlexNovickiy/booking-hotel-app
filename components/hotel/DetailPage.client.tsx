import { fetchHotelDetails } from '@/lib/api/serverApi';
import { useQuery } from '@tanstack/react-query';

type DetailPageClientProps = {
  hotelId: string;
};

export default function DetailPageClient({ hotelId }: DetailPageClientProps) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['hotelDetails', hotelId],
    queryFn: () => fetchHotelDetails(hotelId),
  });

  if (isLoading) return <p>Завантаження деталей готелю...</p>;
  if (isError) return <p>Помилка завантаження деталей готелю.</p>;

  return (
    <div>
      <h2>Hotel Details</h2>
      {/* Render the hotel details here */}
    </div>
  );
}

'use client';

import { useState } from 'react';
import {
  analyzeReviewsWithGemini,
  postReview,
  createBooking,
} from '@/lib/api/clientApi';
import { fetchHotelDetails } from '@/lib/api/clientApi';
import { useQuery, useMutation } from '@tanstack/react-query';
import Image from 'next/image';
import Loader from '@/components/Loader/Loader';
import ErrorMessage from '@/components/ErrorMessage/ErrorMessage';
import BookingForm from './BookingForm';
import ReviewForm from './ReviewForm';
import { BookingFormData, NewReview } from '@/lib/types';
import css from './DetailPage.client.module.css';
import Icon from '../ui/Icon';
import { useAuthStore } from '@/lib/store/authStore';
import { useRouter } from 'next/navigation';

type DetailPageClientProps = {
  hotelId: string;
};

export default function DetailPageClient({ hotelId }: DetailPageClientProps) {
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const router = useRouter();

  const {
    data: hotel,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['hotelDetails', hotelId],
    queryFn: () => fetchHotelDetails(hotelId),
    refetchOnMount: false,
  });

  const {
    mutate: analyzeReviews,
    data: analysisResult,
    isPending: isAnalyzing,
    error: analysisError,
  } = useMutation({
    mutationFn: () => {
      if (!hotel?.reviews) throw new Error('No reviews available');
      const reviewTexts = hotel.reviews.map(review => review.text);
      return analyzeReviewsWithGemini(reviewTexts);
    },
  });

  const {
    mutate: submitReview,
    isPending: isSubmittingReview,
    error: reviewError,
  } = useMutation({
    mutationFn: (reviewData: { text: string; rating: number }) => {
      return postReview(parseInt(hotelId), reviewData);
    },
    onSuccess: () => {
      setShowReviewForm(false);
      // Invalidate and refetch hotel details to show new review
      // This would typically be handled by the query invalidation
      alert('Відгук успішно додано!');
    },
  });

  const {
    mutate: submitBooking,
    isPending: isSubmittingBooking,
    isSuccess: bookingCreated,
  } = useMutation({
    mutationFn: createBooking,
  });

  const handleBookingSubmit = (formData: BookingFormData) => {
    submitBooking({
      ...formData,
      hotelId,
    });
  };

  const handleAnalyzeReviews = () => {
    analyzeReviews();
    setShowAnalysis(true);
  };

  const handleReviewSubmit = (reviewData: NewReview) => {
    submitReview(reviewData);
  };

  const handleReviewCancel = () => {
    setShowReviewForm(false);
  };

  const handleBookClick = () => {
    if (isAuthenticated) {
      setIsBookingModalOpen(true);
    } else {
      router.push('/login');
    }
  };

  if (isLoading) return <Loader />;
  if (isError || !hotel) return <ErrorMessage />;

  return (
    <div className={css.container}>
      <h1 className={css.title}>{hotel.title}</h1>
      <div className={css.meta}>
        <div className={css.rating}>
          <Icon name="star" className={css.starIcon} />
          <span>{hotel.ratings_summary.average_rating.toFixed(1)}</span>
          <span className={css.reviewsCount}>
            ({hotel.ratings_summary.total_reviews} відгуків)
          </span>
        </div>
        <div className={css.location}>
          <Icon name="map" className={css.mapIcon} />
          <span>{hotel.location}</span>
        </div>
      </div>

      <div className={css.gallery}>
        <Image
          src={hotel.imageUrl}
          alt={hotel.title}
          width={1200}
          height={600}
          className={css.mainImage}
          priority
        />
      </div>

      <div className={css.detailsGrid}>
        <div className={css.description}>
          <h2>Про помешкання</h2>
          <p>{hotel.description}</p>
        </div>
        <div className={css.bookingBox}>
          <div className={css.price}>
            <span className={css.priceValue}>
              {hotel.price.toLocaleString()} грн
            </span>
            / ніч
          </div>
          <button className={css.bookButton} onClick={handleBookClick}>
            Забронювати
          </button>
        </div>
      </div>

      <div className={css.reviewsSection}>
        <div className={css.reviewsHeader}>
          <h2>Відгуки</h2>
          {isAuthenticated && (
            <div className={css.reviewsActions}>
              <button
                className={css.addReviewButton}
                onClick={() => setShowReviewForm(true)}
              >
                <Icon name="plus" className={css.addIcon} />
                Залишити відгук
              </button>
              {hotel.reviews.length > 0 && (
                <button
                  className={css.analyzeButton}
                  onClick={handleAnalyzeReviews}
                  disabled={isAnalyzing}
                >
                  {isAnalyzing ? (
                    <>
                      <Icon name="star" className={css.loadingIcon} />
                      Аналізуємо...
                    </>
                  ) : (
                    <>
                      <Icon name="star" className={css.analyzeIcon} />
                      Проаналізувати відгуки
                    </>
                  )}
                </button>
              )}
            </div>
          )}
        </div>

        {showAnalysis && analysisResult && (
          <div className={css.analysisSection}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <h3>🤖 Аналіз відгуків</h3>
              <button
                className={css.closeButton}
                onClick={() => setShowAnalysis(false)}
              >
                <Icon name="plus" className={css.closeIcon} />
              </button>
            </div>
            <div className={css.analysisContent}>
              {analysisResult.split('\n').map((line, index) => (
                <p key={index} className={css.analysisLine}>
                  {line}
                </p>
              ))}
            </div>
          </div>
        )}

        {analysisError && (
          <div className={css.errorMessage}>
            Помилка при аналізі відгуків: {analysisError.message}
          </div>
        )}

        {reviewError && (
          <div className={css.errorMessage}>
            Помилка при додаванні відгуку: {reviewError.message}
          </div>
        )}

        {showReviewForm && (
          <ReviewForm
            hotelId={hotelId}
            onSubmit={handleReviewSubmit}
            onCancel={handleReviewCancel}
            isSubmitting={isSubmittingReview}
          />
        )}

        {hotel.reviews.length > 0 ? (
          hotel.reviews.map(review => (
            <div key={review.user.id} className={css.reviewCard}>
              <div className={css.reviewHeader}>
                <Image
                  src={review.user.photo}
                  alt={review.user.name}
                  width={40}
                  height={40}
                  className={css.reviewAvatar}
                />
                <div>
                  <p className={css.reviewAuthor}>{review.user.name}</p>
                  <p className={css.reviewDate}>{review.date}</p>
                </div>
              </div>
              <p className={css.reviewText}>{review.text}</p>
            </div>
          ))
        ) : (
          <p>Відгуків ще немає.</p>
        )}
      </div>

      <BookingForm
        hotelId={hotelId}
        hotelTitle={hotel.title}
        price={hotel.price}
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        onSubmit={handleBookingSubmit}
        isSubmittingBooking={isSubmittingBooking}
        bookingCreated={bookingCreated}
      />
    </div>
  );
}

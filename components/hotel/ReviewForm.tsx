'use client';

import { useState } from 'react';
import css from './ReviewForm.module.css';
import Icon from '../ui/Icon';

type ReviewFormProps = {
  hotelId: string;
  onSubmit: (reviewData: { text: string; rating: number }) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
};

export default function ReviewForm({
  hotelId,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [text, setText] = useState('');
  const [errors, setErrors] = useState<{ rating?: string; text?: string }>({});

  const handleRatingClick = (selectedRating: number) => {
    setRating(selectedRating);
    if (errors.rating) {
      setErrors(prev => ({ ...prev, rating: undefined }));
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    if (errors.text) {
      setErrors(prev => ({ ...prev, text: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: { rating?: string; text?: string } = {};

    if (rating === 0) {
      newErrors.rating = 'Оберіть рейтинг';
    }

    if (!text.trim()) {
      newErrors.text = 'Введіть текст відгуку';
    } else if (text.trim().length < 10) {
      newErrors.text = 'Відгук повинен містити мінімум 10 символів';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      onSubmit({ text: text.trim(), rating });
    }
  };

  const renderStars = () => {
    return [1, 2, 3, 4, 5].map(star => (
      <button
        key={star}
        type="button"
        className={`${css.starButton} ${
          star <= rating ? css.starActive : css.starInactive
        }`}
        onClick={() => handleRatingClick(star)}
        disabled={isSubmitting}
      >
        <Icon name="star" className={css.starIcon} />
      </button>
    ));
  };

  const getRatingText = () => {
    switch (rating) {
      case 1:
        return 'Дуже погано';
      case 2:
        return 'Погано';
      case 3:
        return 'Нормально';
      case 4:
        return 'Добре';
      case 5:
        return 'Відмінно';
      default:
        return 'Оберіть рейтинг';
    }
  };

  return (
    <div className={css.reviewForm}>
      <div className={css.header}>
        <h3>Залишити відгук</h3>
        <button
          type="button"
          className={css.closeButton}
          onClick={onCancel}
          disabled={isSubmitting}
        >
          <Icon name="plus" className={css.closeIcon} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className={css.form}>
        <div className={css.ratingSection}>
          <label className={css.label}>Ваша оцінка *</label>
          <div className={css.starsContainer}>{renderStars()}</div>
          <p className={css.ratingText}>{getRatingText()}</p>
          {errors.rating && (
            <span className={css.errorText}>{errors.rating}</span>
          )}
        </div>

        <div className={css.textSection}>
          <label htmlFor="reviewText" className={css.label}>
            Ваш відгук *
          </label>
          <textarea
            id="reviewText"
            value={text}
            onChange={handleTextChange}
            className={`${css.textarea} ${errors.text ? css.error : ''}`}
            placeholder="Розкажіть про ваш досвід проживання..."
            rows={4}
            disabled={isSubmitting}
          />
          <div className={css.charCount}>{text.length}/500 символів</div>
          {errors.text && <span className={css.errorText}>{errors.text}</span>}
        </div>

        <div className={css.buttons}>
          <button
            type="button"
            className={css.cancelButton}
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Скасувати
          </button>
          <button
            type="submit"
            className={css.submitButton}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Icon name="star" className={css.loadingIcon} />
                Відправляємо...
              </>
            ) : (
              'Опублікувати відгук'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { BookingFormData } from '@/lib/types';
import css from './BookingForm.module.css';
import Icon from '../ui/Icon';

type BookingFormProps = {
  hotelTitle: string;
  price: number;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: BookingFormData) => void;
};

export default function BookingForm({
  hotelTitle,
  price,
  isOpen,
  onClose,
  onSubmit,
}: BookingFormProps) {
  const [formData, setFormData] = useState<BookingFormData>({
    checkIn: '',
    checkOut: '',
    guests: 1,
    name: '',
    email: '',
    phone: '',
    specialRequests: '',
  });

  const [errors, setErrors] = useState<Partial<BookingFormData>>({});

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'guests' ? parseInt(value) || 1 : value,
    }));

    // Clear error when user starts typing
    if (errors[name as keyof BookingFormData]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<BookingFormData> = {};

    if (!formData.checkIn) newErrors.checkIn = 'Оберіть дату заїзду';
    if (!formData.checkOut) newErrors.checkOut = 'Оберіть дату виїзду';
    if (!formData.name.trim()) newErrors.name = "Введіть ваше ім'я";
    if (!formData.email.trim()) newErrors.email = 'Введіть email';
    if (!formData.phone.trim()) newErrors.phone = 'Введіть номер телефону';

    // Email validation
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Введіть коректний email';
    }

    // Phone validation (basic)
    if (formData.phone && !/^[\+]?[0-9\s\-\(\)]{10,}$/.test(formData.phone)) {
      newErrors.phone = 'Введіть коректний номер телефону';
    }

    // Date validation
    if (formData.checkIn && formData.checkOut) {
      const checkInDate = new Date(formData.checkIn);
      const checkOutDate = new Date(formData.checkOut);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (checkInDate < today) {
        newErrors.checkIn = 'Дата заїзду не може бути в минулому';
      }
      if (checkOutDate <= checkInDate) {
        newErrors.checkOut = 'Дата виїзду повинна бути після дати заїзду';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      onSubmit(formData);
      // Reset form
      setFormData({
        checkIn: '',
        checkOut: '',
        guests: 1,
        name: '',
        email: '',
        phone: '',
        specialRequests: '',
      });
      onClose();
    }
  };

  const calculateTotalPrice = () => {
    if (!formData.checkIn || !formData.checkOut) return 0;

    const checkInDate = new Date(formData.checkIn);
    const checkOutDate = new Date(formData.checkOut);
    const nights = Math.ceil(
      (checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    return nights * price;
  };

  if (!isOpen) return null;

  return (
    <div className={css.overlay} onClick={onClose}>
      <div className={css.modal} onClick={e => e.stopPropagation()}>
        <div className={css.header}>
          <h2>Бронювання</h2>
          <button className={css.closeButton} onClick={onClose}>
            <Icon name="plus" className={css.closeIcon} />
          </button>
        </div>

        <div className={css.hotelInfo}>
          <h3>{hotelTitle}</h3>
          <p className={css.pricePerNight}>
            {price.toLocaleString()} грн / ніч
          </p>
        </div>

        <form onSubmit={handleSubmit} className={css.form}>
          <div className={css.dateSection}>
            <div className={css.dateGroup}>
              <label htmlFor="checkIn" className={css.label}>
                Дата заїзду
              </label>
              <input
                type="date"
                id="checkIn"
                name="checkIn"
                value={formData.checkIn}
                onChange={handleInputChange}
                className={`${css.input} ${errors.checkIn ? css.error : ''}`}
                min={new Date().toISOString().split('T')[0]}
              />
              {errors.checkIn && (
                <span className={css.errorText}>{errors.checkIn}</span>
              )}
            </div>

            <div className={css.dateGroup}>
              <label htmlFor="checkOut" className={css.label}>
                Дата виїзду
              </label>
              <input
                type="date"
                id="checkOut"
                name="checkOut"
                value={formData.checkOut}
                onChange={handleInputChange}
                className={`${css.input} ${errors.checkOut ? css.error : ''}`}
                min={formData.checkIn || new Date().toISOString().split('T')[0]}
              />
              {errors.checkOut && (
                <span className={css.errorText}>{errors.checkOut}</span>
              )}
            </div>
          </div>

          <div className={css.guestsGroup}>
            <label htmlFor="guests" className={css.label}>
              Кількість гостей
            </label>
            <select
              id="guests"
              name="guests"
              value={formData.guests}
              onChange={handleInputChange}
              className={css.select}
            >
              {[1, 2, 3, 4, 5, 6].map(num => (
                <option key={num} value={num}>
                  {num} {num === 1 ? 'гость' : num < 5 ? 'гості' : 'гостей'}
                </option>
              ))}
            </select>
          </div>

          <div className={css.personalInfo}>
            <h4>Контактна інформація</h4>

            <div className={css.inputGroup}>
              <label htmlFor="name" className={css.label}>
                Повне ім&apos;я *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`${css.input} ${errors.name ? css.error : ''}`}
                placeholder="Введіть ваше повне ім'я"
              />
              {errors.name && (
                <span className={css.errorText}>{errors.name}</span>
              )}
            </div>

            <div className={css.inputGroup}>
              <label htmlFor="email" className={css.label}>
                Email *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`${css.input} ${errors.email ? css.error : ''}`}
                placeholder="your@email.com"
              />
              {errors.email && (
                <span className={css.errorText}>{errors.email}</span>
              )}
            </div>

            <div className={css.inputGroup}>
              <label htmlFor="phone" className={css.label}>
                Телефон *
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className={`${css.input} ${errors.phone ? css.error : ''}`}
                placeholder="+380 XX XXX XX XX"
              />
              {errors.phone && (
                <span className={css.errorText}>{errors.phone}</span>
              )}
            </div>

            <div className={css.inputGroup}>
              <label htmlFor="specialRequests" className={css.label}>
                Особливі побажання
              </label>
              <textarea
                id="specialRequests"
                name="specialRequests"
                value={formData.specialRequests}
                onChange={handleInputChange}
                className={css.textarea}
                placeholder="Додаткові побажання до бронювання..."
                rows={3}
              />
            </div>
          </div>

          <div className={css.totalSection}>
            <div className={css.totalInfo}>
              <div className={css.totalLine}>
                <span>Ціна за ніч:</span>
                <span>{price.toLocaleString()} грн</span>
              </div>
              {formData.checkIn && formData.checkOut && (
                <>
                  <div className={css.totalLine}>
                    <span>Кількість ночей:</span>
                    <span>
                      {Math.ceil(
                        (new Date(formData.checkOut).getTime() -
                          new Date(formData.checkIn).getTime()) /
                          (1000 * 60 * 60 * 24)
                      )}
                    </span>
                  </div>
                  <div className={css.totalLine}>
                    <span>Гостей:</span>
                    <span>{formData.guests}</span>
                  </div>
                  <div className={css.totalLineTotal}>
                    <span>Загальна сума:</span>
                    <span className={css.totalPrice}>
                      {calculateTotalPrice().toLocaleString()} грн
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className={css.buttons}>
            <button
              type="button"
              className={css.cancelButton}
              onClick={onClose}
            >
              Скасувати
            </button>
            <button type="submit" className={css.submitButton}>
              Підтвердити бронювання
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

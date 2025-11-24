'use client';

import { useState, useEffect } from 'react';
import { Booking, BookingFormData } from '@/lib/types';
import css from './BookingForm.module.css';
import Icon from '../ui/Icon';
import { fetchHotelBookings } from '@/lib/api/clientApi';
import { toast } from 'react-hot-toast';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { uk } from 'date-fns/locale';

type BookingFormProps = {
  hotelId: string;
  hotelTitle: string;
  maxGuests: number;
  price: number;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: BookingFormData) => void;
};

export default function BookingForm({
  hotelId,
  hotelTitle,
  price,
  maxGuests,
  isOpen,
  onClose,
  onSubmit,
  isSubmittingBooking,
  bookingCreated,
}: BookingFormProps & {
  isSubmittingBooking: boolean;
  bookingCreated: boolean;
}) {
  const [checkInDate, setCheckInDate] = useState<Date | null>(null);
  const [checkOutDate, setCheckOutDate] = useState<Date | null>(null);
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
  const [existingBookings, setExistingBookings] = useState<Booking[]>([]);
  const [isLoadingBookings, setIsLoadingBookings] = useState(false);
  const [bookingsError, setBookingsError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    let cancelled = false;
    document.body.style.overflow = 'hidden';
    setIsLoadingBookings(true);
    setBookingsError(null);
    fetchHotelBookings(hotelId)
      .then(b => {
        if (!cancelled) setExistingBookings(b);
      })
      .catch(() => {
        if (!cancelled) {
          setBookingsError('Не вдалося завантажити зайняті дати');
          toast.error('Не вдалося завантажити зайняті дати');
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoadingBookings(false);
      });
    return () => {
      cancelled = true;
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, hotelId]);

  useEffect(() => {
    if (bookingCreated) {
      onClose();
      toast.success('Бронювання успішно створено!');
    }
  }, [bookingCreated, onClose]);

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

  // Формируем список заблокированных дат на основе existingBookings
  const getDisabledDates = () => {
    const disabled: Date[] = [];
    existingBookings.forEach(booking => {
      const start = new Date(booking.checkIn);
      const end = new Date(booking.checkOut);
      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        disabled.push(new Date(d));
      }
    });
    return disabled;
  };

  const disabledDates = getDisabledDates();

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

      // Overlap with existing bookings
      const overlaps = existingBookings.some(b => {
        const bStart = new Date(b.checkIn);
        const bEnd = new Date(b.checkOut);
        return checkInDate < bEnd && bStart < checkOutDate;
      });
      if (overlaps) {
        newErrors.checkIn = 'Вибрані дати недоступні';
        newErrors.checkOut = 'Вибрані дати недоступні';
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
              <DatePicker
                selected={checkInDate}
                onChange={date => {
                  setCheckInDate(date);
                  setFormData(prev => ({
                    ...prev,
                    checkIn: date ? date.toISOString().split('T')[0] : '',
                  }));
                }}
                selectsStart
                startDate={checkInDate}
                endDate={checkOutDate}
                minDate={new Date()}
                excludeDates={disabledDates}
                locale={uk}
                dateFormat="dd.MM.yyyy"
                placeholderText="Оберіть дату заїзду"
                className={`${css.input} ${errors.checkIn ? css.error : ''}`}
                disabled={isSubmittingBooking || isLoadingBookings}
                calendarClassName={css.customCalendar}
              />
              {errors.checkIn && (
                <span className={css.errorText}>{errors.checkIn}</span>
              )}
            </div>

            <div className={css.dateGroup}>
              <label htmlFor="checkOut" className={css.label}>
                Дата виїзду
              </label>
              <DatePicker
                selected={checkOutDate}
                onChange={date => {
                  setCheckOutDate(date);
                  setFormData(prev => ({
                    ...prev,
                    checkOut: date ? date.toISOString().split('T')[0] : '',
                  }));
                }}
                selectsEnd
                startDate={checkInDate}
                endDate={checkOutDate}
                minDate={checkInDate || new Date()}
                excludeDates={disabledDates}
                locale={uk}
                dateFormat="dd.MM.yyyy"
                placeholderText="Оберіть дату виїзду"
                className={`${css.input} ${errors.checkOut ? css.error : ''}`}
                disabled={isSubmittingBooking || isLoadingBookings}
                calendarClassName={css.customCalendar}
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
              disabled={isSubmittingBooking}
            >
              {Array.from({ length: maxGuests }, (_, i) => i + 1).map(num => (
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
                disabled={isSubmittingBooking}
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
                disabled={isSubmittingBooking}
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
                disabled={isSubmittingBooking}
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
                disabled={isSubmittingBooking}
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
              disabled={isSubmittingBooking}
            >
              Скасувати
            </button>
            <button
              type="submit"
              className={css.submitButton}
              disabled={isSubmittingBooking}
            >
              Підтвердити бронювання
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

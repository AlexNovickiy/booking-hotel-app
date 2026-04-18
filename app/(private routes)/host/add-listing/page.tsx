'use client';
import { useState, FormEvent, useEffect, useRef } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createNewListing,
  generateDescriptionWithGemini,
  updateListing,
} from '@/lib/api/clientApi';
import toast from 'react-hot-toast';
import css from './AddListing.module.css';
import { useAuthStore } from '@/lib/store/authStore';
import { useRouter } from 'next/navigation';
import { Hotel } from '@/lib/types';
import Image from 'next/image';

export default function AddListingPage({ listing }: { listing?: Hotel }) {
  const { isAuthenticated } = useAuthStore();
  const queryClient = useQueryClient();
  const router = useRouter();

  const [title, setTitle] = useState(listing?.title || '');
  const [location, setLocation] = useState(listing?.location || '');
  const [description, setDescription] = useState(listing?.description || '');
  const [price, setPrice] = useState(listing?.price || 1500);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [maxGuests, setMaxGuests] = useState(listing?.maxGuests || 2);
  const [defaultPlaceholder, setDefaultPlaceholder] = useState<string>(
    '/images/createListing/placeholder-image-mb.png'
  );
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(
    listing?.imageUrl || null
  );
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const createMutation = useMutation({
    mutationFn: createNewListing,
    onSuccess: data => {
      toast.success(`Оголошення успішно створено (ID: ${data._id})!`);
      queryClient.invalidateQueries({ queryKey: ['userListings'] }); // Оновити список оголошень користувача
      router.push('/profile'); // Редирект на сторінку профілю
    },
    onError: () => {
      toast.error('Помилка при створенні оголошення.');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      formData,
      hotelId,
    }: {
      formData: FormData;
      hotelId: string;
    }) => updateListing(formData, hotelId),
    onSuccess: data => {
      toast.success(`Оголошення успішно оновлено (ID: ${data._id})!`);
      queryClient.invalidateQueries({ queryKey: ['userListings'] });
      router.push('/profile');
    },
    onError: () => {
      toast.error('Помилка при оновленні оголошення.');
    },
  });

  const geminiMutation = useMutation({
    mutationFn: ({ title, location }: { title: string; location: string }) =>
      generateDescriptionWithGemini(title, location),
    onSuccess: generatedText => {
      setDescription(generatedText);
      toast.success('Опис згенеровано Gemini!');
    },
    onError: () => {
      toast.error('Помилка генерації опису.');
    },
  });

  useEffect(() => {
    let isActive = true;

    const preloadImageFile = async () => {
      if (!listing?.imageUrl || imageFile) return;

      try {
        const response = await fetch(listing.imageUrl);
        const blob = await response.blob();
        const extension = blob.type?.split('/')[1] || 'jpg';
        const file = new File([blob], `listing-image.${extension}`, {
          type: blob.type || 'image/jpeg',
        });

        if (isActive) {
          setImageFile(file);
        }
      } catch (error) {
        console.error('Failed to preload listing image file:', error);
      }
    };

    preloadImageFile();

    return () => {
      isActive = false;
    };
  }, [listing?.imageUrl, imageFile]);

  useEffect(() => {
    const updatePlaceholder = () => {
      const width = window.innerWidth;
      if (width >= 1440) {
        setDefaultPlaceholder('/images/createListing/placeholder-image-dt.png');
      } else if (width >= 768) {
        setDefaultPlaceholder('/images/createListing/placeholder-image-tb.png');
      } else {
        setDefaultPlaceholder('/images/createListing/placeholder-image-mb.png');
      }
    };

    updatePlaceholder();
    window.addEventListener('resize', updatePlaceholder);

    return () => {
      window.removeEventListener('resize', updatePlaceholder);
    };
  }, []);

  useEffect(() => {
    return () => {
      if (uploadedImageUrl) {
        URL.revokeObjectURL(uploadedImageUrl);
      }
    };
  }, [uploadedImageUrl]);

  if (!isAuthenticated)
    return (
      <p className={css.authMessage}>
        Будь ласка, увійдіть, щоб створити нове оголошення.
      </p>
    );

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (
      !title ||
      !location ||
      !description ||
      price <= 0 ||
      maxGuests <= 0 ||
      !imageFile
    ) {
      toast.error(
        "Заповніть усі обов'язкові поля (включаючи зображення та ціну)."
      );
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('location', location);
    formData.append('description', description);
    formData.append('price', String(price));
    formData.append('maxGuests', String(maxGuests));
    formData.append('image', imageFile);

    if (listing) {
      updateMutation.mutate({ formData, hotelId: listing._id });

    } else {
      createMutation.mutate(formData);
    }
  };

  const handleGenerate = () => {
    if (!title || !location) {
      toast.error('Введіть Назву та Локацію перед генерацією.');
      return;
    }
    geminiMutation.mutate({ title, location });
  };

  return (
    <div className={css.container}>
      <h1 className={css.title}>Створити нове оголошення</h1>
      <form onSubmit={handleSubmit} className={css.form}>
        <div className={css.formGroup}>
          <label htmlFor="title">Назва житла</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
            className={css.input}
          />
        </div>

        <div className={css.formGroup}>
          <label htmlFor="location">Локація</label>
          <input
            type="text"
            id="location"
            value={location}
            onChange={e => setLocation(e.target.value)}
            required
            className={css.input}
          />
        </div>

        <div className={css.formGroup}>
          <label htmlFor="price">Ціна за ніч (грн)</label>
          <input
            type="number"
            id="price"
            value={price}
            onChange={e => setPrice(Number(e.target.value))}
            required
            min={100}
            className={css.input}
          />
        </div>

        <div className={css.formGroup}>
          <label htmlFor="maxGuests">Максимальна кількість гостей</label>
          <input
            type="number"
            id="maxGuests"
            value={maxGuests}
            onChange={e => setMaxGuests(Number(e.target.value))}
            required
            min={1}
            className={css.input}
          />
        </div>

        <div className={css.imageSection}>
          <div
            className={css.imageWrapper}
            onClick={() => fileInputRef.current?.click()}
            style={{ cursor: 'pointer' }}
          >
            <Image
              src={uploadedImageUrl || listing?.imageUrl || defaultPlaceholder}
              alt="Прев'ю"
              className={css.coverPreview}
              width={865}
              height={635}
              unoptimized
              sizes="(max-width: 767px) 335px, (min-width: 768px) and (max-width: 1439px) 704px, (min-width: 1440px) 865px"
              style={{ width: '100%', height: 'auto' }}
              priority={true}
            />
          </div>

          <button
            type="button"
            className={css.uploadBtn}
            onClick={() => fileInputRef.current?.click()}
          >
            Завантажити фото
          </button>

          <input
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            ref={fileInputRef}
            onChange={e => {
              const file = e.currentTarget.files?.[0] ?? null;
              if (file) {
                if (uploadedImageUrl) {
                  URL.revokeObjectURL(uploadedImageUrl);
                }
                const objectUrl = URL.createObjectURL(file);
                setUploadedImageUrl(objectUrl);
                setImageFile(file);
              }
            }}
          />
        </div>

        <div className={css.formGroup}>
          <label htmlFor="description">Опис</label>
          <div className={css.geminiBar}>
            <textarea
              id="description"
              value={description}
              onChange={e => setDescription(e.target.value)}
              required
              className={css.textarea}
              rows={6}
            />
            <button
              type="button"
              onClick={handleGenerate}
              className={css.generateButton}
              disabled={geminiMutation.isPending || !title || !location}
            >
              {geminiMutation.isPending
                ? 'Генерація...'
                : '✨ Згенерувати опис'}
            </button>
          </div>
        </div>

        <button
          type="submit"
          className={css.submitButton}
          disabled={createMutation.isPending || geminiMutation.isPending}
        >
          {listing
            ? updateMutation.isPending
              ? 'Оновлення...'
              : 'Оновити'
            : createMutation.isPending
              ? 'Створення...'
              : 'Створити оголошення'}
        </button>
      </form>
    </div>
  );
}

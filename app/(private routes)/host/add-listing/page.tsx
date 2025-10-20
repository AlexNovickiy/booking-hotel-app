'use client';
import { useState, FormEvent, ChangeEvent } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createNewListing,
  generateDescriptionWithGemini,
} from '@/lib/api/clientApi';
import toast from 'react-hot-toast';
import css from './AddListing.module.css';
import { useAuthStore } from '@/lib/store/authStore';
import { useRouter } from 'next/navigation';

export default function AddListingPage() {
  // В реальному проекті використовуйте useState або Zustand для імітації аутентифікації
  const { isAuthenticated } = useAuthStore();
  const queryClient = useQueryClient();
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(1500);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const createMutation = useMutation({
    mutationFn: createNewListing,
    onSuccess: data => {
      toast.success(`Оголошення успішно створено (ID: ${data.id})!`);
      queryClient.invalidateQueries({ queryKey: ['userListings'] }); // Оновити список оголошень користувача
      router.push('/profile'); // Редирект на сторінку профілю
    },
    onError: () => {
      toast.error('Помилка при створенні оголошення.');
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

  if (!isAuthenticated)
    return (
      <p className={css.authMessage}>
        Будь ласка, увійдіть, щоб створити нове оголошення.
      </p>
    );

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!title || !location || !description || price <= 0 || !imageFile) {
      toast.error(
        "Заповніть усі обов'язкові поля (включаючи зображення та ціну)."
      );
      return;
    }

    // Тут ми імітуємо, що файл imageFile буде завантажено,
    // а потім URL зображення буде відправлено на бекенд разом з іншими даними.
    const formData = new FormData();
    formData.append('title', title);
    formData.append('location', location);
    formData.append('description', description);
    formData.append('price', String(price));
    formData.append('image', imageFile);

    createMutation.mutate(formData);
  };

  const handleGenerate = () => {
    if (!title || !location) {
      toast.error('Введіть Назву та Локацію перед генерацією.');
      return;
    }
    geminiMutation.mutate({ title, location });
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    setImageFile(e.target.files?.[0] ?? null);
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

        <div className={`${css.formGroup} ${css.imageUpload}`}>
          <label htmlFor="imageFile">Зображення об&apos;єкта</label>
          <input
            type="file"
            id="imageFile"
            accept="image/*"
            onChange={handleFileChange}
            required
            className={css.input}
          />
          {imageFile && (
            <p className={css.note}>Обрано файл: {imageFile.name}</p>
          )}
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
          disabled={
            createMutation.isPending || geminiMutation.isPending || !imageFile
          }
        >
          {createMutation.isPending ? 'Створення...' : 'Створити оголошення'}
        </button>
      </form>
    </div>
  );
}

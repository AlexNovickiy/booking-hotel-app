'use client';

import { useState, FormEvent, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';
import css from '@/app/Home.module.css';
import Icon from '../ui/Icon';

export default function SearchBarClient() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [query, setQuery] = useState('');
  const [guests, setGuests] = useState(2);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setQuery(searchParams.get('q') || '');
    setGuests(Number(searchParams.get('guests')) || 2);
    setCurrentPage(Number(searchParams.get('page')) || 1);
  }, [searchParams]);

  const handleSearch = useDebouncedCallback(
    (term: string, numGuests: number, currentPage: number) => {
      const params = new URLSearchParams(searchParams.toString());
      if (term) {
        params.set('q', term);
      } else {
        params.delete('q');
      }
      if (numGuests > 0) {
        params.set('guests', String(numGuests));
      } else {
        params.delete('guests');
      }
      params.set('page', String(currentPage));
      router.replace(`/?${params.toString()}`);
    },
    300
  );

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    handleSearch(query, guests, currentPage);
  };

  return (
    <form className={css.searchBar} onSubmit={handleSubmit}>
      <div className={css.searchGroup}>
        <label htmlFor="search-query">Куди прямуєте?</label>
        <input
          id="search-query"
          type="text"
          placeholder="Наприклад, Київ або Карпати"
          value={query}
          onChange={e => {
            setQuery(e.target.value);
            handleSearch(e.target.value, guests, currentPage);
          }}
        />
      </div>
      <div className={css.searchGroup}>
        <label htmlFor="search-guests">Кількість гостей</label>
        <input
          id="search-guests"
          type="number"
          min="1"
          value={guests}
          onChange={e => {
            const numGuests = Number(e.target.value);
            setGuests(numGuests);
            handleSearch(query, numGuests, currentPage);
          }}
        />
      </div>
      <button type="submit" className={css.searchButton}>
        <Icon name="search" className={css.searchIcon} />
        <span>Пошук</span>
      </button>
    </form>
  );
}

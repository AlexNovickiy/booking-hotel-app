import css from './Home.module.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '404 - Page not found',
  description: 'The page you are looking for does not exist',
  openGraph: {
    title: '404 - Page not found',
    description: 'The page you are looking for does not exist',
    url: 'https://notehub.com/not-found',
    images: [
      {
        url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
        width: 1200,
        height: 630,
        alt: 'NoteHub - A platform for note-taking and organization',
      },
    ],
  },
};

const NotFound = () => {
  return (
    <>
      <h1 className={css.title}>404 - Page not found</h1>
      <p className={css.description}>
        Sorry, the page you are looking for does not exist.
      </p>
    </>
  );
};

export default NotFound;

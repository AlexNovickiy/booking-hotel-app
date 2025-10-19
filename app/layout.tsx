import type { Metadata } from 'next';
import { Roboto } from 'next/font/google';
import './globals.css';
import 'modern-normalize';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import TanStackProvider from '@/components/TanStackProvider/TanStackProvider';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import css from '@/app/Home.module.css';
import { Toaster } from 'react-hot-toast';
import AuthProvider from '@/components/AuthProvider/AuthProvider';

const roboto = Roboto({
  variable: '--font-roboto',
  subsets: ['latin'],
  weight: ['100', '300', '400', '500', '700', '900'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'NoteHub',
  description: 'A platform for note-taking and organization',
  openGraph: {
    title: 'NoteHub',
    description: 'A platform for note-taking and organization',
    url: 'https://08-zustand-eight-virid.vercel.app',
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

export default function RootLayout({
  children,
  modal,
}: Readonly<{ children: React.ReactNode; modal: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${roboto.variable}`}>
        <Toaster position="top-right" />
        <TanStackProvider>
          <AuthProvider>
            <Header />
            <main className={css.main}>
              {children}
              {modal}
            </main>
            <Footer />
          </AuthProvider>
          <ReactQueryDevtools initialIsOpen={false} />
        </TanStackProvider>
      </body>
    </html>
  );
}

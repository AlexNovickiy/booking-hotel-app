import { Metadata } from 'next';
import './globals.css';
import Header from '@/components/layout/Header/Header';
import Footer from '@/components/layout/Footer/Footer';
import TanStackProvider from '@/components/providers/TanStackProvider/TanStackProvider';
import AuthProvider from '@/components/providers/AuthProvider/AuthProvider';

export const metadata: Metadata = {
  title: 'HotelBooking - Бронювання Готелів',
  description: 'Онлайн-сервіс для бронювання житла та здачі в оренду житла.',
  openGraph: {
    title: 'HotelBooking - Бронювання Готелів',
    description: 'Онлайн-сервіс для бронювання житла та здачі в оренду житла.',
    url: 'http://localhost:3000',
    images: [
      {
        url: 'http://localhost:3000/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'HotelBooking - Бронювання Готелів',
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="uk">
      <body>
        <TanStackProvider>
          {/* AuthProvider для Zustang/перевірки сесії */}
          <AuthProvider>
            <Header />
            <main className="mainContent">{children}</main>
            <Footer />
          </AuthProvider>
        </TanStackProvider>
      </body>
    </html>
  );
}

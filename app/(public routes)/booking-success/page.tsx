import Link from 'next/link';
import css from './BookingSuccess.module.css';

type BookingSuccessProps = {
  searchParams: Promise<{ session_id?: string }>;
};

export const metadata = {
  title: 'Оплата успішна',
};

export default async function BookingSuccessPage({
  searchParams,
}: BookingSuccessProps) {
  const { session_id } = await searchParams;

  return (
    <div className={css.container}>
      <div className={css.card}>
        <div className={css.icon}>✓</div>
        <h1 className={css.title}>Оплата пройшла успішно!</h1>
        <p className={css.text}>
          Ваше бронювання підтверджено. Деталі будуть надіслані на вашу електронну
          пошту.
        </p>
        {session_id && (
          <p className={css.sessionId}>ID сесії: {session_id}</p>
        )}
        <div className={css.actions}>
          <Link href="/profile" className={css.profileLink}>
            Мої бронювання
          </Link>
          <Link href="/" className={css.homeLink}>
            На головну
          </Link>
        </div>
      </div>
    </div>
  );
}

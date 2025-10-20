// Server Component
import css from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={css.footer}>
      <div className={css.footerContent}>
        <p>© {new Date().getFullYear()} HotelBooking. Усі права захищено.</p>
        <p>Розробник: Олександр Новицький</p>
      </div>
    </footer>
  );
}

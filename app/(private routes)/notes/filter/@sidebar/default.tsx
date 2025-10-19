import Link from 'next/link';
import css from './SidebarNotes.module.css';

export default function NotesSidebar() {
  return (
    <ul className={css.menuList}>
      {['All', 'Work', 'Personal', 'Meeting', 'Shopping', 'Todo'].map(tag => (
        <li key={tag} className={css.menuItem}>
          <Link href={`/notes/filter/${tag}`} className={css.menuLink}>
            {tag}
          </Link>
        </li>
      ))}
    </ul>
  );
}

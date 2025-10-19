'use client';

import Link from 'next/link';
import css from './TagsMenu.module.css';
import { useState } from 'react';

export default function TagsMenu() {
  const [menuIsOpen, setMenuIsOpen] = useState(false);

  const handleCloseTagMenu = () => {
    setMenuIsOpen(!menuIsOpen);
  };

  return (
    <div className={css.menuContainer}>
      <button onClick={handleCloseTagMenu} className={css.menuButton}>
        Notes ▾
      </button>
      {menuIsOpen && (
        <ul onClick={handleCloseTagMenu} className={css.menuList}>
          {['All', 'Work', 'Personal', 'Meeting', 'Shopping', 'Todo'].map(
            tag => (
              <li key={tag} className={css.menuItem}>
                <Link href={`/notes/filter/${tag}`} className={css.menuLink}>
                  {tag}
                </Link>
              </li>
            )
          )}
        </ul>
      )}
    </div>
  );
}

// components/Header/Header.tsx
'use client';

import Link from 'next/link';
import css from './Header.module.css';

export default function Header() {
  return (
    <header className={css.header}>
      {}
      <Link href="/" className={css.logo}>
        NoteHub
      </Link>

      <nav>
        {}
        <ul className={css.navigation}>
          <li>
            <Link href="/" className={css.link}>
              Home
            </Link>
          </li>
          <li>
            <Link href="/notes/filter/all" className={css.link}>
              Notes
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}

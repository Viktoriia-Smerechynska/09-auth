// src/app/notes/filter/@sidebar/default.tsx
import Link from 'next/link';
import css from './SidebarNotes.module.css';

interface SidebarNotesProps {
  params: Promise<{
    slug?: string[];
  }>;
}

export default async function SidebarNotes({ params }: SidebarNotesProps) {
  const resolvedParams = await params;

  const slugArray = resolvedParams.slug;
  const currentTag = slugArray && slugArray.length > 0 ? slugArray[0] : 'all';

  const tags = ['Todo', 'Work', 'Personal', 'Meeting', 'Shopping'];

  return (
    <ul className={css.menuList}>
      {}
      <li className={css.menuItem}>
        <Link
          href="/notes/filter/all"
          className={`${css.menuLink} ${currentTag === 'all' ? css.activeLink : ''}`}
        >
          All notes
        </Link>
      </li>

      {}
      {tags.map(tag => (
        <li key={tag} className={css.menuItem}>
          <Link
            href={`/notes/filter/${tag}`}
            className={`${css.menuLink} ${currentTag === tag ? css.activeLink : ''}`}
          >
            {tag}
          </Link>
        </li>
      ))}
    </ul>
  );
}

// src/app/notes/filter/[...slug]/Notes.client.tsx
'use client';

import { useState, useEffect } from 'react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { useDebouncedCallback } from 'use-debounce';
import Link from 'next/link';
import css from '../../../Home.module.css';

import { fetchNotes } from '@/lib/api';

import NoteList from '@/components/NoteList/NoteList';
import Pagination from '@/components/Pagination/Pagination';
import SearchBox from '@/components/SearchBox/SearchBox';
import Loader from '@/components/Loader/Loader';
import ErrorMessage from '@/components/ErrorMessage/ErrorMessage';

interface NotesClientProps {
  tag: string;
}

export default function NotesClient({ tag }: NotesClientProps) {
  const [page, setPage] = useState<number>(1);
  const [inputValue, setInputValue] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const debouncedSearch = useDebouncedCallback((value: string) => {
    setSearchQuery(value);
    setPage(1);
  }, 500);

  const handleSearchChange = (value: string) => {
    setInputValue(value);
    debouncedSearch(value);
  };

  useEffect(() => {
    setPage(1);
    setInputValue('');
    setSearchQuery('');
  }, [tag]);

  const { data, isLoading, isError, isFetching } = useQuery({
    queryKey: ['notes', page, searchQuery, tag],
    queryFn: () => fetchNotes(page, searchQuery, tag),
    placeholderData: keepPreviousData,
    retry: false,
  });

  const handlePageChange = (selectedItem: { selected: number }): void => {
    setPage(selectedItem.selected + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const notes = data?.notes || [];
  const totalPages = data?.totalPages || 0;

  return (
    <div className={css.app || ''} style={{ padding: '0rem' }}>
      <header
        className={css.toolbar}
        style={{
          display: 'flex',
          gap: '20px',
          marginBottom: '20px',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <SearchBox value={inputValue} onChange={handleSearchChange} />

        {!isLoading && !isError && totalPages > 1 ? (
          <Pagination pageCount={totalPages} forcePage={page - 1} onPageChange={handlePageChange} />
        ) : (
          <div style={{ flex: 1 }} />
        )}

        {}
        <Link href="/notes/action/create" className={css.button || ''}>
          Create note +
        </Link>
      </header>

      <main className={css.content}>
        {isLoading && <Loader />}

        {isError && !isLoading && <ErrorMessage />}

        {!isLoading && !isError && notes.length > 0 && (
          <div style={{ opacity: isFetching ? 0.6 : 1, transition: 'opacity 0.2s' }}>
            <NoteList notes={notes} />
          </div>
        )}

        {!isLoading && !isError && notes.length === 0 && (
          <p style={{ color: '#aaa', textAlign: 'center', fontSize: '16px', marginTop: '40px' }}>
            {searchQuery
              ? 'No notes found matching your search in this category.'
              : 'No notes found in this category.'}
          </p>
        )}
      </main>

      {}
    </div>
  );
}

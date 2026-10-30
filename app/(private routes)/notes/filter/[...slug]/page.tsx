// src/app/notes/filter/[...slug]/page.tsx
import { QueryClient, dehydrate, HydrationBoundary } from '@tanstack/react-query';
import type { Metadata } from 'next';
import { fetchNotes } from '@/lib/api/serverApi';
import NotesClient from './Notes.client';

interface NotesPageProps {
  params: Promise<{
    slug: string[];
  }>;
}

export async function generateMetadata({ params }: NotesPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const tagFromUrl = resolvedParams.slug?.[0] || 'all';

  const formattedTag = tagFromUrl.charAt(0).toUpperCase() + tagFromUrl.slice(1);
  const pageTitle = `${formattedTag} Notes | NoteHub`;
  const pageDescription = `Browse and manage your personal notes filtered by category: ${formattedTag}.`;

  return {
    title: pageTitle,
    description: pageDescription,
    openGraph: {
      title: pageTitle,
      description: pageDescription,

      url: `https://notehub.com/notes/filter/${tagFromUrl}`,

      images: [
        {
          url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
          width: 1200,
          height: 630,
          alt: `NoteHub Category Dashboard - ${formattedTag}`,
        },
      ],
    },
  };
}

export default async function NotesPage({ params }: NotesPageProps) {
  const queryClient = new QueryClient();
  const resolvedParams = await params;

  const tagFromUrl = resolvedParams.slug?.[0] || 'all';

  await queryClient.prefetchQuery({
    queryKey: ['notes', 1, '', tagFromUrl],
    queryFn: () => fetchNotes(1, '', tagFromUrl),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient tag={tagFromUrl} />
    </HydrationBoundary>
  );
}

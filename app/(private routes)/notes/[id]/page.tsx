import { QueryClient, dehydrate, HydrationBoundary } from '@tanstack/react-query';
import type { Metadata } from 'next';
import { fetchNoteById } from '@/lib/api/serverApi';
import NoteDetailsClient from './NoteDetails.client';

interface NoteDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({ params }: NoteDetailPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const { id } = resolvedParams;

  try {
    const note = await fetchNoteById(id);
    const shortDescription =
      note.content.length > 60 ? `${note.content.slice(0, 60)}...` : note.content;

    return {
      title: `${note.title} | NoteHub`,
      description: shortDescription,
      openGraph: {
        title: `${note.title} | NoteHub`,
        description: shortDescription,
        url: `https://notehub.com{id}`,
        images: [
          {
            url: 'https://goit.global',
            width: 1200,
            height: 630,
            alt: `Detailed preview of note: ${note.title}`,
          },
        ],
      },
    };
  } catch (error) {
    return {
      title: 'Note Details | NoteHub',
      description: 'View details of your personal note on NoteHub.',
    };
  }
}

export default async function NotePage({ params }: NoteDetailPageProps) {
  const queryClient = new QueryClient();
  const resolvedParams = await params;
  const { id } = resolvedParams;

  await queryClient.prefetchQuery({
    queryKey: ['note', id],
    queryFn: () => fetchNoteById(id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NoteDetailsClient />
    </HydrationBoundary>
  );
}

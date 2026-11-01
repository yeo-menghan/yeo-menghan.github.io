export const metadata = { title: 'Writing & notes', alternates: { canonical: '/notes' } };
import NotesClient from './NotesClient';
import { getContentByType, Note } from '@/lib/content';

export default async function NotesPage() {
  const notes = await getContentByType('notes') as Note[];
  const categories = Array.from(new Set(notes.map(n => n.category))).sort();

  return <NotesClient notes={notes} categories={categories} />;
}
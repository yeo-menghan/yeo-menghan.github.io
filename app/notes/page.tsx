import NotesClient from './NotesClient';
import { getContentByType, Note } from '@/lib/content';

export default function NotesPage() {
  const notes = getContentByType('notes') as Note[];
  const categories = Array.from(new Set(notes.map(n => n.category))).sort();

  return <NotesClient notes={notes} categories={categories} />;
}
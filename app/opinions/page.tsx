import { getContentByType } from '@/lib/content';
import OpinionsClient from './OpinionsClient';

export default async function OpinionsPage() {
  const opinions = await getContentByType('opinions');

  return <OpinionsClient opinions={opinions} />;
}
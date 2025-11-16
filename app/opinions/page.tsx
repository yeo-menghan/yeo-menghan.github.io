import { getContentByType } from '@/lib/content';
import OpinionsClient from './OpinionsClient';

export default function OpinionsPage() {
  const opinions = getContentByType('opinions');

  return <OpinionsClient opinions={opinions} />;
}
import AtlasWorkspace from '@/components/atlas/AtlasWorkspace';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Web Demo — CpE Atlas',
  description:
    'Explore computers, motherboards, microcontrollers, circuits, and robots in the interactive CpE Atlas workspace.',
  openGraph: { images: [] },
  twitter: { card: 'summary', images: [] },
};
export default function AtlasPage() {
  return <AtlasWorkspace />;
}

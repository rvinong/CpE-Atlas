import AtlasWorkspace from '@/components/atlas/AtlasWorkspace';
import type { Metadata } from 'next';
import { isSystemId, systems } from '@/lib/atlas/systems';

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}): Promise<Metadata> {
  const query = await searchParams;
  const id =
    typeof query.system === 'string' && isSystemId(query.system)
      ? query.system
      : 'desktop';
  const system = systems[id];
  const title = `${system.name} — CpE Atlas`;
  return {
    title,
    description: system.overview,
    openGraph: { title, description: system.overview, images: [] },
    twitter: {
      card: 'summary',
      title,
      description: system.overview,
      images: [],
    },
  };
}
export default function AtlasPage() {
  return <AtlasWorkspace />;
}

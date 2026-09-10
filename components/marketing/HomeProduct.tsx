'use client';

import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { useBrowserReady } from '@/hooks/use-browser-preferences';
import type { SystemId } from '@/lib/atlas/types';
import styles from './marketing.module.css';

const AtlasPreview = lazy(() => import('./MarketingScene'));

export function HomeProduct({ systemId = 'desktop' }: { systemId?: SystemId }) {
  const ready = useBrowserReady();
  const host = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
    if (host.current) observer.observe(host.current);
    return () => observer.disconnect();
  }, []);
  return (
    <figure ref={host} aria-label={`Rotatable ${systemId} model. Drag horizontally to rotate; scroll vertically to continue.`} style={{ width: '100%', height: '100%', margin: 0, position: 'relative' }}>
      {ready && visible && <Suspense fallback={<output className={styles.modelLoading}>Loading model...</output>}><AtlasPreview systemId={systemId} /></Suspense>}
    </figure>
  );
}

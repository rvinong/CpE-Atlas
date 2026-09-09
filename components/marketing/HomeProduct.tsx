'use client';

import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { useBrowserReady } from '@/hooks/use-browser-preferences';

const AtlasPreview = lazy(() => import('@/components/three/AtlasScene'));

export function HomeProduct() {
  const ready = useBrowserReady();
  const host = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
    if (host.current) observer.observe(host.current);
    return () => observer.disconnect();
  }, []);
  return (
    <figure ref={host} aria-label="Three-dimensional desktop computer model" style={{ width: '100%', height: '100%', margin: 0, position: 'relative' }}>
      {ready && visible && <Suspense fallback={null}><AtlasPreview preview /></Suspense>}
      <div aria-hidden="true" style={{ position: 'absolute', inset: 0, touchAction: 'pan-y' }} />
    </figure>
  );
}

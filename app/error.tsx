'use client';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <main className="scene-fallback" style={{ minHeight: '100dvh' }}>
      <h1>The workspace couldn’t load.</h1>
      <p>
        Try loading the atlas again. Your browser may have interrupted the 3D
        download.
      </p>
      <Button onClick={reset}>Try again</Button>
      <Link href="/">Return to CpE Atlas</Link>
    </main>
  );
}

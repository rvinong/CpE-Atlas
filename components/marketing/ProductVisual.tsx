import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight, Maximize2 } from 'lucide-react';
import styles from './marketing.module.css';

export function ProductVisual({ compact = false }: { compact?: boolean }) {
  return (
    <figure className={`${styles.productVisual} ${compact ? styles.productVisualCompact : ''}`}>
      <div className={styles.windowBar}>
        <span className={styles.windowBrand}><i /> CpE ATLAS / DESKTOP COMPUTER</span>
        <span>INTERACTIVE 3D</span>
      </div>
      <div className={styles.videoFrame}>
        <Image
          src="/og.png"
          alt="CpE Atlas exploded desktop computer with its case, motherboard, graphics card, processor, memory, and cooling assembly"
          width={1729}
          height={910}
          priority={!compact}
          sizes={compact ? '(max-width: 820px) 100vw, 55vw' : '(max-width: 1180px) 100vw, 62vw'}
          unoptimized
        />
        <div className={styles.visualShade} />
        <div className={styles.visualStatus}>
          <span><i /> PRODUCT PREVIEW</span>
          <Link href="/atlas" aria-label="Open CpE Atlas web demo">
            Open full workspace <Maximize2 size={13} />
          </Link>
        </div>
      </div>
      {!compact && (
        <figcaption>
          <span>Rotate, disassemble, and inspect complete systems.</span>
          <Link href="/atlas">Try it yourself <ArrowUpRight size={14} /></Link>
        </figcaption>
      )}
    </figure>
  );
}

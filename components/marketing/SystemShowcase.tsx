'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, Bot, Box, Cable, CircuitBoard, Cpu } from 'lucide-react';
import { atlasSystems } from '@/lib/site';
import styles from './marketing.module.css';
import { HomeProduct } from './HomeProduct';

const systemIcons = [Box, CircuitBoard, Cpu, Cable, Bot];

export function SystemShowcase() {
  const [activeIndex, setActiveIndex] = useState(1);
  const active = atlasSystems[activeIndex];

  return (
    <div className={styles.systemShowcase}>
      <div className={styles.systemSelector} aria-label="CpE Atlas systems">
        {atlasSystems.map((system, index) => {
          const Icon = systemIcons[index];
          return (
            <button key={system.id} type="button" aria-pressed={activeIndex === index}
              aria-controls="active-system" className={activeIndex === index ? styles.systemTabActive : ''}
              onClick={() => setActiveIndex(index)}>
              <span>{system.number}</span><Icon size={18} strokeWidth={1.35} /><strong>{system.name}</strong>
            </button>
          );
        })}
      </div>
      <article id="active-system" aria-label={active.name} className={styles.activeSystem} key={active.id}>
        <div className={styles.systemCanvas}>
          <div className={styles.canvasGrid} aria-hidden="true" />
          <HomeProduct systemId={active.id} />
          <span className={styles.canvasCoordinate}>SYSTEM / {active.number}</span>
          <span className={styles.canvasStatus}><i /> INTERACTIVE MODULE</span>
        </div>
        <div className={styles.systemInfo}>
          <p>{active.category}</p><h3>{active.name}</h3><p>{active.description}</p>
          <div className={styles.systemTags}>{active.detail.split(' · ').map((detail) => <span key={detail}>{detail}</span>)}</div>
          <Link href={`/atlas?system=${active.id}`}>Explore {active.name} <ArrowUpRight size={16} /></Link>
        </div>
      </article>
    </div>
  );
}

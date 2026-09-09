'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, Bot, Box, Cable, CircuitBoard, Cpu } from 'lucide-react';
import { atlasSystems } from '@/lib/site';
import styles from './marketing.module.css';
import { HomeProduct } from './HomeProduct';

const systemIcons = [Box, CircuitBoard, Cpu, Cable, Bot];

export function SystemShowcase() {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = atlasSystems[activeIndex];
  const ActiveIcon = systemIcons[activeIndex];

  return (
    <div className={styles.systemShowcase}>
      <div className={styles.systemSelector} role="tablist" aria-label="CpE Atlas systems">
        {atlasSystems.map((system, index) => {
          const Icon = systemIcons[index];
          return (
            <button key={system.id} type="button" role="tab" aria-selected={activeIndex === index}
              aria-controls="active-system" className={activeIndex === index ? styles.systemTabActive : ''}
              onClick={() => setActiveIndex(index)}>
              <span>{system.number}</span><Icon size={18} strokeWidth={1.35} /><strong>{system.name}</strong>
            </button>
          );
        })}
      </div>
      <article id="active-system" role="tabpanel" className={styles.activeSystem} key={active.id}>
        <div className={styles.systemCanvas}>
          <div className={styles.canvasGrid} aria-hidden="true" />
          {active.id === 'desktop' ? (
            <HomeProduct />
          ) : (
            <div className={styles.systemSchematic} aria-hidden="true"><span /><span /><ActiveIcon size={112} strokeWidth={0.75} /></div>
          )}
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

'use client';
import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { atlasSystems } from '@/lib/site';
import styles from './marketing.module.css';
import { HomeProduct } from './HomeProduct';

const names = ['Desktop', 'Motherboard', 'Arduino', 'Rectifier', 'Robotics'];
export function SystemShowcase() {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = atlasSystems[activeIndex];
  return <div>
    <div className={styles.systemSelector} aria-label="CpE Atlas systems">{atlasSystems.map((system, index) => <button key={system.id} type="button" aria-pressed={activeIndex === index} aria-controls="active-system" onClick={() => setActiveIndex(index)}>{names[index]}</button>)}</div>
    <article id="active-system" className={styles.activeSystem} key={active.id} aria-label={active.name}>
      <div className={styles.systemCanvas}><HomeProduct systemId={active.id} /></div>
      <div className={styles.systemInfo} aria-live="polite"><h3>{active.name}</h3><p>{active.description}</p><Link href={`/atlas?system=${active.id}`} className={styles.inlineLink}>Explore System <ArrowRight size={16} /></Link></div>
    </article>
  </div>;
}

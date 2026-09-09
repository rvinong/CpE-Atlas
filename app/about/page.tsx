import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { SiteFooter, SiteHeader } from '@/components/marketing/SiteChrome';
import styles from '@/components/marketing/marketing.module.css';

export const metadata: Metadata = { title: 'About CpE Atlas', description: 'Why CpE Atlas turns Computer Engineering systems into interactive 3D learning environments.' };

export default function AboutPage() {
  return <main className={styles.site}>
    <SiteHeader />
    <section className={styles.pageHero}><div><p className={styles.eyebrow}><i /> ABOUT THE PROJECT</p><h1>See how the<br />system works.</h1></div><p className={styles.pageHeroText}>CpE Atlas was created as an interactive learning platform for exploring Computer Engineering systems visually.</p></section>
    <section className={styles.pageSection}><div className={styles.aboutGrid}><h2>A visual companion for technical learning.</h2><div><p>Computer Engineering brings hardware, electronics, embedded software, and system design together. CpE Atlas gives learners a shared visual workspace for examining those connections.</p><p>Each module presents a complete system, then lets users disassemble it, focus on individual parts, and read concise technical context. The goal is to make unfamiliar systems easier to approach while preserving the relationships that make them work.</p><p>The Atlas complements classes, diagrams, textbooks, laboratories, and real hardware with a focused interactive view.</p><Link className={styles.inlineLink} href="/atlas">Open CpE Atlas <ArrowRight size={14} /></Link></div></div></section>
    <SiteFooter />
  </main>;
}

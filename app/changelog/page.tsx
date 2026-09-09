import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, History } from 'lucide-react';
import { SiteFooter, SiteHeader } from '@/components/marketing/SiteChrome';
import styles from '@/components/marketing/marketing.module.css';
import { releaseHistory } from '@/lib/software-release';

export const metadata: Metadata = { title: 'Changelog — CpE Atlas', description: 'Product releases and updates for CpE Atlas.' };

export default function ChangelogPage() {
  return <main className={styles.site} id="main-content" tabIndex={-1}>
    <SiteHeader />
    <section className={styles.pageHero}><div><p className={styles.eyebrow}><i /> PRODUCT UPDATES</p><h1>Changelog.</h1><p className={styles.pageHeroText}>Formal CpE Atlas release notes will be recorded here as downloadable software versions become available.</p></div><div className={styles.pageHeroAside}><span>PUBLISHED RELEASES <b>{releaseHistory.length}</b></span><span>WINDOWS BUILD <b>Coming soon</b></span></div></section>
    <section className={styles.pageSection}><div className={styles.emptyState}><History size={30} strokeWidth={1.3} /><h2>No formal releases yet.</h2><p>The interactive web Atlas is currently available. Version numbers, dates, improvements, and fixes will be added here only when releases are published.</p><Link className={styles.inlineLink} href="/atlas">Launch Atlas <ArrowRight size={14} /></Link></div></section>
    <SiteFooter />
  </main>;
}

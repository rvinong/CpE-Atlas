import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, MonitorDown } from 'lucide-react';
import { SiteFooter, SiteHeader } from '@/components/marketing/SiteChrome';
import styles from '@/components/marketing/marketing.module.css';
import { softwareRelease } from '@/lib/software-release';

export const metadata: Metadata = { title: 'Download CpE Atlas', description: 'Check availability and system information for the CpE Atlas Windows desktop application.' };

export default function DownloadPage() {
  return <main className={styles.site}>
    <SiteHeader />
    <section className={styles.pageHero}>
      <div><p className={styles.eyebrow}><i /> DESKTOP APPLICATION</p><h1>Download<br />CpE Atlas.</h1><p className={styles.pageHeroText}>A dedicated Windows learning environment for exploring detailed 3D Computer Engineering systems.</p></div>
      <div className={styles.pageHeroAside}><span>PLATFORM <b>Windows</b></span><span>AVAILABILITY <b>Coming soon</b></span>{softwareRelease.version && <span>VERSION <b>{softwareRelease.version}</b></span>}</div>
    </section>
    <section className={styles.pageSection}>
      <div className={styles.statusPanel}><span className={styles.statusIcon}><MonitorDown size={27} strokeWidth={1.4} /></span><div><h2>Windows desktop version coming soon.</h2><p>No installer has been published yet. The browser-based Atlas is available now.</p></div><span className={styles.statusBadge}>IN DEVELOPMENT</span></div>
      <div className={styles.infoGrid}>
        <article><h3>Use the web demo today</h3><p>Explore all current systems in the full-screen browser workspace while the Windows package is being prepared.</p><Link className={styles.inlineLink} href="/atlas">Open web demo <ArrowRight size={14} /></Link></article>
        <article><h3>Planned desktop experience</h3><ul><li>Dedicated mouse and keyboard workflow</li><li>Large 3D workspace</li><li>Packaged engineering models</li><li>Offline-ready application architecture</li></ul></article>
        <article><h3>System requirements</h3><p>Verified minimum and recommended requirements will be published with the first installer.</p></article>
        <article><h3>Installation and releases</h3><p>Installation steps, file size, version number, release date, and release notes will appear here once a signed build is available.</p><Link className={styles.inlineLink} href="/changelog">View changelog <ArrowRight size={14} /></Link></article>
      </div>
    </section>
    <SiteFooter />
  </main>;
}

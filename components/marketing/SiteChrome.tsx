import Link from 'next/link';
import { ArrowRight, Menu } from 'lucide-react';
import { siteConfig } from '@/lib/site';
import styles from './marketing.module.css';
import { MobileMenu } from './MobileMenu';

export function SiteHeader() {
  return <>
    <a className={styles.skipLink} href="#main-content">Skip to content</a>
    <header className={styles.header}><div className={styles.headerInner}>
      <Link href="/" className={styles.brand} aria-label="CpE Atlas home">CpE ATLAS</Link>
      <nav className={styles.desktopNav} aria-label="Primary navigation"><Link href="/#systems">Systems</Link><Link href="/about">About</Link><Link href="/changelog">Changelog</Link></nav>
      <Link href="/atlas" className={`${styles.primaryAction} ${styles.headerAction}`}>Launch Atlas <ArrowRight size={15} /></Link>
      <MobileMenu className={styles.mobileMenu}><summary aria-label="Open navigation"><Menu size={21} /></summary><nav aria-label="Mobile navigation"><Link href="/#systems">Systems</Link><Link href="/about">About</Link><Link href="/changelog">Changelog</Link><Link href="/atlas">Launch Atlas</Link></nav></MobileMenu>
    </div></header>
  </>;
}

export function SiteFooter() {
  return <footer className={styles.footer}><Link href="/" className={styles.brand}>CpE ATLAS</Link><nav aria-label="Footer navigation"><Link href="/#systems">Systems</Link><Link href="/about">About</Link><Link href="/changelog">Changelog</Link><Link href="/download">Windows &middot; Soon</Link><a href={siteConfig.repository}>GitHub</a></nav></footer>;
}

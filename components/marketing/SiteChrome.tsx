import Link from 'next/link';
import { ArrowUpRight, Box, Download, Menu } from 'lucide-react';
import styles from './marketing.module.css';

export function SiteHeader() {
  return (
    <>
      <a className={styles.skipLink} href="#main-content">Skip to content</a>
      <header className={styles.header}>
        <div className={styles.headerInner}>
        <Link href="/" className={styles.brand} aria-label="CpE Atlas home">
          <span className={styles.brandMark} aria-hidden="true">
            <Box size={19} strokeWidth={1.7} />
          </span>
          <span>
            CpE <b>ATLAS</b>
            <small>INTERACTIVE ENGINEERING</small>
          </span>
        </Link>

        <nav className={styles.desktopNav} aria-label="Primary navigation">
          <Link href="/#product">Product</Link>
          <Link href="/#systems">Systems</Link>
          <Link href="/#features">Features</Link>
          <Link href="/about">About</Link>
          <span className={styles.navDivider} aria-hidden="true" />
          <Link href="/changelog">Changelog</Link>
        </nav>

        <div className={styles.headerActions}>
          <Link href="/atlas" className={styles.textAction}>
            Try web demo <ArrowUpRight size={14} />
          </Link>
          <Link href="/download" className={styles.primaryAction} aria-label="Windows app download status">
            <Download size={14} /> Windows app
          </Link>
        </div>

        <details className={styles.mobileMenu}>
          <summary aria-label="Open navigation"><Menu size={20} /></summary>
          <nav aria-label="Mobile navigation">
            <Link href="/#product">Product</Link>
            <Link href="/#systems">Systems</Link>
            <Link href="/#features">Features</Link>
            <Link href="/about">About</Link>
            <Link href="/changelog">Changelog</Link>
            <Link href="/atlas">Try web demo</Link>
            <Link href="/download">Windows app</Link>
          </nav>
        </details>
        </div>
      </header>
    </>
  );
}

export function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerLead}>
        <Link href="/" className={styles.brand}>
          <span className={styles.brandMark} aria-hidden="true"><Box size={18} /></span>
          <span>CpE <b>ATLAS</b></span>
        </Link>
        <p>Interactive Computer Engineering Atlas</p>
      </div>
      <nav aria-label="Footer navigation">
        <Link href="/#product">Product</Link>
        <Link href="/#systems">Systems</Link>
        <Link href="/#features">Features</Link>
        <Link href="/about">About</Link>
        <Link href="/download">Download</Link>
        <Link href="/changelog">Changelog</Link>
        <Link href="/atlas">Web demo</Link>
      </nav>
      <p className={styles.footerNote}>
        Built as an interactive learning companion for Computer Engineering.
        <Link href="/download">Windows version coming soon →</Link>
      </p>
    </footer>
  );
}

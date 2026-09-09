
import Link from 'next/link';
import { ArrowUpRight, Box, Menu } from 'lucide-react';
import styles from './marketing.module.css';
import { MobileMenu } from './MobileMenu';

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
          <Link href="/changelog">Changelog</Link>
        </nav>

        <div className={styles.headerActions}>
          <Link href="/download" className={styles.textAction}>Windows — Soon</Link>
          <Link href="/atlas" className={styles.primaryAction}>Launch Atlas <ArrowUpRight size={14} /></Link>
        </div>

        <MobileMenu className={styles.mobileMenu}>
          <summary aria-label="Open navigation"><Menu size={20} /></summary>
          <nav aria-label="Mobile navigation">
            <Link href="/#product">Product</Link>
            <Link href="/#systems">Systems</Link>
            <Link href="/#features">Features</Link>
            <Link href="/changelog">Changelog</Link>
            <Link href="/download">Windows — Soon</Link>
            <Link href="/atlas">Launch Atlas</Link>
          </nav>
        </MobileMenu>
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
        <p>Explore Computer Engineering from the inside out.</p>
      </div>
      <nav aria-label="Footer navigation">
        <Link href="/#product">Product</Link>
        <Link href="/#systems">Systems</Link>
        <Link href="/#features">Features</Link>
        <Link href="/about">About</Link>
        <Link href="/download">Windows — Soon</Link>
        <Link href="/changelog">Changelog</Link>
        <Link href="/atlas">Launch Atlas</Link>
      </nav>
      <p className={styles.footerNote}>
        <span><i /> WEB ATLAS AVAILABLE</span>
        <Link href="/download">Windows version coming soon →</Link>
      </p>
    </footer>
  );
}

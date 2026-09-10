import Link from 'next/link';
import { ArrowRight, Box, Layers3, ScanSearch, Network } from 'lucide-react';
import { HomeProduct } from '@/components/marketing/HomeProduct';
import { SiteFooter, SiteHeader } from '@/components/marketing/SiteChrome';
import { SystemShowcase } from '@/components/marketing/SystemShowcase';
import styles from '@/components/marketing/marketing.module.css';

export default function Home() {
  return <main className={styles.site} id="main-content" tabIndex={-1}>
    <SiteHeader />
    <section className={styles.hero}>
      <p className={styles.eyebrow}>Computer Engineering &middot; Reimagined</p>
      <h1>CpE ATLAS</h1>
      <h2>Explore Computer Engineering<br />from the inside out.</h2>
      <p className={styles.heroText}>Interactive 3D learning for hardware, electronics, and robotics.</p>
      <Link href="/atlas" className={styles.primaryAction}>Launch Atlas <ArrowRight size={16} /></Link>
      <div className={styles.heroVisual}><HomeProduct /></div>
      <p className={styles.rotateHint}>Drag to discover another perspective</p>
    </section>
    <section id="systems" className={styles.section}>
      <div className={styles.sectionHeading}><p className={styles.sectionIndex}>01 / SYSTEMS</p><h2>Systems</h2><p>Explore real engineering systems.</p></div>
      <SystemShowcase />
    </section>
    <section id="features" className={styles.section}>
      <div className={styles.sectionHeading}><p className={styles.sectionIndex}>02 / UNDERSTANDING</p><h2>A Deeper Understanding</h2><p>Explore. Disassemble. Inspect. Understand.</p></div>
      <ol className={styles.processTrack}>
        {[[Box, 'Explore', 'Interact with real 3D models.'], [Layers3, 'Disassemble', 'Take systems apart layer by layer.'], [ScanSearch, 'Inspect', 'Learn what each component does.'], [Network, 'Understand', 'See how everything connects.']].map(([Icon, title, copy], index) => { const StageIcon = Icon as typeof Box; return <li key={String(title)}><StageIcon size={28} strokeWidth={1.2} /><span>0{index + 1}</span><h3>{String(title)}</h3><p>{String(copy)}</p></li>; })}
      </ol>
      <p className={styles.stageNote}>Available tools adapt to each system.</p>
    </section>
    <section id="workspace" className={`${styles.section} ${styles.workspaceSection}`}>
      <div className={styles.sectionHeading}><p className={styles.sectionIndex}>03 / WORKSPACE</p><h2>A Workspace Built to Explore</h2><p>A focused environment for learning, discovery, and deeper understanding.</p></div>
      <figure className={styles.workspaceImage}>
        {/* oxlint-disable-next-line next/no-img-element */}
        <img src="/atlas-workspace.png" width={1440} height={900} loading="lazy" decoding="async" alt="The real CpE Atlas workspace with motherboard navigation, the selected CPU socket, technical inspector, and exploration controls." />
      </figure>
    </section>
    <section className={styles.finalCta}><p className={styles.desktopStatus}>Windows version &middot; Coming soon</p><h2>Ready to explore?</h2><Link href="/atlas" className={styles.primaryAction}>Launch Atlas <ArrowRight size={16} /></Link><p>Explore Computer Engineering from the inside out.</p></section>
    <SiteFooter />
  </main>;
}

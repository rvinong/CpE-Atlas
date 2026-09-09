import Link from 'next/link';
import {
  ArrowDown, ArrowRight, ArrowUpRight, Bot, Box, Cable, CircuitBoard, Cpu,
  Eye, Focus, Layers3, Monitor, MousePointer2, ScanSearch,
} from 'lucide-react';
import { ProductVisual } from '@/components/marketing/ProductVisual';
import { SiteFooter, SiteHeader } from '@/components/marketing/SiteChrome';
import styles from '@/components/marketing/marketing.module.css';
import { atlasSystems } from '@/lib/site';

const systemIcons = [Box, CircuitBoard, Cpu, Cable, Bot];

export default function Home() {
  return (
    <main className={styles.site} id="main-content" tabIndex={-1}>
      <SiteHeader />
      <section className={styles.hero}>
        <div className={styles.heroGrid} aria-hidden="true" />
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}><i /> INTERACTIVE 3D ENGINEERING ATLAS</p>
          <h1>Explore Computer Engineering<br /><span>from the inside out.</span></h1>
          <p className={styles.heroText}>Interact with computers, circuits, microcontrollers, and robotic systems in 3D. Disassemble components, inspect how they work, and understand how complete engineering systems connect.</p>
          <div className={styles.heroActions}>
            <Link href="/atlas" className={styles.heroPrimary}>Try web demo <ArrowUpRight size={17} /></Link>
            <Link href="/download" className={styles.heroSecondary}>Windows version <span>Coming soon</span></Link>
          </div>
          <div className={styles.heroFootnote}><span>05 SYSTEMS</span><span>COMPONENT-LEVEL EXPLORATION</span><span>WEB DEMO AVAILABLE</span></div>
        </div>
        <div className={styles.heroVisual}><ProductVisual /></div>
        <a href="#product" className={styles.scrollCue} aria-label="Continue to product overview">Scroll to explore <ArrowDown size={13} /></a>
      </section>

      <section id="product" className={`${styles.section} ${styles.introSection}`}>
        <p className={styles.sectionIndex}>01 / PRODUCT</p>
        <div className={styles.introStatement}>
          <h2>Computer Engineering is easier to understand when you can see how everything connects.</h2>
          <p>CpE Atlas turns complete hardware and electronic systems into an explorable learning environment. Keep the whole assembly in view, open it up, then inspect each part in context.</p>
        </div>
        <div className={styles.questionRail} aria-label="CpE Atlas learning approach">
          {['What is it?', 'How does it work?', 'How does it connect?', 'Why does it matter?'].map((item, index) => <span key={item}><b>0{index + 1}</b>{item}</span>)}
        </div>
      </section>

      <section id="systems" className={`${styles.section} ${styles.systemsSection}`}>
        <div className={styles.sectionHeading}>
          <div><p className={styles.sectionIndex}>02 / SYSTEMS</p><h2>Explore the systems.</h2></div>
          <p>Five disciplines. One consistent way to investigate them.</p>
        </div>
        <div className={styles.systemList}>
          {atlasSystems.map((system, index) => {
            const Icon = systemIcons[index];
            return (
              <Link key={system.id} href={`/atlas?system=${system.id}`} className={styles.systemRow}>
                <span className={styles.systemNumber}>{system.number}</span>
                <span className={styles.systemIcon}><Icon size={28} strokeWidth={1.25} /></span>
                <span className={styles.systemTitle}><small>{system.category}</small><strong>{system.name}</strong></span>
                <span className={styles.systemDescription}>{system.description}</span>
                <span className={styles.systemDetail}>{system.detail}</span>
                <ArrowUpRight className={styles.systemArrow} size={18} />
              </Link>
            );
          })}
        </div>
      </section>

      <section id="features" className={`${styles.section} ${styles.processSection}`}>
        <div className={styles.sectionHeading}><div><p className={styles.sectionIndex}>03 / METHOD</p><h2>From system to understanding.</h2></div></div>
        <div className={styles.processGrid}>
          {[
            [MousePointer2, 'Explore', 'Rotate, zoom, and examine complete engineering systems.'],
            [Layers3, 'Disassemble', 'Separate assemblies while preserving how each part fits.'],
            [ScanSearch, 'Inspect', 'Focus on a component and learn its role and specifications.'],
            [CircuitBoard, 'Understand', 'Trace how parts exchange power, data, and signals.'],
          ].map(([Icon, title, copy], index) => {
            const StepIcon = Icon as typeof MousePointer2;
            return <article key={String(title)} className={styles.processStep}><span className={styles.processTop}><b>0{index + 1}</b><StepIcon size={20} strokeWidth={1.4} /></span><h3>{String(title)}</h3><p>{String(copy)}</p></article>;
          })}
        </div>
      </section>

      <section className={`${styles.section} ${styles.featuredSection}`}>
        <div className={styles.featuredCopy}>
          <p className={styles.sectionIndex}>04 / FEATURED EXPERIENCE</p>
          <h2>Take a computer apart without touching a screwdriver.</h2>
          <p>The Desktop Computer experience keeps the original assembly readable while components move into an exploded layout. Select a part to focus the camera, reveal its role, and understand where it belongs in the complete machine.</p>
          <ol className={styles.sequence}>
            <li><span>01</span> Assembled PC</li><li><span>02</span> Exploded system</li>
            <li><span>03</span> Selected component</li><li><span>04</span> Technical inspector</li>
          </ol>
          <Link href="/atlas?system=desktop" className={styles.inlineLink}>Explore the desktop computer <ArrowRight size={15} /></Link>
        </div>
        <ProductVisual compact />
      </section>

      <section className={`${styles.section} ${styles.capabilitiesSection}`}>
        <div className={styles.sectionHeading}>
          <div><p className={styles.sectionIndex}>05 / SOFTWARE</p><h2>Built for close inspection.</h2></div>
          <p>Tools appear only where the current system supports them.</p>
        </div>
        <div className={styles.capabilityGrid}>
          {[
            [Box, 'Interactive 3D', 'Navigate complete systems through a focused engineering workspace.'],
            [Layers3, 'Exploded views', 'Separate physical assemblies without losing their spatial relationship.'],
            [Focus, 'Camera focus', 'Move smoothly from the full system to a selected component.'],
            [Eye, 'Component inspector', 'Read concise descriptions, specifications, roles, and related parts.'],
            [CircuitBoard, 'System relationships', 'Study the connections that turn individual parts into a working system.'],
            [ScanSearch, 'Technical labels', 'Use restrained labels when they help identify unfamiliar hardware.'],
          ].map(([Icon, title, copy]) => {
            const FeatureIcon = Icon as typeof Box;
            return <article key={String(title)}><FeatureIcon size={19} /><h3>{String(title)}</h3><p>{String(copy)}</p></article>;
          })}
        </div>
      </section>

      <section className={`${styles.section} ${styles.desktopSection}`}>
        <div className={styles.desktopPanel}>
          <div className={styles.desktopIcon}><Monitor size={34} strokeWidth={1.25} /></div>
          <div><p className={styles.sectionIndex}>06 / DESKTOP APPLICATION</p><h2>Built for the desktop.</h2><p>A focused learning environment designed for detailed 3D exploration with mouse and keyboard controls. The Windows application is in development.</p></div>
          <div className={styles.desktopMeta}><span>PLATFORM <b>Windows</b></span><span>STATUS <b>Coming soon</b></span><Link href="/download">View download status <ArrowRight size={14} /></Link></div>
        </div>
      </section>

      <section className={`${styles.section} ${styles.educationSection}`}>
        <p className={styles.sectionIndex}>07 / LEARNING</p>
        <div><h2>See the system,<br />not just the diagram.</h2></div>
        <div><p>CpE Atlas helps learners connect ideas across computer hardware, architecture, electronics, microcontrollers, embedded systems, and robotics.</p><p>It is an interactive companion for classwork, independent study, and the first steps into unfamiliar systems.</p></div>
      </section>

      <section className={styles.finalCta}>
        <p className={styles.eyebrow}><i /> WEB EXPERIENCE AVAILABLE</p>
        <h2>Start exploring from the inside.</h2><p>Open the full CpE Atlas workspace in your browser.</p>
        <Link href="/atlas" className={styles.heroPrimary}>Try web demo <ArrowUpRight size={17} /></Link>
      </section>
      <SiteFooter />
    </main>
  );
}

import Link from 'next/link';
import {
  ArrowRight, ArrowUpRight, Box, CircuitBoard, Eye,
  Focus, Layers3, Monitor, MousePointer2, ScanSearch,
} from 'lucide-react';
import { HomeProduct } from '@/components/marketing/HomeProduct';
import { SiteFooter, SiteHeader } from '@/components/marketing/SiteChrome';
import { SystemShowcase } from '@/components/marketing/SystemShowcase';
import styles from '@/components/marketing/marketing.module.css';

export default function Home() {
  return (
    <main className={`${styles.site} ${styles.home}`} id="main-content" tabIndex={-1}>
      <SiteHeader />
      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <p className={styles.heroBrand}>CpE ATLAS</p>
          <h1>Explore Computer Engineering<br /><span>from the inside out.</span></h1>
          <p className={styles.heroText}>Explore computers, circuits, and robotics in 3D. Look inside each assembly and discover how its components work together.</p>
          <div className={styles.heroActions}>
            <Link href="/atlas" className={styles.heroPrimary}>Launch Atlas <ArrowUpRight size={17} /></Link>
          </div>
        </div>
        <div className={styles.heroVisual}><HomeProduct /></div>
      </section>

      <section id="product" className={`${styles.section} ${styles.introSection}`}>
        <p className={styles.sectionIndex}>01 / PRODUCT</p>
        <div className={styles.introStatement}><h2>Computer Engineering is easier to understand when you can see how everything connects.</h2><p>CpE Atlas turns complete hardware and electronic systems into an explorable learning environment. Keep the assembly in view, open it up, then inspect each part in context.</p></div>
        <div className={styles.relationshipDiagram} aria-label="System learning sequence">
          {['System', 'Component', 'Connection', 'Function'].map((item, index) => <div key={item}><span>0{index + 1}</span><strong>{item}</strong>{index < 3 && <ArrowRight aria-hidden="true" />}</div>)}
        </div>
      </section>

      <section id="systems" className={`${styles.section} ${styles.systemsSection}`}>
        <div className={styles.sectionHeading}><div><p className={styles.sectionIndex}>02 / SYSTEMS</p><h2>Explore the systems<br />behind Computer Engineering.</h2></div><p>Five working modules share one precise interaction language. Choose a system to see its purpose and available tools.</p></div>
        <SystemShowcase />
      </section>

      <section id="features" className={`${styles.section} ${styles.processSection}`}>
        <div className={styles.processIntro}><p className={styles.sectionIndex}>03 / METHOD</p><h2>From system<br />to understanding.</h2><p>A repeatable path for moving from the complete object to the engineering decisions inside it.</p></div>
        <ol className={styles.processTrack}>
          {[[MousePointer2, 'Explore', 'Rotate, zoom, and examine the complete system.'], [Layers3, 'Disassemble', 'Separate its assembly while preserving spatial context.'], [ScanSearch, 'Inspect', 'Focus on a component and read its technical role.'], [CircuitBoard, 'Understand', 'Connect parts through power, data, and signals.']].map(([Icon, title, copy], index) => { const StepIcon = Icon as typeof MousePointer2; return <li key={String(title)}><span>0{index + 1}</span><StepIcon size={22} strokeWidth={1.35} /><div><h3>{String(title)}</h3><p>{String(copy)}</p></div></li>; })}
        </ol>
      </section>

      <section className={styles.featuredSection}>
        <div className={styles.featuredCopy}><p className={styles.sectionIndex}>04 / FEATURED EXPERIENCE</p><h2>Take a computer apart<br />without touching a screwdriver.</h2><p>The flagship Desktop Computer module keeps the full machine readable while every major part moves into a balanced exploded layout.</p>
          <ol className={styles.sequence}><li><span>01</span><div><b>Assembled</b><small>Understand the complete machine.</small></div></li><li><span>02</span><div><b>Explode</b><small>Reveal how physical parts fit together.</small></div></li><li><span>03</span><div><b>Select</b><small>Focus without losing surrounding context.</small></div></li><li><span>04</span><div><b>Understand</b><small>Read the role, specifications, and relationships.</small></div></li></ol>
          <Link href="/atlas?system=desktop" className={styles.inlineLink}>Explore Desktop Computer <ArrowRight size={15} /></Link>
        </div>
      </section>

      <section className={`${styles.section} ${styles.capabilitiesSection}`}>
        <div className={styles.sectionHeading}><div><p className={styles.sectionIndex}>05 / SOFTWARE</p><h2>One workspace.<br />Purpose-built tools.</h2></div><p>The interface adapts to each system and shows only the controls the current module supports.</p></div>
        <div className={styles.capabilityLayout}>
          <article className={styles.capabilityLead}><Box size={24} /><span>3D VIEWPORT</span><h3>The model stays at the center.</h3><p>Navigate a spacious engineering workspace designed around the object, with the component list and technical inspector kept within reach.</p><div className={styles.viewportMini} aria-hidden="true"><i /><i /><i /></div></article>
          <div className={styles.capabilityList}>{[[Eye, 'Component inspector', 'Structured roles, specifications, and related parts.'], [Layers3, 'Exploded view', 'Readable assembly relationships at every distance.'], [Focus, 'Camera focus', 'Smooth movement from the whole system to one part.'], [CircuitBoard, 'System relationships', 'Supported power, data, and signal connections.']].map(([Icon, title, copy]) => { const FeatureIcon = Icon as typeof Eye; return <article key={String(title)}><FeatureIcon size={19} /><div><h3>{String(title)}</h3><p>{String(copy)}</p></div></article>; })}</div>
        </div>
      </section>

      <section className={`${styles.section} ${styles.desktopSection}`}><div className={styles.desktopPanel}><div className={styles.desktopBackdrop} aria-hidden="true"><Monitor size={190} strokeWidth={0.45} /></div><div className={styles.desktopIcon}><Monitor size={34} strokeWidth={1.25} /></div><div><p className={styles.sectionIndex}>06 / DESKTOP APPLICATION</p><h2>A dedicated Atlas<br />is in development.</h2><p>The Windows edition is being prepared as a focused mouse-and-keyboard environment for detailed 3D study.</p></div><div className={styles.desktopMeta}><span>PLATFORM <b>Windows</b></span><span>STATUS <b>Coming soon</b></span><span>WEB ATLAS <b>Available</b></span><Link href="/download">View release status <ArrowRight size={14} /></Link></div></div></section>

      <section className={`${styles.section} ${styles.educationSection}`}><p className={styles.sectionIndex}>07 / LEARNING</p><div><h2>See the system,<br />not just the diagram.</h2></div><div><p>CpE Atlas helps learners connect ideas across hardware, architecture, electronics, microcontrollers, embedded systems, and robotics.</p><p>Use it beside classwork, laboratories, and real hardware when you need to see how a complete system comes together.</p></div></section>

      <section className={styles.finalCta}><p className={styles.eyebrow}><i /> WEB ATLAS AVAILABLE</p><h2>Start exploring<br />from the inside.</h2><p>Five interactive engineering systems are ready in your browser.</p><Link href="/atlas" className={styles.heroPrimary}>Launch Atlas <ArrowUpRight size={17} /></Link></section>
      <SiteFooter />
    </main>
  );
}

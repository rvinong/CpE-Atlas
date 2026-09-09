'use client';
import Link from 'next/link';
import { lazy, Suspense } from 'react';
const AtlasScene = lazy(() => import('@/components/three/AtlasScene'));
import {
  ArrowUpRight,
  ArrowRight,
  Box,
  Bot,
  Cpu,
  CircuitBoard,
  Cable,
  MoveUpRight,
} from 'lucide-react';
export default function Home() {
  return (
    <main className="landing">
      <header className="site-header">
        <Link href="/" className="brand">
          <Box size={27} />
          <span>
            CpE <b>ATLAS</b>
            <small>INTERACTIVE ENGINEERING</small>
          </span>
        </Link>
        <nav>
          <a href="#systems">The systems</a>
          <a href="#how">How it works</a>
          <Link className="header-launch" href="/atlas">
            Open the atlas <ArrowUpRight size={15} />
          </Link>
        </nav>
      </header>
      <section className="hero">
        <div className="hero-copy">
          <div className="eyebrow">
            <span className="status-dot" /> A NEW PERSPECTIVE ON ENGINEERING
          </div>
          <h1>
            Explore Computer
            <br />
            Engineering
            <br />
            <span>from the inside out.</span>
          </h1>
          <p>
            Go beyond the diagram. Get inside the systems that power our world —
            one component, connection, and discovery at a time.
          </p>
          <Link href="/atlas" className="primary-link">
            Launch atlas <ArrowUpRight size={19} />
          </Link>
          <div className="hero-note">
            <span>01 — 05</span> Five systems. A world of connections.
          </div>
        </div>
        <div className="hero-object">
          <div className="hero-object-title">
            <span>FIG. 01 / COMPUTER SYSTEMS</span>
            <span>INTERACTIVE 3D</span>
          </div>
          <div className="hero-canvas">
            <Suspense
              fallback={
                <div className="scene-loading">Preparing 3D preview…</div>
              }
            >
              <AtlasScene preview />
            </Suspense>
          </div>
          <div className="hero-object-caption">
            <span>
              <span className="status-dot" /> DESKTOP COMPUTER
            </span>
            <span>10 CORE COMPONENTS</span>
          </div>
        </div>
      </section>
      <section id="systems" className="systems-section">
        <div className="section-heading">
          <div>
            <div className="eyebrow">YOUR FIELD GUIDE</div>
            <h2>Start with a system.</h2>
          </div>
          <p>From complete machines to the circuits within.</p>
        </div>
        <div className="system-cards">
          {[
            {
              id: 'desktop',
              n: '01',
              name: 'Desktop Computer',
              type: 'COMPUTER SYSTEMS',
              icon: Box,
              description:
                'The complete picture. Inside the everyday computer.',
            },
            {
              id: 'motherboard',
              n: '02',
              name: 'Motherboard',
              type: 'ELECTRONICS',
              icon: CircuitBoard,
              description: 'Where processing, memory, and connectivity meet.',
            },
            {
              id: 'arduino',
              n: '03',
              name: 'Arduino Uno',
              type: 'MICROCONTROLLERS',
              icon: Cpu,
              description: 'A small board. An open world of possibilities.',
            },
            {
              id: 'rectifier',
              n: '04',
              name: 'Bridge Rectifier',
              type: 'CIRCUITS',
              icon: Cable,
              description:
                'Follow the conversion from alternating to direct current.',
            },
            {
              id: 'robot',
              n: '05',
              name: 'Line Follower Robot',
              type: 'ROBOTICS',
              icon: Bot,
              description:
                'Arduino Autonomous Mobile Robot. From sensing to motion.',
            },
          ].map((s) => (
            <Link
              className="system-card"
              href={`/atlas?system=${s.id}`}
              key={s.id}
            >
              <div className="card-top">
                <span>
                  {s.n} / {s.type}
                </span>
                <MoveUpRight size={17} />
              </div>
              <s.icon className="system-icon" size={46} strokeWidth={1} />
              <h3>{s.name}</h3>
              <p>{s.description}</p>
              <span className="card-bottom">
                Explore system <ArrowRight size={15} />
              </span>
            </Link>
          ))}
        </div>
      </section>
      <section id="how" className="how-section">
        <div>
          <div className="eyebrow">LEARNING, IN ANOTHER DIMENSION</div>
          <h2>
            Take it apart.
            <br />
            Put it together.
          </h2>
        </div>
        {[
          {
            n: '01',
            title: 'Explore freely',
            text: 'Rotate, zoom, and see the system from a new angle.',
          },
          {
            n: '02',
            title: 'Look closer',
            text: 'Select a component. Understand its role and connections.',
          },
          {
            n: '03',
            title: 'Connect the dots',
            text: 'Separate the assembly and see how the pieces fit.',
          },
        ].map((s) => (
          <div className="how-step" key={s.n}>
            <span>{s.n}</span>
            <h3>{s.title}</h3>
            <p>{s.text}</p>
          </div>
        ))}
      </section>
      <section className="final-cta">
        <span className="eyebrow">BUILT FOR CURIOUS MINDS</span>
        <h2>Understanding starts inside.</h2>
        <Link href="/atlas" className="primary-link">
          Enter CpE Atlas <ArrowUpRight size={18} />
        </Link>
      </section>
      <footer>
        <span>
          CpE ATLAS{' '}
          <span className="muted">
            / An interactive field guide to Computer Engineering
          </span>
        </span>
        <span>EXPLORE. UNDERSTAND. BUILD.</span>
      </footer>
    </main>
  );
}

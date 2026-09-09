'use client';
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/click-events-have-key-events -- Delegated dismissal preserves native link keyboard behavior. */
import type { ReactNode } from 'react';

export function MobileMenu({ className, children }: { className: string; children: ReactNode }) {
  return <details className={className}
    onKeyDown={event => { if (event.key === 'Escape') { event.currentTarget.open = false; event.currentTarget.querySelector('summary')?.focus(); } }}
    onClick={event => { if ((event.target as HTMLElement).closest('a')) event.currentTarget.open = false; }}>
    {children}
  </details>;
}

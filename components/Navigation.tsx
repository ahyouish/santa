'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Sparkles, Send, Truck, RotateCcw } from 'lucide-react';
import { getWishes, resetDefaultWishes, Wish } from '@/lib/store';

export default function Navigation() {
  const pathname = usePathname();
  const [wishes, setWishes] = useState<Wish[]>([]);

  useEffect(() => {
    setWishes(getWishes());
    const handler = (e: CustomEvent<Wish[]>) => {
      setWishes(e.detail || getWishes());
    };
    window.addEventListener('wish-store-updated' as unknown as string, handler as EventListener);
    return () => {
      window.removeEventListener('wish-store-updated' as unknown as string, handler as EventListener);
    };
  }, []);

  const pendingCount = wishes.filter((w) => w.status === 'pending').length;

  const handleReset = () => {
    if (confirm('Reset wish list to default sample records?')) {
      const reset = resetDefaultWishes();
      setWishes(reset);
    }
  };

  return (
    <header className="top-nav">
      <Link href="/" className="nav-brand">
        <span className="nav-brand-logo">🎄</span>
        <div>
          <span className="nav-brand-title">Santa Wish System</span>
        </div>
      </Link>

      <nav className="nav-links" aria-label="Portal Navigation">
        <Link
          href="/"
          className={`nav-pill ${pathname === '/' ? 'active' : ''}`}
          id="nav-home-btn"
        >
          <LayoutDashboard size={15} />
          <span>Dashboard Hub</span>
        </Link>

        <Link
          href="/santa"
          className={`nav-pill ${pathname === '/santa' ? 'active' : ''}`}
          id="nav-santa-btn"
        >
          <Sparkles size={15} />
          <span>Santa Admin</span>
          {pendingCount > 0 && (
            <span className="nav-counter-pill">{pendingCount}</span>
          )}
        </Link>

        <Link
          href="/child"
          className={`nav-pill ${pathname === '/child' ? 'active' : ''}`}
          id="nav-child-btn"
        >
          <Send size={15} />
          <span>Child Portal</span>
        </Link>

        <Link
          href="/delivery"
          className={`nav-pill ${pathname === '/delivery' ? 'active' : ''}`}
          id="nav-delivery-btn"
        >
          <Truck size={15} />
          <span>Delivery</span>
        </Link>
      </nav>

      <div className="nav-actions">
        <button
          type="button"
          onClick={handleReset}
          className="nav-btn-minimal"
          title="Reset to sample data"
          id="reset-wishes-btn"
        >
          <RotateCcw size={13} />
          <span>Reset Demo Data</span>
        </button>
      </div>
    </header>
  );
}

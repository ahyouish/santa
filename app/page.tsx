'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles, Send, Truck } from 'lucide-react';
import './dashboard.css';
import { getWishes, Wish } from '@/lib/store';

export default function DashboardHub() {
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

  const totalWishes = wishes.length;
  const pendingCount = wishes.filter((w) => w.status === 'pending').length;
  const approvedCount = wishes.filter((w) => w.status === 'approved').length;
  const deliveredCount = wishes.filter((w) => w.deliveryStatus === 'delivered').length;

  return (
    <div className="dashboard-page-container">
      <div className="dashboard-backdrop-tint" />

      <div className="dashboard-content-wrap">
        {/* Header */}
        <section className="dashboard-hero-section">
          <div className="dashboard-category-badge">
            <span>🎄 North Pole Operations</span>
          </div>
          <h1 className="dashboard-main-title">Christmas Wish Management System</h1>
          <p className="dashboard-main-subtitle">
            Select a portal to manage incoming wishes, review letters, or track delivery logistics.
          </p>
        </section>

        {/* Metrics Strip */}
        <div className="metrics-strip">
          <div className="metric-card">
            <div className="metric-number">{totalWishes}</div>
            <div className="metric-label">Total Wishes Received</div>
          </div>
          <div className="metric-card">
            <div className="metric-number" style={{ color: '#ffd56b' }}>{pendingCount}</div>
            <div className="metric-label">Pending Review</div>
          </div>
          <div className="metric-card">
            <div className="metric-number" style={{ color: '#86efac' }}>{approvedCount}</div>
            <div className="metric-label">Approved for Workshop</div>
          </div>
          <div className="metric-card">
            <div className="metric-number" style={{ color: '#c4b5fd' }}>{deliveredCount}</div>
            <div className="metric-label">Delivered Down Chimneys</div>
          </div>
        </div>

        {/* 3 Main Portal Cards */}
        <div className="portals-container">
          {/* 1. SANTA ADMIN */}
          <Link href="/santa" className="portal-nav-card" id="portal-card-santa">
            <div className="portal-icon-wrap">
              <span>🎅</span>
            </div>
            <h2 className="portal-card-title">Santa Admin Dashboard</h2>
            <p className="portal-card-desc">
              Primary administrative workstation. Review wish requests, inspect automated AI safety checks, and approve or reject submissions.
            </p>
            <span className="portal-link-btn">
              <span>Open Santa Dashboard</span>
              <ArrowRight size={15} />
            </span>
          </Link>

          {/* 2. CHILD PORTAL */}
          <Link href="/child" className="portal-nav-card" id="portal-card-child">
            <div className="portal-icon-wrap">
              <span>✉️</span>
            </div>
            <h2 className="portal-card-title">Child Wish Portal</h2>
            <p className="portal-card-desc">
              Direct wish submission letter for children. Provides input for age, good deeds, gift category, and live safety validation.
            </p>
            <span className="portal-link-btn">
              <span>Open Child Portal</span>
              <ArrowRight size={15} />
            </span>
          </Link>

          {/* 3. DELIVERY TRACKER */}
          <Link href="/delivery" className="portal-nav-card" id="portal-card-delivery">
            <div className="portal-icon-wrap">
              <span>🛷</span>
            </div>
            <h2 className="portal-card-title">Elf Sleigh &amp; Delivery</h2>
            <p className="portal-card-desc">
              Workshop dispatch pipeline. Track approved wishes through Workshop crafting, Gift Wrapping, Sleigh loading, and Final delivery.
            </p>
            <span className="portal-link-btn">
              <span>Open Delivery Tracker</span>
              <ArrowRight size={15} />
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}

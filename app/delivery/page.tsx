'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Truck, ArrowRight, CheckCircle2, ArrowLeft } from 'lucide-react';
import './delivery.css';
import { getWishes, updateDeliveryProgress, Wish } from '@/lib/store';

export default function DeliveryPage() {
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

  const approvedWishes = useMemo(() => {
    return wishes.filter((w) => w.status === 'approved');
  }, [wishes]);

  const workshopGifts = approvedWishes.filter((w) => !w.deliveryStatus || w.deliveryStatus === 'workshop');
  const wrappingGifts = approvedWishes.filter((w) => w.deliveryStatus === 'wrapping');
  const loadedGifts = approvedWishes.filter((w) => w.deliveryStatus === 'loaded');
  const deliveredGifts = approvedWishes.filter((w) => w.deliveryStatus === 'delivered');

  const handleAdvance = (wish: Wish) => {
    let nextStage: Wish['deliveryStatus'] = 'wrapping';
    let progress = 50;

    if (!wish.deliveryStatus || wish.deliveryStatus === 'workshop') {
      nextStage = 'wrapping';
      progress = 50;
    } else if (wish.deliveryStatus === 'wrapping') {
      nextStage = 'loaded';
      progress = 75;
    } else if (wish.deliveryStatus === 'loaded') {
      nextStage = 'delivered';
      progress = 100;
    } else {
      return;
    }

    updateDeliveryProgress(wish.id, nextStage, progress);
  };

  return (
    <div className="delivery-page-container">
      <div className="delivery-backdrop-tint" />

      <div className="delivery-content-wrap">
        {/* Top Status Bar with Back to Dashboard Button */}
        <div className="delivery-top-bar">
          <Link href="/" className="back-btn-pill" id="btn-back-dashboard">
            <ArrowLeft size={16} />
            <span>Back to Dashboard</span>
          </Link>
          <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', fontWeight: 700, color: '#ffffff' }}>
            Elf Workshop &amp; Sleigh Flight Command
          </span>
        </div>

        <header className="delivery-header-block">
          <h1 className="delivery-main-title">Workshop &amp; Delivery Logistics</h1>
          <p className="delivery-main-desc">
            Track approved wishes across assembly, packaging, sleigh loading, and delivery.
          </p>
        </header>

        {/* Metrics Strip */}
        <div className="delivery-stats-row">
          <div className="delivery-stat-box">
            <div className="delivery-stat-val">{approvedWishes.length}</div>
            <div className="delivery-stat-lbl">Total Approved Wishes</div>
          </div>
          <div className="delivery-stat-box">
            <div className="delivery-stat-val" style={{ color: '#ffd56b' }}>{workshopGifts.length}</div>
            <div className="delivery-stat-lbl">In Workshop Crafting</div>
          </div>
          <div className="delivery-stat-box">
            <div className="delivery-stat-val" style={{ color: '#86efac' }}>{loadedGifts.length}</div>
            <div className="delivery-stat-lbl">Loaded on Sleigh</div>
          </div>
          <div className="delivery-stat-box">
            <div className="delivery-stat-val" style={{ color: '#c4b5fd' }}>{deliveredGifts.length}</div>
            <div className="delivery-stat-lbl">Successfully Delivered</div>
          </div>
        </div>

        {/* 4-Stage Kanban */}
        <div className="delivery-columns-grid">
          {/* 1. WORKSHOP */}
          <div className="kanban-col">
            <div className="kanban-col-head">
              <span className="kanban-col-title">🔨 1. Toy Workshop</span>
              <span className="kanban-col-count">{workshopGifts.length}</span>
            </div>
            <div className="kanban-cards-stack">
              {workshopGifts.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem 1rem', color: '#968183', fontSize: '0.84rem' }}>
                  <p>No gifts currently in assembly.</p>
                  <Link
                    href="/santa"
                    style={{ color: '#781019', textDecoration: 'underline', marginTop: '0.4rem', display: 'inline-block' }}
                  >
                    Approve wishes on Santa&apos;s Desk &rarr;
                  </Link>
                </div>
              ) : (
                workshopGifts.map((wish) => (
                  <div key={wish.id} className="delivery-gift-card">
                    <div className="delivery-card-header">
                      <div className="delivery-avatar">
                        <Image
                          src={wish.avatar || '/avatars/tom.jpg'}
                          alt={wish.childName}
                          width={40}
                          height={40}
                          style={{ objectFit: 'cover' }}
                        />
                      </div>
                      <div className="delivery-card-names">
                        <h4>{wish.childName} (Age {wish.age})</h4>
                        <p>{wish.location}</p>
                      </div>
                    </div>

                    <p className="delivery-wish-text">&ldquo;{wish.wishText}&rdquo; {wish.emoji}</p>

                    <div className="delivery-card-foot">
                      <span>{wish.elfAssigned || 'Workshop Unit'}</span>
                      <button
                        type="button"
                        onClick={() => handleAdvance(wish)}
                        className="btn-step-advance"
                      >
                        <span>To Wrapping</span>
                        <ArrowRight size={12} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* 2. WRAPPING */}
          <div className="kanban-col">
            <div className="kanban-col-head">
              <span className="kanban-col-title">🎁 2. Gift Wrapping</span>
              <span className="kanban-col-count">{wrappingGifts.length}</span>
            </div>
            <div className="kanban-cards-stack">
              {wrappingGifts.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem 1rem', color: '#968183', fontSize: '0.84rem' }}>
                  <p>No gifts waiting to be wrapped.</p>
                </div>
              ) : (
                wrappingGifts.map((wish) => (
                  <div key={wish.id} className="delivery-gift-card">
                    <div className="delivery-card-header">
                      <div className="delivery-avatar">
                        <Image
                          src={wish.avatar || '/avatars/tom.jpg'}
                          alt={wish.childName}
                          width={40}
                          height={40}
                          style={{ objectFit: 'cover' }}
                        />
                      </div>
                      <div className="delivery-card-names">
                        <h4>{wish.childName} (Age {wish.age})</h4>
                        <p>{wish.location}</p>
                      </div>
                    </div>

                    <p className="delivery-wish-text">&ldquo;{wish.wishText}&rdquo; {wish.emoji}</p>

                    <div className="delivery-card-foot">
                      <span>Packaging</span>
                      <button
                        type="button"
                        onClick={() => handleAdvance(wish)}
                        className="btn-step-advance"
                      >
                        <span>To Sleigh</span>
                        <ArrowRight size={12} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* 3. SLEIGH LOADED */}
          <div className="kanban-col">
            <div className="kanban-col-head">
              <span className="kanban-col-title">🛷 3. Loaded on Sleigh</span>
              <span className="kanban-col-count">{loadedGifts.length}</span>
            </div>
            <div className="kanban-cards-stack">
              {loadedGifts.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem 1rem', color: '#968183', fontSize: '0.84rem' }}>
                  <p>Sleigh cargo is clear.</p>
                </div>
              ) : (
                loadedGifts.map((wish) => (
                  <div key={wish.id} className="delivery-gift-card">
                    <div className="delivery-card-header">
                      <div className="delivery-avatar">
                        <Image
                          src={wish.avatar || '/avatars/tom.jpg'}
                          alt={wish.childName}
                          width={40}
                          height={40}
                          style={{ objectFit: 'cover' }}
                        />
                      </div>
                      <div className="delivery-card-names">
                        <h4>{wish.childName} (Age {wish.age})</h4>
                        <p>{wish.location}</p>
                      </div>
                    </div>

                    <p className="delivery-wish-text">&ldquo;{wish.wishText}&rdquo; {wish.emoji}</p>

                    <div className="delivery-card-foot">
                      <span>Sleigh Manifest</span>
                      <button
                        type="button"
                        onClick={() => handleAdvance(wish)}
                        className="btn-step-advance"
                        style={{ background: '#1e7e34' }}
                      >
                        <span>Mark Delivered</span>
                        <ArrowRight size={12} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* 4. DELIVERED */}
          <div className="kanban-col">
            <div className="kanban-col-head">
              <span className="kanban-col-title">🎄 4. Delivered</span>
              <span className="kanban-col-count">{deliveredGifts.length}</span>
            </div>
            <div className="kanban-cards-stack">
              {deliveredGifts.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem 1rem', color: '#968183', fontSize: '0.84rem' }}>
                  <p>No completed deliveries yet.</p>
                </div>
              ) : (
                deliveredGifts.map((wish) => (
                  <div key={wish.id} className="delivery-gift-card" style={{ background: '#f5faf6', borderColor: '#bce3c5' }}>
                    <div className="delivery-card-header">
                      <div className="delivery-avatar">
                        <Image
                          src={wish.avatar || '/avatars/tom.jpg'}
                          alt={wish.childName}
                          width={40}
                          height={40}
                          style={{ objectFit: 'cover' }}
                        />
                      </div>
                      <div className="delivery-card-names">
                        <h4>{wish.childName} (Age {wish.age})</h4>
                        <p>{wish.location}</p>
                      </div>
                    </div>

                    <p className="delivery-wish-text">&ldquo;{wish.wishText}&rdquo; {wish.emoji}</p>

                    <div className="delivery-card-foot" style={{ borderTop: 'none', paddingTop: 0 }}>
                      <span style={{ color: '#166534', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                        <CheckCircle2 size={14} color="#166534" />
                        Delivered Under Tree
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

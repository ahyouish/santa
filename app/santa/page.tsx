'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Gift,
  FileText,
  Truck,
  User,
  Search,
  Check,
  X,
  Clock,
  ChevronRight,
  Home,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  ArrowLeft
} from 'lucide-react';
import './santa.css';
import { getWishes, updateWishStatus, Wish } from '@/lib/store';

export default function SantaPage() {
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [selectedId, setSelectedId] = useState<string>('wish-1');
  const [activeFilter, setActiveFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [activeSidebarTab, setActiveSidebarTab] = useState<'wishes' | 'naughty' | 'deliveries' | 'profile'>('wishes');
  const [searchQuery, setSearchQuery] = useState('');
  const [feedback, setFeedback] = useState<{ text: string; type: 'approved' | 'rejected' } | null>(null);

  useEffect(() => {
    const list = getWishes();
    setWishes(list);
    if (list.length > 0 && !list.find((w) => w.id === selectedId)) {
      setSelectedId(list[0].id);
    }

    const handler = (e: CustomEvent<Wish[]>) => {
      const updated = e.detail || getWishes();
      setWishes(updated);
    };

    window.addEventListener('wish-store-updated' as unknown as string, handler as EventListener);
    return () => {
      window.removeEventListener('wish-store-updated' as unknown as string, handler as EventListener);
    };
  }, [selectedId]);

  const filteredWishes = useMemo(() => {
    return wishes.filter((wish) => {
      if (activeSidebarTab === 'naughty') {
        if (wish.listType !== 'naughty' && wish.safetyStatus !== 'flagged') return false;
      }

      if (activeFilter !== 'all' && wish.status !== activeFilter) {
        return false;
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = wish.childName.toLowerCase().includes(q);
        const matchWish = wish.wishText.toLowerCase().includes(q);
        return matchName || matchWish;
      }

      return true;
    });
  }, [wishes, activeFilter, activeSidebarTab, searchQuery]);

  const selectedWish = useMemo(() => {
    return wishes.find((w) => w.id === selectedId) || wishes[0] || null;
  }, [wishes, selectedId]);

  const handleApprove = () => {
    if (!selectedWish) return;
    updateWishStatus(selectedWish.id, 'approved');
    setFeedback({
      text: `Approved: ${selectedWish.childName}'s wish added to workshop queue.`,
      type: 'approved'
    });
    setTimeout(() => setFeedback(null), 3500);
  };

  const handleReject = () => {
    if (!selectedWish) return;
    updateWishStatus(selectedWish.id, 'rejected');
    setFeedback({
      text: `Rejected: ${selectedWish.childName}'s wish marked as declined.`,
      type: 'rejected'
    });
    setTimeout(() => setFeedback(null), 3500);
  };

  const pendingCount = wishes.filter((w) => w.status === 'pending').length;
  const approvedCount = wishes.filter((w) => w.status === 'approved').length;

  return (
    <div className="santa-page-container">
      <div className="santa-backdrop-tint" />

      <div className="santa-content-wrap">
        {/* Top Status Bar with deep red, white text, and Back to Dashboard */}
        <div className="santa-top-statusbar">
          <div className="santa-status-left">
            <Link href="/" className="back-to-dashboard-btn" id="btn-back-dashboard">
              <ArrowLeft size={16} />
              <span>Back to Dashboard</span>
            </Link>

            <span className="santa-brand-pill">
              <Sparkles size={13} /> Santa Admin
            </span>
            <span className="santa-status-title">North Pole Wish Management</span>
          </div>

          <div className="santa-status-metrics">
            <div className="status-metric-chip">
              <Clock size={14} color="#ffd56b" />
              <span><strong>{pendingCount}</strong> Pending Review</span>
            </div>
            <div className="status-metric-chip">
              <Truck size={14} color="#86efac" />
              <span><strong>{approvedCount}</strong> In Production</span>
            </div>
          </div>
        </div>

        {/* The Three Areas Grid matching the mockup */}
        <div className="santa-dashboard-grid">
          {/* ================= 1. SIDEBAR ================= */}
          <aside className="santa-sidebar-card" aria-label="Santa Admin Sidebar">
            <div className="sidebar-header">
              <div className="sidebar-logo-icon">
                <Home size={22} color="#ffffff" />
              </div>
              <div className="sidebar-header-title">
                Santa&apos;s<br />Portal
              </div>
            </div>

            <ul className="sidebar-nav-list">
              <li>
                <button
                  type="button"
                  onClick={() => {
                    setActiveSidebarTab('wishes');
                    setActiveFilter('all');
                  }}
                  className={`sidebar-nav-item ${activeSidebarTab === 'wishes' ? 'active' : ''}`}
                  id="sidebar-wishes-btn"
                >
                  <div className="sidebar-nav-label">
                    <Gift size={18} />
                    <span>Wishes</span>
                  </div>
                  {pendingCount > 0 && (
                    <span className="sidebar-badge">{pendingCount}</span>
                  )}
                </button>
              </li>

              <li>
                <button
                  type="button"
                  onClick={() => {
                    setActiveSidebarTab('naughty');
                    setActiveFilter('all');
                  }}
                  className={`sidebar-nav-item ${activeSidebarTab === 'naughty' ? 'active' : ''}`}
                  id="sidebar-naughty-btn"
                >
                  <div className="sidebar-nav-label">
                    <FileText size={18} />
                    <span>Naughty List</span>
                  </div>
                </button>
              </li>

              <li>
                <Link
                  href="/delivery"
                  className="sidebar-nav-item"
                  id="sidebar-deliveries-btn"
                >
                  <div className="sidebar-nav-label">
                    <Truck size={18} />
                    <span>Deliveries</span>
                  </div>
                </Link>
              </li>

              <li>
                <button
                  type="button"
                  onClick={() => setActiveSidebarTab('profile')}
                  className={`sidebar-nav-item ${activeSidebarTab === 'profile' ? 'active' : ''}`}
                  id="sidebar-profile-btn"
                >
                  <div className="sidebar-nav-label">
                    <User size={18} />
                    <span>Profile</span>
                  </div>
                </button>
              </li>
            </ul>
          </aside>

          {/* ================= 2. MAIN WISH REQUESTS ================= */}
          <section className="santa-main-card" aria-labelledby="main-requests-title">
            <div className="main-card-top">
              <div className="main-title-block">
                <h1 id="main-requests-title">
                  {activeSidebarTab === 'naughty' ? 'The Naughty List' : 'Wish Requests'}
                </h1>
                <p>Review the wishes from children around the world.</p>
              </div>

              <div className="main-controls-block">
                <div className="search-box-wrap">
                  <Search size={15} className="search-box-icon" />
                  <input
                    type="text"
                    placeholder="Search by name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    id="search-wishes-input"
                    aria-label="Search wishes"
                  />
                </div>

                <div className="status-filter-group" role="tablist">
                  {(['all', 'pending', 'approved', 'rejected'] as const).map((tab) => (
                    <button
                      key={tab}
                      type="button"
                      role="tab"
                      aria-selected={activeFilter === tab}
                      onClick={() => setActiveFilter(tab)}
                      className={`filter-btn ${activeFilter === tab ? 'active' : ''}`}
                      id={`filter-${tab}-btn`}
                    >
                      {tab === 'all' ? 'All' : tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="wishes-table-list" role="list">
              {filteredWishes.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#887476' }}>
                  <p>No wishes found matching your criteria.</p>
                </div>
              ) : (
                filteredWishes.map((wish) => {
                  const isSelected = selectedWish?.id === wish.id;
                  return (
                    <div
                      key={wish.id}
                      role="listitem"
                      tabIndex={0}
                      onClick={() => setSelectedId(wish.id)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          setSelectedId(wish.id);
                        }
                      }}
                      className={`wish-table-row ${isSelected ? 'selected' : ''}`}
                      id={`wish-row-${wish.id}`}
                    >
                      <div className="row-avatar-box">
                        <Image
                          src={wish.avatar || '/avatars/tom.jpg'}
                          alt={wish.childName}
                          width={48}
                          height={48}
                          className="row-avatar-img"
                        />
                      </div>

                      <div className="row-meta">
                        <span className="row-name">{wish.childName}</span>
                        <span className="row-age">Age {wish.age}</span>
                      </div>

                      <div className="row-wish-text">
                        <span>{wish.wishText}</span>
                        <span className="row-emoji">{wish.emoji}</span>
                      </div>

                      <div>
                        {wish.status === 'pending' && (
                          <span className="badge-status pending">
                            <Clock size={13} />
                            Pending
                          </span>
                        )}
                        {wish.status === 'approved' && (
                          <span className="badge-status approved">
                            <Check size={13} />
                            Approved
                          </span>
                        )}
                        {wish.status === 'rejected' && (
                          <span className="badge-status rejected">
                            <X size={13} />
                            Rejected
                          </span>
                        )}
                      </div>

                      <ChevronRight size={18} className="row-arrow" />
                    </div>
                  );
                })
              )}
            </div>
          </section>

          {/* ================= 3. RIGHT PANEL (WISH DETAILS) ================= */}
          <aside className="santa-details-card" aria-label="Selected Wish Details">
            <h2 className="details-card-title">Wish Details</h2>

            {selectedWish ? (
              <>
                {feedback && (
                  <div className={`status-feedback-banner ${feedback.type}`}>
                    {feedback.type === 'approved' ? <CheckCircle2 size={16} /> : <AlertTriangle size={16} />}
                    <span>{feedback.text}</span>
                  </div>
                )}

                {/* Child Information */}
                <div className="details-profile-header">
                  <div className="details-profile-left">
                    <div className="details-avatar-circle">
                      <Image
                        src={selectedWish.avatar || '/avatars/tom.jpg'}
                        alt={selectedWish.childName}
                        width={64}
                        height={64}
                        className="details-avatar-img"
                      />
                    </div>
                    <div className="details-profile-info">
                      <h3>{selectedWish.childName}</h3>
                      <p>Age {selectedWish.age}</p>
                    </div>
                  </div>

                  <div>
                    {selectedWish.listType === 'naughty' ? (
                      <span className="badge-list-type naughty">Naughty List</span>
                    ) : (
                      <span className="badge-list-type good">
                        <Check size={14} strokeWidth={2.5} />
                        Good List
                      </span>
                    )}
                  </div>
                </div>

                {/* Wish Description */}
                <div>
                  <div className="details-section-label">Wish</div>
                  <div className="details-wish-quote-card">
                    <p className="details-wish-text">
                      &ldquo;{selectedWish.wishText}&rdquo;
                    </p>
                    <span className="details-wish-emoji">{selectedWish.emoji}</span>
                  </div>
                </div>

                {/* AI Safety Check */}
                <div>
                  <div className="details-section-label">Safety Check</div>
                  <div className="details-safety-block">
                    <div className={`safety-check-icon ${selectedWish.safetyStatus === 'safe' ? 'safe' : 'flagged'}`}>
                      {selectedWish.safetyStatus === 'safe' ? (
                        <Check size={18} strokeWidth={2.5} />
                      ) : (
                        <AlertTriangle size={18} strokeWidth={2.5} />
                      )}
                    </div>
                    <div>
                      <div className={`safety-status-title ${selectedWish.safetyStatus === 'safe' ? 'safe' : 'flagged'}`}>
                        {selectedWish.safetyStatus === 'safe' ? 'Safe' : 'Safety Concern'}
                      </div>
                      <p className="safety-status-desc">
                        {selectedWish.safetyReason || 'No harmful or inappropriate content detected.'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Santa's Decision: Approve / Reject */}
                <div className="details-decision-block">
                  <div className="details-section-label">Santa&apos;s Decision</div>
                  <div className="decision-btn-row">
                    <button
                      type="button"
                      onClick={handleApprove}
                      className="btn-act btn-act-approve"
                      id="btn-approve-wish"
                    >
                      <Check size={17} strokeWidth={2.5} />
                      <span>Approve</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleReject}
                      className="btn-act btn-act-reject"
                      id="btn-reject-wish"
                    >
                      <X size={17} strokeWidth={2.5} />
                      <span>Reject</span>
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <p style={{ color: '#887476', fontSize: '0.9rem' }}>
                Select a wish to view full details.
              </p>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}

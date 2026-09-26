'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Send, CheckCircle2, ShieldAlert, Clock, Check, ArrowLeft, Sparkles } from 'lucide-react';
import './child.css';
import { addWish, getWishes, Wish } from '@/lib/store';

const CATEGORIES = [
  { label: 'Toys & Games', emoji: '🏎️' },
  { label: 'Books & Science', emoji: '🔭' },
  { label: 'Arts & Crafts', emoji: '🎨' },
  { label: 'Tech & Gadgets', emoji: '🚁' },
  { label: 'Plush & Bedtime', emoji: '🧸' }
];

export default function ChildPage() {
  const [childName, setChildName] = useState('');
  const [age, setAge] = useState('8');
  const [location, setLocation] = useState('');
  const [behavior, setBehavior] = useState<'good' | 'naughty'>('good');
  const [goodDeeds, setGoodDeeds] = useState('');
  const [wishText, setWishText] = useState('');
  const [category, setCategory] = useState('Toys & Games');
  const [avatar, setAvatar] = useState('/avatars/tom.jpg');
  const [submitted, setSubmitted] = useState(false);
  const [recentWishes, setRecentWishes] = useState<Wish[]>([]);

  useEffect(() => {
    setRecentWishes(getWishes());
    const handler = (e: CustomEvent<Wish[]>) => {
      setRecentWishes(e.detail || getWishes());
    };
    window.addEventListener('wish-store-updated' as unknown as string, handler as EventListener);
    return () => {
      window.removeEventListener('wish-store-updated' as unknown as string, handler as EventListener);
    };
  }, []);

  const safetyEvaluation = useMemo(() => {
    const text = (wishText || '').toLowerCase();
    const flags = ['gun', 'weapon', 'slingshot', 'hurt', 'fight', 'knife', 'explosive'];
    const matched = flags.filter((f) => text.includes(f));
    if (matched.length > 0) {
      return {
        safe: false,
        msg: `Safety Alert: "${matched.join(', ')}" detected. Please keep wishes positive and safe.`
      };
    }
    return {
      safe: true,
      msg: 'Safety Check: Content verified appropriate and child-friendly.'
    };
  }, [wishText]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!childName.trim() || !wishText.trim()) return;

    const matchedCat = CATEGORIES.find((c) => c.label === category);
    const emoji = matchedCat ? matchedCat.emoji : '🎁';

    addWish({
      childName: childName.trim(),
      age: parseInt(age, 10) || 8,
      location: location.trim() || 'Global',
      wishText: wishText.trim(),
      category,
      emoji,
      safetyStatus: safetyEvaluation.safe ? 'safe' : 'flagged',
      safetyReason: safetyEvaluation.safe
        ? 'No harmful content detected. Appropriate and wholesome.'
        : 'Safety concern flagged for Santa review.',
      listType: behavior,
      avatar,
      goodDeeds: goodDeeds.trim() || 'Good behavior recorded.'
    });

    setSubmitted(true);
    setWishText('');
    setGoodDeeds('');
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <div className="child-portal-container">
      <div className="child-backdrop-tint" />

      <div className="child-content-wrap">
        {/* Top Status Bar with Back to Dashboard Button */}
        <div className="child-top-bar">
          <Link href="/" className="back-btn-pill" id="btn-back-dashboard">
            <ArrowLeft size={16} />
            <span>Back to Dashboard</span>
          </Link>
          <span className="child-top-title">Child Wish Letter Portal</span>
        </div>

        <header className="child-portal-header">
          <h1 className="child-portal-title">Send a Wish to Santa</h1>
          <p className="child-portal-subtitle">
            Submit your holiday wish directly to Santa Claus at the North Pole.
          </p>
        </header>

        <div className="child-portal-grid">
          <section className="letter-form-card">
            <h2 className="letter-form-title">Holiday Wish Submission Form</h2>

            <form onSubmit={handleSubmit}>
              <div className="form-two-cols form-group-item">
                <div>
                  <label className="field-label" htmlFor="f-name">Child&apos;s Name</label>
                  <input
                    id="f-name"
                    type="text"
                    required
                    placeholder="e.g. Oliver, Chloe"
                    value={childName}
                    onChange={(e) => setChildName(e.target.value)}
                    className="field-input"
                  />
                </div>

                <div>
                  <label className="field-label" htmlFor="f-age">Age</label>
                  <select
                    id="f-age"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="field-select"
                  >
                    {[4, 5, 6, 7, 8, 9, 10, 11, 12, 13].map((n) => (
                      <option key={n} value={n}>
                        {n} Years Old
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-two-cols form-group-item">
                <div>
                  <label className="field-label" htmlFor="f-loc">Location</label>
                  <input
                    id="f-loc"
                    type="text"
                    placeholder="City, Country"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="field-input"
                  />
                </div>

                <div>
                  <label className="field-label" htmlFor="f-behavior">Behavior</label>
                  <select
                    id="f-behavior"
                    value={behavior}
                    onChange={(e) => setBehavior(e.target.value as 'good' | 'naughty')}
                    className="field-select"
                  >
                    <option value="good">Good List</option>
                    <option value="naughty">Naughty List</option>
                  </select>
                </div>
              </div>

              {/* Avatar Selection */}
              <div className="form-group-item">
                <label className="field-label">Choose Avatar</label>
                <div style={{ display: 'flex', gap: '0.65rem' }}>
                  {[
                    { src: '/avatars/tom.jpg', name: 'Tom' },
                    { src: '/avatars/emma.jpg', name: 'Emma' },
                    { src: '/avatars/jack.jpg', name: 'Jack' },
                    { src: '/avatars/mia.jpg', name: 'Mia' },
                    { src: '/avatars/alex.jpg', name: 'Alex' }
                  ].map((av) => (
                    <button
                      key={av.src}
                      type="button"
                      onClick={() => setAvatar(av.src)}
                      style={{
                        borderRadius: '50%',
                        overflow: 'hidden',
                        width: 44,
                        height: 44,
                        border: avatar === av.src ? '3px solid #781019' : '1.5px solid #e8dccb',
                        padding: 0,
                        background: 'none'
                      }}
                      title={av.name}
                    >
                      <Image
                        src={av.src}
                        alt={av.name}
                        width={44}
                        height={44}
                        style={{ objectFit: 'cover' }}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group-item">
                <label className="field-label" htmlFor="f-deeds">Good Deed</label>
                <input
                  id="f-deeds"
                  type="text"
                  placeholder="e.g. Helped clean dishes, looked after family pet"
                  value={goodDeeds}
                  onChange={(e) => setGoodDeeds(e.target.value)}
                  className="field-input"
                />
              </div>

              <div className="form-group-item">
                <label className="field-label">Category</label>
                <div className="category-tags-row">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.label}
                      type="button"
                      onClick={() => setCategory(cat.label)}
                      className={`category-tag-btn ${category === cat.label ? 'active' : ''}`}
                    >
                      <span>{cat.emoji}</span>
                      <span>{cat.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group-item">
                <label className="field-label" htmlFor="f-wish">Wish Description</label>
                <textarea
                  id="f-wish"
                  required
                  rows={3}
                  placeholder="Describe your Christmas wish..."
                  value={wishText}
                  onChange={(e) => setWishText(e.target.value)}
                  className="field-textarea"
                />
              </div>

              {wishText.trim() && (
                <div className={`safety-preview-box ${safetyEvaluation.safe ? 'safe' : 'flagged'}`}>
                  {safetyEvaluation.safe ? <CheckCircle2 size={16} /> : <ShieldAlert size={16} />}
                  <span>{safetyEvaluation.msg}</span>
                </div>
              )}

              {submitted && (
                <div
                  style={{
                    background: '#e6f7ec',
                    border: '1px solid #bce3c5',
                    color: '#166534',
                    borderRadius: '8px',
                    padding: '0.75rem 1rem',
                    fontSize: '0.88rem',
                    marginBottom: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  <CheckCircle2 size={16} />
                  <span>Your wish has been submitted and sent to Santa&apos;s dashboard!</span>
                </div>
              )}

              <button type="submit" className="btn-submit-wish" id="btn-submit-wish">
                <Send size={16} />
                <span>Submit Wish to Santa</span>
              </button>
            </form>
          </section>

          {/* Recent Submissions */}
          <aside className="recent-submissions-card">
            <h2 className="recent-title">Recent Submissions</h2>
            <p className="recent-desc">Latest wishes logged into the North Pole system.</p>

            <div className="submissions-stack">
              {recentWishes.slice(0, 5).map((w) => (
                <div key={w.id} className="submission-entry">
                  <div className="submission-entry-top">
                    <span className="submission-entry-name">{w.childName} ({w.age} yrs)</span>
                    {w.status === 'pending' && (
                      <span className="badge-status pending" style={{ fontSize: '0.74rem', padding: '0.2rem 0.55rem' }}>
                        <Clock size={11} /> Pending
                      </span>
                    )}
                    {w.status === 'approved' && (
                      <span className="badge-status approved" style={{ fontSize: '0.74rem', padding: '0.2rem 0.55rem' }}>
                        <Check size={11} /> Approved
                      </span>
                    )}
                    {w.status === 'rejected' && (
                      <span className="badge-status rejected" style={{ fontSize: '0.74rem', padding: '0.2rem 0.55rem' }}>
                        Archived
                      </span>
                    )}
                  </div>
                  <p className="submission-entry-text">&ldquo;{w.wishText}&rdquo; {w.emoji}</p>
                  <div style={{ fontSize: '0.78rem', color: '#7d6b6c' }}>{w.location}</div>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

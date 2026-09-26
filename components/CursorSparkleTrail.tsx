'use client';

import React, { useEffect, useState } from 'react';

interface Sparkle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  char: string;
}

export default function CursorSparkleTrail() {
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);

  useEffect(() => {
    let count = 0;
    let lastTime = 0;

    const chars = ['✨', '⭐', '❄️', '✦'];
    const colors = ['#ffe285', '#ffd700', '#fff3b0', '#ffffff'];

    const handleMouseMove = (e: MouseEvent) => {
      const now = performance.now();
      // Throttle sparkle creation slightly so it's super smooth and performant
      if (now - lastTime < 45) return;
      lastTime = now;

      // Finger tip offset relative to cursor pointer
      const newSparkle: Sparkle = {
        id: ++count,
        x: e.clientX,
        y: e.clientY,
        size: Math.floor(Math.random() * 8) + 10,
        color: colors[Math.floor(Math.random() * colors.length)],
        char: chars[Math.floor(Math.random() * chars.length)]
      };

      setSparkles((prev) => [...prev.slice(-15), newSparkle]);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // Clean up expired sparkles
    const interval = setInterval(() => {
      setSparkles((prev) => (prev.length > 0 ? prev.slice(1) : prev));
    }, 90);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearInterval(interval);
    };
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 9999,
        overflow: 'hidden'
      }}
      aria-hidden="true"
    >
      {sparkles.map((s) => (
        <span
          key={s.id}
          style={{
            position: 'absolute',
            left: s.x,
            top: s.y,
            fontSize: `${s.size}px`,
            color: s.color,
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'none',
            userSelect: 'none',
            opacity: 0.85,
            transition: 'transform 0.4s ease-out, opacity 0.4s ease-out',
            filter: 'drop-shadow(0 0 4px rgba(255, 215, 0, 0.6))'
          }}
        >
          {s.char}
        </span>
      ))}
    </div>
  );
}

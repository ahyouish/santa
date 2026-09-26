'use client';

import React, { useEffect, useState } from 'react';

interface Flake {
  id: number;
  left: number;
  duration: number;
  delay: number;
  size: number;
  symbol: string;
}

export default function Snowfall({ active = true }: { active?: boolean }) {
  const [flakes, setFlakes] = useState<Flake[]>([]);

  useEffect(() => {
    if (!active) {
      setFlakes([]);
      return;
    }

    const symbols = ['❄', '❅', '❆', '•', '✨'];
    const generated: Flake[] = [];
    for (let i = 0; i < 35; i++) {
      generated.push({
        id: i,
        left: Math.random() * 100,
        duration: 5 + Math.random() * 8,
        delay: Math.random() * 6,
        size: 8 + Math.random() * 14,
        symbol: symbols[Math.floor(Math.random() * symbols.length)]
      });
    }
    setFlakes(generated);
  }, [active]);

  if (!active) return null;

  return (
    <div className="snow-container" aria-hidden="true">
      {flakes.map((flake) => (
        <span
          key={flake.id}
          className="snowflake"
          style={{
            left: `${flake.left}vw`,
            animationDuration: `${flake.duration}s`,
            animationDelay: `${flake.delay}s`,
            fontSize: `${flake.size}px`,
            opacity: flake.size > 14 ? 0.8 : 0.45
          }}
        >
          {flake.symbol}
        </span>
      ))}
    </div>
  );
}

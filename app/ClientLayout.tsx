'use client';

import React from 'react';
import Navigation from '@/components/Navigation';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navigation />
      <main id="main-content-area">{children}</main>
    </>
  );
}

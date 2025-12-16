'use client';

import StoreProvider from '../shared/store/Provider';
import { Toaster } from 'react-hot-toast';
import { checkAndInitializeDemo } from '../shared/data/demoHelper';
import { useEffect } from 'react';

export default function GlobalProviders({ children }: { children: React.ReactNode }) {
  // 🎭 Initialize demo mode if enabled
  useEffect(() => {
    checkAndInitializeDemo();
  }, []);

  return (
    <StoreProvider>
      <Toaster />
      {children}
    </StoreProvider>
  );
}

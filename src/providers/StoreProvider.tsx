'use client';

import { useEffect, useState } from 'react';

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  return (
    <div style={{ visibility: hydrated ? 'visible' : 'hidden' }}>
      {children}
    </div>
  );
}

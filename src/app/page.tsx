'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Logo } from '@/components/icons';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/login');
  }, [router]);

  return (
    <main className="flex h-screen w-full flex-col items-center justify-center bg-background">
      <div className="flex items-center gap-2 text-2xl font-headline font-bold">
          <Logo className="h-8 w-8 text-primary" />
          <span>FitFlow</span>
      </div>
      <p className="mt-2 text-muted-foreground">Redirecting...</p>
    </main>
  );
}

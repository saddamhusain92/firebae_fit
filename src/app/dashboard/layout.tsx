'use client';
import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { DashboardNav } from '@/components/dashboard-nav';
import { UserNav } from '@/components/user-nav';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import { Logo } from '@/components/icons';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

  if (isUserLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Logo className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    // This can happen briefly before the redirect, so we can return null or a loading indicator.
    // Or, since the effect will redirect, we can just show the loader again.
    return (
      <div className="flex h-screen items-center justify-center">
        <Logo className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  const handleLinkClick = () => {
    setIsSheetOpen(false);
  };


  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <a href="/dashboard" className="flex items-center gap-2 font-headline font-semibold">
              <Logo className="h-6 w-6 text-primary" />
              <span className="">FitFlow</span>
            </a>
          </div>
          <div className="flex-1">
            <DashboardNav />
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
           <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 md:hidden"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col">
              <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
                <a href="/dashboard" className="flex items-center gap-2 font-headline font-semibold">
                  <Logo className="h-6 w-6 text-primary" />
                  <span className="">FitFlow</span>
                </a>
              </div>
              <DashboardNav onLinkClick={handleLinkClick} />
            </SheetContent>
          </Sheet>
          <div className="w-full flex-1">
             {/* Can add a search bar here if needed */}
          </div>
          <UserNav />
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

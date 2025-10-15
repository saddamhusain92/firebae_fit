'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Dumbbell,
  Target,
  BarChart3,
  UserCircle,
  BrainCircuit
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/workouts', label: 'Workouts', icon: Dumbbell },
  { href: '/dashboard/goals', label: 'Goals', icon: Target },
  { href: '/dashboard/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/dashboard/suggestions', label: 'AI Suggestions', icon: BrainCircuit },
  { href: '/dashboard/profile', label: 'Profile', icon: UserCircle },
];

export function DashboardNav({ onLinkClick }: { onLinkClick?: () => void }) {
  const pathname = usePathname();

  return (
    <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
      {navItems.map(({ href, label, icon: Icon }) => (
        <Link
          key={href}
          href={href}
          onClick={onLinkClick}
          className={cn(
            buttonVariants({ variant: 'ghost' }),
            'justify-start gap-2',
            pathname === href
              ? 'bg-muted text-primary hover:bg-muted hover:text-primary'
              : 'text-muted-foreground'
          )}
        >
          <Icon className="h-4 w-4" />
          {label}
        </Link>
      ))}
    </nav>
  );
}

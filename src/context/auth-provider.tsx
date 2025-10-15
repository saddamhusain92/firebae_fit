'use client';

import type { User as FirebaseUser } from 'firebase/auth';
import { onAuthStateChanged } from 'firebase/auth';
import { createContext, useEffect, useState } from 'react';

import { auth } from '@/lib/firebase';

type AuthContextState = {
  user: FirebaseUser | null;
  loading: boolean;
};

export const AuthContext = createContext<AuthContextState>({
  user: null,
  loading: true,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      setLoading(false);
      
      if (user) {
        const token = await user.getIdToken();
        // Set cookie for server-side authentication
        document.cookie = `session=${token}; path=/; max-age=${60 * 60 * 24 * 7}`;
      } else {
        // Clear cookie on sign out
        document.cookie = 'session=; path=/; max-age=-1';
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

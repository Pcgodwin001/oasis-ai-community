import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import type { User } from '@supabase/supabase-js';
import { authService } from '../services/authService';
import { userService } from '../services/userService';
import type { UserProfile } from '../types';

interface UserContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  refreshProfile: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const loadUserData = async (currentUser: User | null) => {
    // Don't block - load profile in background
    if (currentUser) {
      userService.getProfile(currentUser.id).then(setProfile);
    } else {
      setProfile(null);
    }
  };

  const refreshProfile = async () => {
    if (user) {
      const userProfile = await userService.getProfile(user.id);
      setProfile(userProfile);
    }
  };

  useEffect(() => {
    let mounted = true;

    // Set a timeout to prevent hanging
    const timeout = setTimeout(() => {
      if (mounted && loading) {
        setLoading(false);
      }
    }, 1000);

    // Load current user on mount
    authService.getCurrentUser().then((currentUser) => {
      if (mounted) {
        setUser(currentUser);
        setLoading(false); // Don't wait for profile
        loadUserData(currentUser);
      }
    });

    // Subscribe to auth state changes
    const subscription = authService.onAuthStateChange((currentUser) => {
      if (mounted) {
        setUser(currentUser);
        loadUserData(currentUser);
      }
    });

    return () => {
      mounted = false;
      clearTimeout(timeout);
      subscription.unsubscribe();
    };
  }, []);

  return (
    <UserContext.Provider value={{ user, profile, loading, refreshProfile }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}

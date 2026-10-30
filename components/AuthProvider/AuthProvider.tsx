// src/components/AuthProvider/AuthProvider.tsx
'use client';

import React, { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { checkSession, getMe } from '@/lib/api/clientApi';
import { useAuthStore } from '@/lib/store/authStore';

interface AuthProviderProps {
  children: React.ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const setUser = useAuthStore(state => state.setUser);
  const clearIsAuthenticated = useAuthStore(state => state.clearIsAuthenticated);

  const {
    data: sessionUser,
    isSuccess,
    isError,
    isLoading,
  } = useQuery({
    queryKey: ['auth-session'],
    queryFn: async () => {
      try {
        const session = await checkSession();

        if (session) {
          return await getMe();
        }
        return null;
      } catch {
        return null;
      }
    },
    retry: false,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (isSuccess && sessionUser) {
      setUser(sessionUser);
    } else if (isError || (isSuccess && !sessionUser)) {
      clearIsAuthenticated();
    }
  }, [sessionUser, isSuccess, isError, setUser, clearIsAuthenticated]);

  if (isLoading) {
    return null;
  }

  return <>{children}</>;
}

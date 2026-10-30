// src/app/(auth routes)/layout.tsx
import React from 'react';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default async function AuthLayout({ children }: AuthLayoutProps) {
  return <>{children}</>;
}

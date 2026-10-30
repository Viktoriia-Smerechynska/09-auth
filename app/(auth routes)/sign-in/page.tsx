// src/app/(auth routes)/sign-in/page.tsx
'use client';

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { login } from '@/lib/api/clientApi';
import { useAuthStore } from '@/lib/store/authStore';
import css from './SignIn.module.css';

export default function SignInPage() {
  const router = useRouter();
  const setUser = useAuthStore(state => state.setUser);

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const loginMutation = useMutation({
    mutationFn: () => login({ email, password }),
    onSuccess: data => {
      setErrorMessage('');

      setUser(data);
      router.push('/profile');
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Invalid email or password.';
      setErrorMessage(message);
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email || !password) return;
    loginMutation.mutate();
  };

  return (
    <main className={css.mainContent}>
      <form className={css.form} onSubmit={handleSubmit}>
        <h1 className={css.formTitle}>Sign in</h1>

        <div className={css.formGroup}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            name="email"
            className={css.input}
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </div>

        <div className={css.formGroup}>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            name="password"
            className={css.input}
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </div>

        <div className={css.actions}>
          <button type="submit" className={css.submitButton} disabled={loginMutation.isPending}>
            {loginMutation.isPending ? 'Logging in...' : 'Log in'}
          </button>
        </div>

        {errorMessage && <p className={css.error}>{errorMessage}</p>}
      </form>
    </main>
  );
}

// src/app/(auth routes)/sign-up/page.tsx
'use client';

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { register } from '@/lib/api/clientApi';
import { useAuthStore } from '@/lib/store/authStore';
import css from './SignUp.module.css';

export default function SignUpPage() {
  const router = useRouter();
  const setUser = useAuthStore(state => state.setUser);

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const registerMutation = useMutation({
    mutationFn: () => register({ email, password }),
    onSuccess: data => {
      setErrorMessage('');

      setUser(data);
      router.push('/profile');
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Registration failed. Try again.';
      setErrorMessage(message);
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email || !password) return;
    registerMutation.mutate();
  };

  return (
    <main className={css.mainContent}>
      <h1 className={css.formTitle}>Sign up</h1>

      <form className={css.form} onSubmit={handleSubmit}>
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
          <button type="submit" className={css.submitButton} disabled={registerMutation.isPending}>
            {registerMutation.isPending ? 'Registering...' : 'Register'}
          </button>
        </div>

        {errorMessage && <p className={css.error}>{errorMessage}</p>}
      </form>
    </main>
  );
}

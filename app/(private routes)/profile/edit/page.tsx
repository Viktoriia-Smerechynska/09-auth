// src/app/(private routes)/profile/edit/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { updateMe } from '@/lib/api/clientApi';
import { useAuthStore } from '@/lib/store/authStore';
import css from '../Profile.module.css';

export default function EditProfilePage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const user = useAuthStore(state => state.user);
  const setUser = useAuthStore(state => state.setUser);

  const [username, setUsername] = useState<string>('');

  useEffect(() => {
    if (user?.username) {
      setUsername(user.username);
    }
  }, [user]);

  const updateProfileMutation = useMutation({
    mutationFn: () => updateMe({ username }),
    onSuccess: updatedUser => {
      setUser(updatedUser);

      queryClient.invalidateQueries({ queryKey: ['auth-session'] });

      router.push('/profile');
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!username.trim()) return;
    updateProfileMutation.mutate();
  };

  const handleCancel = () => {
    router.push('/profile');
  };

  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        {/* 🌟 Сувора розмітка структури за ТЗ */}
        <h1 className={css.formTitle}>Edit Profile</h1>

        {}
        <div className={css.avatarWrapper}>
          <Image
            src={user?.avatar || 'https://goit.global'}
            alt="User Avatar"
            width={120}
            height={120}
            className={css.avatar}
            priority
          />
        </div>

        <form className={css.profileInfo} onSubmit={handleSubmit}>
          <div className={css.usernameWrapper}>
            <label htmlFor="username">Username:</label>
            <input
              id="username"
              type="text"
              className={css.input}
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
              minLength={2}
            />
          </div>

          {}
          <p>Email: {user?.email || 'user_email@example.com'}</p>

          <div className={css.actions} style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
            <button
              type="submit"
              className={css.saveButton}
              disabled={updateProfileMutation.isPending}
            >
              {updateProfileMutation.isPending ? 'Saving...' : 'Save'}
            </button>
            <button type="button" className={css.cancelButton} onClick={handleCancel}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

'use client';

import { useAuthStore } from '@/stores/auth.store';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import { useEffect } from 'react';
import { Button } from '@/components/ui';

export default function ProfilePage() {
  const t = useTranslations('profile');
  const { user, isLoading } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/auth/login');
    }
  }, [isLoading, user, router]);

  if (isLoading || !user) {
    return <div className="max-w-[var(--max-width-content)] mx-auto px-6 py-10 md:px-10">{t('loading')}</div>;
  }

  return (
    <div className="max-w-[var(--max-width-content)] mx-auto px-[var(--spacing-page)] py-10">
      <div className="mb-10 flex items-center justify-between">
        <h1 className="text-3xl font-bold">{t('title')}</h1>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        {/* Avatar & Bio Card */}
        <div className="col-span-1 flex flex-col items-center rounded-lg border p-6 text-center">
          <div className="mb-4 h-32 w-32 overflow-hidden rounded-full bg-muted">
            {user.profile.avatar_url ? (
              <img src={user.profile.avatar_url} alt={user.username} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-4xl font-bold text-muted-foreground">
                {user.username.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <h2 className="text-xl font-bold">{user.first_name} {user.last_name}</h2>
          <p className="text-muted-foreground">@{user.username}</p>
          {user.profile.bio && <p className="mt-4 text-sm">{user.profile.bio}</p>}
        </div>

        {/* Stats & Details */}
        <div className="col-span-2 space-y-6">
           <div className="rounded-lg border p-6">
             <h3 className="mb-4 text-lg font-semibold">{t('stats.articles')}</h3>
             <div className="text-3xl font-bold">0</div>
             <p className="text-sm text-muted-foreground">Articles this year</p>
           </div>
           
           <div className="rounded-lg border p-6">
             <dl className="space-y-4">
               <div>
                  <dt className="text-sm font-medium text-muted-foreground">{t('fields.email')}</dt>
                  <dd className="text-base">{user.email}</dd>
               </div>
               <div>
                  <dt className="text-sm font-medium text-muted-foreground">{t('fields.website')}</dt>
                  <dd className="text-base">{user.profile.website || '-'}</dd>
               </div>
               <div>
                  <dt className="text-sm font-medium text-muted-foreground">{t('stats.memberSince')}</dt>
                  <dd className="text-base">{new Date(user.date_joined).toLocaleDateString()}</dd>
               </div>
             </dl>
           </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useEffect } from 'react';
import { useRouter } from '@/i18n/navigation';
import { useAuthStore } from '@/stores/auth.store';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui';

export default function LogoutPage() {
  const t = useTranslations('auth.logout');
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);

  useEffect(() => {
    logout();
  }, [logout]);

  return (
    <div className="max-w-[var(--max-width-content)] mx-auto px-[var(--spacing-page)] flex flex-col items-center justify-center py-20 text-center">
      <h1 className="mb-4 text-3xl font-bold">{t('title')}</h1>
      <p className="mb-8 text-muted-foreground">{t('message')}</p>
      <Button onClick={() => router.push('/')}>
        {t('backHome')}
      </Button>
    </div>
  );
}

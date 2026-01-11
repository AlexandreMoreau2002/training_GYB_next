'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useAuthStore } from '@/stores';
import { Button } from '@/components/ui';

interface ArticleActionsProps {
  articleSlug: string;
  authorId: number;
  locale: string;
}

export function ArticleActions({ articleSlug, authorId, locale }: ArticleActionsProps) {
  const t = useTranslations('articles.detail');
  const { user } = useAuthStore();

  // Only show edit button if user is the author or staff
  if (!user || (user.id !== authorId && !user.is_staff)) {
    return null;
  }

  return (
    <div className="flex gap-2">
      <Link href={`/${locale}/articles/${articleSlug}/edit`}>
        <Button variant="secondary" size="sm">
          {t('edit')}
        </Button>
      </Link>
    </div>
  );
}

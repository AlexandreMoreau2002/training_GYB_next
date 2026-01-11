'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui';
import { commentsService } from '@/lib/api';
import { ApiError } from '@/lib/api/client';

interface CommentFormProps {
  articleSlug: string;
  articleId: number;
  parentId?: number;
  onCancel?: () => void;
  onSuccess?: () => void;
}

export function CommentForm({ articleSlug, articleId, parentId, onCancel, onSuccess }: CommentFormProps) {
  const t = useTranslations('comments');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsSubmitting(true);
    setError(null);
    try {
        await commentsService.create(articleSlug, {
          content: content.trim(),
          parent: parentId,
        });

        setContent('');
        onSuccess?.();
    } catch (err) {
        console.error('Failed to post comment', err);
        if (err instanceof ApiError && err.isUnauthorized) {
          setError(t('authRequired'));
        } else {
          setError(t('postError'));
        }
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6 space-y-4">
      <div>
        <textarea
          className="w-full rounded-md border p-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          rows={3}
          placeholder={t('placeholder')}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          disabled={isSubmitting}
        />
      </div>
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
      <div className="flex items-center gap-2">
        <Button type="submit" disabled={isSubmitting || !content.trim()}>
          {isSubmitting ? t('loading') : t('submit')}
        </Button>
        {onCancel && (
          <Button type="button" variant="ghost" onClick={onCancel}>
            {t('cancelReply')}
          </Button>
        )}
      </div>
    </form>
  );
}

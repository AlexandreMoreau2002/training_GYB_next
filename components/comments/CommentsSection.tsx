'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Comment } from '@/types';
import { commentsService } from '@/lib/api';
import { CommentList } from './CommentList';
import { CommentForm } from './CommentForm';
import { useAuthStore } from '@/stores';

interface CommentsSectionProps {
  articleSlug: string;
  articleId: number;
  initialComments?: Comment[];
}

export function CommentsSection({ articleSlug, articleId, initialComments = [] }: CommentsSectionProps) {
  const t = useTranslations('comments');
  const { user } = useAuthStore();
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [isLoading, setIsLoading] = useState(!initialComments.length);
  const [error, setError] = useState<string | null>(null);

  const fetchComments = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await commentsService.getByArticle(articleSlug);
      setComments(data);
    } catch (err) {
      console.error('Failed to fetch comments:', err);
      setError(t('fetchError'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!initialComments.length) {
      fetchComments();
    }
  }, [articleSlug]);

  const handleCommentCreated = () => {
    fetchComments();
  };

  if (isLoading) {
    return (
      <div className="py-10 text-center text-muted-foreground">
        {t('loading')}
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-10 text-center text-red-500">
        {error}
        <button
          onClick={fetchComments}
          className="ml-2 underline hover:no-underline"
        >
          {t('retry')}
        </button>
      </div>
    );
  }

  return (
    <div>
      <CommentList comments={comments} articleId={articleId} articleSlug={articleSlug} onCommentUpdated={handleCommentCreated} />

      <div className="mt-10">
        {user ? (
          <>
            <h3 className="mb-4 text-lg font-bold">{t('writeComment')}</h3>
            <CommentForm
              articleSlug={articleSlug}
              articleId={articleId}
              onSuccess={handleCommentCreated}
            />
          </>
        ) : (
          <p className="text-muted-foreground">{t('loginToComment')}</p>
        )}
      </div>
    </div>
  );
}

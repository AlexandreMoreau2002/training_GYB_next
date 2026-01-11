'use client';

import { useState } from 'react';
import { Comment } from '@/types';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui';
import { CommentForm } from './CommentForm';
import { useAuthStore } from '@/stores';

interface CommentItemProps {
  comment: Comment;
  articleId: number;
  articleSlug?: string;
  onCommentUpdated?: () => void;
}

export function CommentItem({ comment, articleId, articleSlug, onCommentUpdated }: CommentItemProps) {
  const t = useTranslations('comments');
  const { user } = useAuthStore();
  const [isReplying, setIsReplying] = useState(false);

  const handleReplySuccess = () => {
    setIsReplying(false);
    onCommentUpdated?.();
  };

  return (
    <div className="group mb-6">
       <div className="flex gap-4">
         {/* Avatar */}
         <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-full bg-slate-200">
           {comment.author.avatar_url ? (
             <img src={comment.author.avatar_url} alt={comment.author.username} className="h-full w-full object-cover" />
           ) : (
             <div className="flex h-full w-full items-center justify-center font-bold text-slate-500">
                {comment.author.username.charAt(0).toUpperCase()}
             </div>
           )}
         </div>

         <div className="flex-1">
            {/* Header */}
            <div className="mb-1 flex items-baseline gap-2">
              <span className="font-semibold">{comment.author.username}</span>
              <span className="text-xs text-muted-foreground">
                {new Date(comment.created_at).toLocaleDateString()}
              </span>
            </div>

            {/* Content */}
            <div className="mb-2 text-sm text-foreground/90 whitespace-pre-wrap">
              {comment.content}
            </div>

            {/* Actions */}
            {user && articleSlug && (
              <div className="flex items-center gap-4">
                 <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto p-0 text-muted-foreground hover:text-foreground"
                  onClick={() => setIsReplying(!isReplying)}
                 >
                   {t('reply')}
                 </Button>
              </div>
            )}

            {/* Reply Form */}
            {isReplying && articleSlug && (
                <div className="mt-4">
                    <CommentForm
                        articleSlug={articleSlug}
                        articleId={articleId}
                        parentId={comment.id}
                        onCancel={() => setIsReplying(false)}
                        onSuccess={handleReplySuccess}
                    />
                </div>
            )}
         </div>
       </div>

       {/* Nested Replies */}
       {comment.replies && comment.replies.length > 0 && (
         <div className="ml-14 border-l pl-4">
           {comment.replies.map((reply) => (
             <CommentItem
               key={reply.id}
               comment={reply}
               articleId={articleId}
               articleSlug={articleSlug}
               onCommentUpdated={onCommentUpdated}
             />
           ))}
         </div>
       )}
    </div>
  );
}

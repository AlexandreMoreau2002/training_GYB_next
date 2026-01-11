import { Comment } from '@/types';
import { CommentItem } from './CommentItem';
import { useTranslations } from 'next-intl';

interface CommentListProps {
  comments: Comment[];
  articleId: number;
  articleSlug?: string;
  onCommentUpdated?: () => void;
}

export function CommentList({ comments, articleId, articleSlug, onCommentUpdated }: CommentListProps) {
  const t = useTranslations('comments');

  if (comments.length === 0) {
    return (
      <div className="py-10 text-center text-muted-foreground">
        {t('noComments')}
      </div>
    );
  }

  // Count total comments including replies
  const countComments = (items: Comment[]): number => {
    return items.reduce((acc, c) => acc + 1 + countComments(c.replies || []), 0);
  };
  const totalCount = countComments(comments);

  return (
    <div className="space-y-6">
      <h3 className="mb-6 text-xl font-bold">
        {t('title', { count: totalCount })}
      </h3>
      {comments.map((comment) => (
        <CommentItem
          key={comment.id}
          comment={comment}
          articleId={articleId}
          articleSlug={articleSlug}
          onCommentUpdated={onCommentUpdated}
        />
      ))}
    </div>
  );
}

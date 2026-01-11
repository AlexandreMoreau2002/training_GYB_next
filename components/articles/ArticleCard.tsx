import { Link } from '@/i18n/navigation';
import { ArticleListItem } from '@/types';
import { useTranslations } from 'next-intl';

interface ArticleCardProps {
  article: ArticleListItem;
}

export function ArticleCard({ article }: ArticleCardProps) {
  const t = useTranslations('articles.card');

  return (
    <div className="flex flex-col overflow-hidden rounded-lg border shadow-sm transition-shadow hover:shadow-md">
      {article.image_url && (
        <div className="h-48 w-full overflow-hidden bg-muted">
          <img
            src={article.image_url}
            alt={article.title}
            className="h-full w-full object-cover transition-transform hover:scale-105"
          />
        </div>
      )}
      <div className="flex flex-1 flex-col p-6">
        <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
          {article.category && (
            <span className="font-medium text-primary">{article.category.name}</span>
          )}
          <span>•</span>
          <span>{new Date(article.created_at).toLocaleDateString()}</span>
        </div>
        
        <h3 className="mb-2 text-xl font-bold leading-tight">
          <Link href={`/articles/${article.slug}`} className="hover:underline">
            {article.title}
          </Link>
        </h3>
        
        <p className="mb-4 flex-1 text-muted-foreground line-clamp-3">
          {article.excerpt}
        </p>

        <div className="flex items-center justify-between border-t pt-4 text-sm text-muted-foreground">
           <div className="flex items-center gap-2">
             {article.author.avatar_url ? (
               <img src={article.author.avatar_url} alt={article.author.username} className="h-6 w-6 rounded-full" />
             ) : (
                <div className="h-6 w-6 rounded-full bg-slate-200" />
             )}
             <span>{article.author.first_name} {article.author.last_name}</span>
           </div>
           <span>{t('readMore')}</span>
        </div>
      </div>
    </div>
  );
}

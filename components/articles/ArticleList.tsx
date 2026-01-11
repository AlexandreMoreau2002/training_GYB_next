import { ArticleListItem } from '@/types';
import { ArticleCard } from './ArticleCard';

interface ArticleListProps {
  articles: ArticleListItem[];
}

export function ArticleList({ articles }: ArticleListProps) {
  if (articles.length === 0) {
    return null; 
    // Or return empty state here if preferred, but usually handled by parent
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {articles.map((article) => (
        <ArticleCard key={article.id} article={article} />
      ))}
    </div>
  );
}

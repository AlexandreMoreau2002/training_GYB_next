import { getTranslations } from 'next-intl/server';
import { ArticleFilters } from '@/components/articles/ArticleFilters';
import { ArticleList } from '@/components/articles/ArticleList';
import { articlesService } from '@/lib/api';

export default async function ArticlesPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const t = await getTranslations('articles');
  const params = await searchParams;

  // Extract filters from searchParams
  const category = typeof params.category === 'string' ? params.category : undefined;
  const search = typeof params.search === 'string' ? params.search : undefined;
  const ordering = typeof params.sortBy === 'string' ? params.sortBy : undefined;

  let articlesResponse;
  try {
    articlesResponse = await articlesService.getAll({
      category,
      search,
      ordering,
      status: 'published',
    });
  } catch (error) {
    console.error('Failed to fetch articles:', error);
    // Return empty list or error state gracefully
    articlesResponse = { results: [], count: 0, next: null, previous: null };
  }

  return (
    <div className="max-w-[var(--max-width-content)] mx-auto px-[var(--spacing-page)] py-10">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-[var(--color-foreground)]">{t('title')}</h1>
      </div>
      
      <div className="grid gap-8 lg:grid-cols-4">
        {/* Filters Sidebar */}
        <aside className="lg:col-span-1">
           <div className="sticky top-24 rounded-lg border border-[var(--color-border)] p-4 bg-[var(--color-surface)]">
             <ArticleFilters />
           </div>
        </aside>

        {/* Article Grid */}
        <div className="lg:col-span-3">
           <div className="mb-6 flex items-center justify-between">
             <div className="text-sm text-[var(--color-secondary)]">
               {articlesResponse.count} articles
             </div>
             <div className="text-sm text-[var(--color-secondary)]">
               {t('filters.sortBy')}...
             </div>
           </div>

           <ArticleList articles={articlesResponse.results} />
        </div>
      </div>
    </div>
  );
}

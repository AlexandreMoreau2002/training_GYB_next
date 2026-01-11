import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { categoriesService, articlesService } from '@/lib/api';
import { ArticleList } from '@/components/articles/ArticleList';

export default async function CategoryDetailPage({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  const { slug } = await params;
  const t = await getTranslations('categories');
  const tArticles = await getTranslations('articles');

  let category;
  try {
    category = await categoriesService.getBySlug(slug);
  } catch (error) {
    notFound();
  }

  // Fetch articles for this category
  const articlesResponse = await articlesService.getAll({
    category: slug,
    status: 'published',
  });

  return (
    <div className="max-w-[var(--max-width-content)] mx-auto px-6 py-10 md:px-10">
      <div className="mb-10">
        <h1 className="mb-2 text-4xl font-bold">{category.name}</h1>
        {category.description && (
          <p className="text-lg text-muted-foreground">{category.description}</p>
        )}
        <p className="mt-2 text-sm text-muted-foreground">
          {t('articlesCount', { count: articlesResponse.count })}
        </p>
      </div>

      {articlesResponse.results.length > 0 ? (
        <ArticleList articles={articlesResponse.results} />
      ) : (
        <div className="py-10 text-center text-muted-foreground">
          {tArticles('empty')}
        </div>
      )}
    </div>
  );
}

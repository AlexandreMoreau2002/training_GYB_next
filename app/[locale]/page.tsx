import { Link } from '@/i18n/navigation';
import { getTranslations } from 'next-intl/server';
import { Button } from '@/components/ui';
import { articlesService, categoriesService } from '@/lib/api';
import { ArticleCard } from '@/components/articles/ArticleCard';

export default async function HomePage() {
  const t = await getTranslations('home');

  // Fetch data in parallel
  const [articlesData, categories] = await Promise.all([
    articlesService.getAll({ page: 1, ordering: '-published_at' }).catch(() => ({ results: [], count: 0, next: null, previous: null })),
    categoriesService.getAll().catch(() => [])
  ]);

  const featuredArticles = articlesData.results.slice(0, 3);

  return (
    <div className="max-w-[var(--max-width-content)] mx-auto px-[var(--spacing-page)] py-10">
      {/* Hero Section */}
      <section className="mb-16 text-center">
        <h1 className="mb-6 text-5xl font-extrabold tracking-tight lg:text-6xl text-[var(--color-foreground)]">
          {t('hero.title')}
        </h1>
        <p className="mb-8 text-xl text-[var(--color-secondary)]">
          {t('hero.subtitle')}
        </p>
        <div className="flex justify-center gap-4">
          <Link href="/articles">
            <Button size="lg">{t('hero.cta')}</Button>
          </Link>
        </div>
      </section>

      {/* Featured Articles Section */}
      <section className="mb-16">
        <h2 className="mb-8 text-3xl font-bold text-[var(--color-foreground)]">{t('featured.title')}</h2>
        {featuredArticles.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featuredArticles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        ) : (
          <p className="text-[var(--color-secondary)]">{t('featured.empty')}</p>
        )}
      </section>

      {/* Categories Section */}
      <section>
        <h2 className="mb-8 text-3xl font-bold text-[var(--color-foreground)]">{t('categories.title')}</h2>
        {categories.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/categories/${category.slug}`}
                className="group flex flex-col items-center justify-center rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-6 transition-colors hover:border-[var(--color-accent)] hover:shadow-md"
              >
                <span className="text-lg font-semibold group-hover:text-[var(--color-accent)]">
                  {category.name}
                </span>
                <span className="mt-2 text-sm text-[var(--color-secondary)]">
                  {category.articles_count} articles
                </span>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-[var(--color-secondary)]">Aucune catégorie disponible.</p>
        )}
      </section>
    </div>
  );
}

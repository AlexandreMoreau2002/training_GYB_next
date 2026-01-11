import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { categoriesService } from '@/lib/api';

export default async function CategoriesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations('categories');

  const categories = await categoriesService.getAll();

  return (
    <div className="max-w-[var(--max-width-content)] mx-auto px-6 py-10 md:px-10">
      <h1 className="mb-8 text-4xl font-bold">{t('title')}</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/${locale}/categories/${category.slug}`}
            className="group rounded-lg border p-6 transition-all hover:border-[var(--color-accent)] hover:shadow-md"
          >
            <h2 className="mb-2 text-2xl font-bold group-hover:text-[var(--color-accent)]">
              {category.name}
            </h2>
            {category.description && (
              <p className="mb-4 text-muted-foreground">{category.description}</p>
            )}
            <p className="text-sm text-muted-foreground">
              {t('articlesCount', { count: category.articles_count })}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}

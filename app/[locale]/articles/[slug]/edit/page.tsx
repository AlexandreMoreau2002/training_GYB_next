import { notFound } from 'next/navigation';
import { articlesService } from '@/lib/api';
import { getTranslations } from 'next-intl/server';
import { ArticleForm } from '@/components/articles/ArticleForm';

export default async function EditArticlePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const t = await getTranslations('articleForm');

  let article;
  try {
    article = await articlesService.getBySlug(slug);
  } catch (error) {
    console.error(error)
    notFound();
  }

  return (
    <div className="max-w-[var(--max-width-content)] mx-auto px-6 py-10 md:px-10">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-8 text-3xl font-bold">{t('title.edit')}</h1>
        <ArticleForm article={article} locale={locale} />
      </div>
    </div>
  );
}

import { getTranslations } from 'next-intl/server';
import { redirect } from 'next/navigation';
import { ArticleForm } from '@/components/articles/ArticleForm';
import { cookies } from 'next/headers';

export default async function NewArticlePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations('articleForm');

  // Check if user is authenticated (basic check via cookie)
  const cookieStore = await cookies();
  const token = cookieStore.get('access_token');

  // Note: In production, you'd want to verify the token server-side
  // For now, the client-side will handle auth errors

  return (
    <div className="max-w-[var(--max-width-content)] mx-auto px-6 py-10 md:px-10">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-8 text-3xl font-bold">{t('title.create')}</h1>
        <ArticleForm locale={locale} />
      </div>
    </div>
  );
}

import { getTranslations } from 'next-intl/server'
import { CommentsSection } from '@/components/comments/CommentsSection'
import { ArticleActions } from '@/components/articles/ArticleActions'
import { articlesService } from '@/lib/api'
import { notFound } from 'next/navigation'
import Link from 'next/link'

export default async function ArticleDetailPage({
  params,
}: {
  params: { slug: string; locale: string }
}) {
  const { slug, locale } = await params

  let article
  try {
    article = await articlesService.getBySlug(slug)
  } catch (error) {
    notFound()
  }

  return (
    <div className="max-w-[var(--max-width-content)] mx-auto px-6 py-10 md:px-10">
      <article className="prose prose-lg mx-auto dark:prose-invert">
        <h1 className="mb-4 text-4xl font-extrabold tracking-tight lg:text-5xl">
          {article.title}
        </h1>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-muted-foreground">
            <span>{article.author.username}</span>
            <span>•</span>
            <span>
              {new Date(
                article.published_at || article.created_at
              ).toLocaleDateString()}
            </span>
            {article.category && (
              <>
                <span>•</span>
                <Link
                  href={`/${locale}/categories/${article.category.slug}`}
                  className="text-[var(--color-accent)] hover:underline"
                >
                  {article.category.name}
                </Link>
              </>
            )}
          </div>
          <ArticleActions
            articleSlug={article.slug}
            authorId={article.author.id}
            locale={locale}
          />
        </div>

        {article.tags && article.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {article.tags.map((tag) => (
              <span
                key={tag.id}
                className="rounded-full bg-stone-100 px-3 py-1 text-xs text-stone-600"
              >
                {tag.name}
              </span>
            ))}
          </div>
        )}

        <div className="mt-8 whitespace-pre-wrap">{article.content}</div>
      </article>

      <div className="mx-auto mt-16 max-w-3xl border-t pt-10">
        <CommentsSection articleSlug={slug} articleId={article.id} />
      </div>
    </div>
  )
}

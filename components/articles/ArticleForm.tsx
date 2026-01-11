'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Button, Input } from '@/components/ui';
import { articlesService, categoriesService, tagsService } from '@/lib/api';
import { ApiError } from '@/lib/api/client';
import type { Article, Category, Tag, ArticleCreateRequest, ArticleStatus } from '@/types';

interface ArticleFormProps {
  article?: Article;
  locale: string;
}

export function ArticleForm({ article, locale }: ArticleFormProps) {
  const t = useTranslations('articleForm');
  const router = useRouter();
  const isEditing = !!article;

  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  // Form state
  const [title, setTitle] = useState(article?.title || '');
  const [excerpt, setExcerpt] = useState(article?.excerpt || '');
  const [content, setContent] = useState(article?.content || '');
  const [imageUrl, setImageUrl] = useState(article?.image_url || '');
  const [categoryId, setCategoryId] = useState<number | ''>(article?.category?.id || '');
  const [selectedTags, setSelectedTags] = useState<number[]>(article?.tags?.map(t => t.id) || []);
  const [status, setStatus] = useState<ArticleStatus>(article?.status || 'draft');

  useEffect(() => {
    async function fetchData() {
      try {
        const [cats, tgs] = await Promise.all([
          categoriesService.getAll(),
          tagsService.getAll(),
        ]);
        setCategories(cats);
        setTags(tgs);
      } catch (err) {
        console.error('Failed to fetch categories/tags:', err);
      }
    }
    fetchData();
  }, []);

  const handleTagToggle = (tagId: number) => {
    setSelectedTags(prev =>
      prev.includes(tagId)
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setFieldErrors({});

    const data: ArticleCreateRequest = {
      title: title.trim(),
      excerpt: excerpt.trim(),
      content: content.trim(),
      image_url: imageUrl.trim() || undefined,
      category: categoryId || undefined,
      tags: selectedTags.length > 0 ? selectedTags : undefined,
      status,
    };

    try {
      let result: Article;
      if (isEditing && article) {
        result = await articlesService.update(article.slug, data);
      } else {
        result = await articlesService.create(data);
      }
      router.push(`/${locale}/articles/${result.slug}`);
    } catch (err) {
      console.error('Failed to save article:', err);
      if (err instanceof ApiError) {
        if (err.isValidationError) {
          setFieldErrors(err.getFieldErrors());
        } else if (err.isUnauthorized) {
          setError(t('errors.unauthorized'));
        } else {
          setError(t('errors.generic'));
        }
      } else {
        setError(t('errors.generic'));
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-md bg-red-50 p-4 text-red-700">
          {error}
        </div>
      )}

      {/* Title */}
      <div>
        <label htmlFor="title" className="mb-2 block font-medium">
          {t('fields.title')} *
        </label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={t('placeholders.title')}
          required
          disabled={isLoading}
        />
        {fieldErrors.title && (
          <p className="mt-1 text-sm text-red-500">{fieldErrors.title[0]}</p>
        )}
      </div>

      {/* Excerpt */}
      <div>
        <label htmlFor="excerpt" className="mb-2 block font-medium">
          {t('fields.excerpt')} *
        </label>
        <textarea
          id="excerpt"
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          placeholder={t('placeholders.excerpt')}
          rows={2}
          required
          disabled={isLoading}
          className="w-full rounded-md border p-3 text-sm focus:border-[var(--color-accent)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]"
        />
        {fieldErrors.excerpt && (
          <p className="mt-1 text-sm text-red-500">{fieldErrors.excerpt[0]}</p>
        )}
      </div>

      {/* Content */}
      <div>
        <label htmlFor="content" className="mb-2 block font-medium">
          {t('fields.content')} *
        </label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={t('placeholders.content')}
          rows={12}
          required
          disabled={isLoading}
          className="w-full rounded-md border p-3 text-sm focus:border-[var(--color-accent)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]"
        />
        {fieldErrors.content && (
          <p className="mt-1 text-sm text-red-500">{fieldErrors.content[0]}</p>
        )}
      </div>

      {/* Image URL */}
      <div>
        <label htmlFor="imageUrl" className="mb-2 block font-medium">
          {t('fields.imageUrl')}
        </label>
        <Input
          id="imageUrl"
          type="url"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder={t('placeholders.imageUrl')}
          disabled={isLoading}
        />
        {fieldErrors.image_url && (
          <p className="mt-1 text-sm text-red-500">{fieldErrors.image_url[0]}</p>
        )}
      </div>

      {/* Category */}
      <div>
        <label htmlFor="category" className="mb-2 block font-medium">
          {t('fields.category')}
        </label>
        <select
          id="category"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value ? Number(e.target.value) : '')}
          disabled={isLoading}
          className="w-full rounded-md border p-3 text-sm focus:border-[var(--color-accent)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]"
        >
          <option value="">{t('placeholders.category')}</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Tags */}
      <div>
        <label className="mb-2 block font-medium">
          {t('fields.tags')}
        </label>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <button
              key={tag.id}
              type="button"
              onClick={() => handleTagToggle(tag.id)}
              disabled={isLoading}
              className={`rounded-full px-3 py-1 text-sm transition-colors ${
                selectedTags.includes(tag.id)
                  ? 'bg-[var(--color-accent)] text-white'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {tag.name}
            </button>
          ))}
        </div>
      </div>

      {/* Status */}
      <div>
        <label className="mb-2 block font-medium">
          {t('fields.status')}
        </label>
        <div className="flex gap-4">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="status"
              value="draft"
              checked={status === 'draft'}
              onChange={() => setStatus('draft')}
              disabled={isLoading}
              className="accent-[var(--color-accent)]"
            />
            {t('status.draft')}
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="status"
              value="published"
              checked={status === 'published'}
              onChange={() => setStatus('published')}
              disabled={isLoading}
              className="accent-[var(--color-accent)]"
            />
            {t('status.published')}
          </label>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-4 pt-4">
        <Button type="submit" isLoading={isLoading}>
          {isEditing ? t('actions.update') : t('actions.create')}
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={() => router.back()}
          disabled={isLoading}
        >
          {t('actions.cancel')}
        </Button>
      </div>
    </form>
  );
}

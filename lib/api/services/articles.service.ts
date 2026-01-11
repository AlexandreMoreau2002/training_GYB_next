/**
 * =============================================================================
 * ARTICLES SERVICE - Gestion des articles
 * =============================================================================
 *
 * CRUD complet pour les articles avec:
 * - Pagination
 * - Filtrage (catégorie, status, auteur)
 * - Recherche full-text
 * - Tri
 */

import { api } from '../client';
import type {
  Article,
  ArticleListItem,
  ArticleCreateRequest,
  ArticleUpdateRequest,
  ArticleFilters,
  PaginatedResponse,
} from '@/types';

export const articlesService = {
  /**
   * Liste des articles avec filtres et pagination
   *
   * @example
   * // Articles publiés de la catégorie "bloc"
   * articlesService.getAll({ category: 'bloc', status: 'published' })
   *
   * // Recherche avec tri par date
   * articlesService.getAll({ search: 'grimpe', ordering: '-published_at' })
   */
  async getAll(filters?: ArticleFilters): Promise<PaginatedResponse<ArticleListItem>> {
    const params: Record<string, string | number | undefined> = {};

    if (filters?.category) params['category__slug'] = filters.category;
    if (filters?.status) params['status'] = filters.status;
    if (filters?.author) params['author__username'] = filters.author;
    if (filters?.search) params['search'] = filters.search;
    if (filters?.ordering) params['ordering'] = filters.ordering;
    if (filters?.page) params['page'] = filters.page;

    return api.get<PaginatedResponse<ArticleListItem>>('/articles/', { params });
  },

  /**
   * Récupère un article par son slug
   */
  async getBySlug(slug: string): Promise<Article> {
    return api.get<Article>(`/articles/${slug}/`);
  },

  /**
   * Crée un nouvel article
   */
  async create(data: ArticleCreateRequest): Promise<Article> {
    return api.post<Article>('/articles/', data);
  },

  /**
   * Met à jour un article existant
   */
  async update(slug: string, data: ArticleUpdateRequest): Promise<Article> {
    return api.patch<Article>(`/articles/${slug}/`, data);
  },

  /**
   * Supprime un article
   */
  async delete(slug: string): Promise<void> {
    return api.delete<void>(`/articles/${slug}/`);
  },
};

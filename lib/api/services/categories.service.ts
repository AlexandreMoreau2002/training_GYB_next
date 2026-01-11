/**
 * =============================================================================
 * CATEGORIES SERVICE - Gestion des catégories
 * =============================================================================
 *
 * Les catégories sont en lecture seule côté frontend.
 * Elles incluent le nombre d'articles associés.
 */

import { api } from '../client';
import type { Category, PaginatedResponse } from '@/types';

export const categoriesService = {
  /**
   * Liste toutes les catégories
   * Note: L'API retourne un objet paginé, on extrait results
   */
  async getAll(): Promise<Category[]> {
    const response = await api.get<PaginatedResponse<Category>>('/categories/', { skipAuth: true });
    return response.results;
  },

  /**
   * Récupère une catégorie par son slug
   */
  async getBySlug(slug: string): Promise<Category> {
    return api.get<Category>(`/categories/${slug}/`, { skipAuth: true });
  },
};

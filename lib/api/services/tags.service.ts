/**
 * =============================================================================
 * TAGS SERVICE - Gestion des tags
 * =============================================================================
 *
 * Les tags sont en lecture seule côté frontend.
 */

import { api } from '../client';
import type { Tag, PaginatedResponse } from '@/types';

export const tagsService = {
  /**
   * Liste tous les tags
   * Note: L'API retourne un objet paginé, on extrait results
   */
  async getAll(): Promise<Tag[]> {
    const response = await api.get<PaginatedResponse<Tag>>('/tags/', { skipAuth: true });
    return response.results;
  },

  /**
   * Récupère un tag par son slug
   */
  async getBySlug(slug: string): Promise<Tag> {
    return api.get<Tag>(`/tags/${slug}/`, { skipAuth: true });
  },
};

/**
 * =============================================================================
 * COMMENTS SERVICE - Gestion des commentaires
 * =============================================================================
 *
 * Les commentaires sont liés à un article (nested route).
 * Supporte les réponses imbriquées via le champ `parent`.
 */

import { api } from '../client';
import type { Comment, CommentCreateRequest, PaginatedResponse } from '@/types';

export const commentsService = {
  /**
   * Liste les commentaires d'un article
   * Note: Les commentaires root contiennent leurs réponses nested
   */
  async getByArticle(articleSlug: string): Promise<Comment[]> {
    const response = await api.get<PaginatedResponse<Comment>>(
      `/articles/${articleSlug}/comments/`,
      { skipAuth: true }
    );
    return response.results;
  },

  /**
   * Crée un commentaire sur un article
   *
   * @param articleSlug - Slug de l'article
   * @param data - Contenu du commentaire et parent optionnel
   *
   * @example
   * // Commentaire root
   * commentsService.create('mon-article', { content: 'Super article!' })
   *
   * // Réponse à un commentaire
   * commentsService.create('mon-article', { content: 'Merci!', parent: 42 })
   */
  async create(articleSlug: string, data: CommentCreateRequest): Promise<Comment> {
    return api.post<Comment>(`/articles/${articleSlug}/comments/`, data);
  },

  /**
   * Met à jour un commentaire
   */
  async update(
    articleSlug: string,
    commentId: number,
    content: string,
  ): Promise<Comment> {
    return api.patch<Comment>(`/articles/${articleSlug}/comments/${commentId}/`, {
      content,
    });
  },

  /**
   * Supprime un commentaire
   */
  async delete(articleSlug: string, commentId: number): Promise<void> {
    return api.delete<void>(`/articles/${articleSlug}/comments/${commentId}/`);
  },
};

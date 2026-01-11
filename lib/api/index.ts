/**
 * =============================================================================
 * API MODULE - Point d'entrée unique
 * =============================================================================
 *
 * Exporte tous les services API pour un import simplifié:
 *
 * @example
 * import { articlesService, authService } from '@/lib/api';
 *
 * const articles = await articlesService.getAll();
 * await authService.login({ username: 'admin', password: 'admin123' });
 */

// Client et utilitaires
export { api, ApiError, getAccessToken, clearTokens, setTokens } from './client';

// Services
export { authService } from './services/auth.service';
export { articlesService } from './services/articles.service';
export { categoriesService } from './services/categories.service';
export { tagsService } from './services/tags.service';
export { commentsService } from './services/comments.service';

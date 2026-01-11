/**
 * =============================================================================
 * MIDDLEWARE - Point d'entrée des requêtes
 * =============================================================================
 *
 * Le middleware Next.js intercepte toutes les requêtes avant qu'elles
 * n'atteignent les pages. Ici, il gère:
 *
 * 1. ROUTING I18N:
 *    - Détecte la locale préférée de l'utilisateur (cookie, Accept-Language)
 *    - Redirige vers l'URL localisée si nécessaire
 *    - Gère le préfixe de locale dans l'URL
 *
 * 2. PROTECTION DES ROUTES (futur):
 *    - Vérification du token JWT
 *    - Redirection vers login si non authentifié
 *
 * Ordre d'exécution:
 * Requête → Middleware → Page
 */

import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

/**
 * Configuration du matcher:
 * - Exclut les fichiers statiques (_next, images, favicon)
 * - Exclut les routes API
 * - Applique le middleware à toutes les autres routes
 */
export const config = {
  matcher: [
    // Match toutes les routes sauf:
    // - _next (assets Next.js)
    // - _vercel (assets Vercel)
    // - fichiers avec extensions (images, etc.)
    // - api routes
    '/((?!_next|_vercel|api|.*\\..*).*)',
  ],
};

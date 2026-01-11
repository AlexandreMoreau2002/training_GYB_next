/**
 * =============================================================================
 * STORES - Point d'entrée
 * =============================================================================
 *
 * Zustand Stores:
 * - Léger (~1KB gzipped vs Redux ~7KB)
 * - Pas de boilerplate (pas de actions, reducers, etc.)
 * - Hooks natifs React
 * - Middleware intégré (persist, devtools, etc.)
 *
 * Pattern recommandé:
 * - Un store par domaine (auth, articles, ui, etc.)
 * - Sélecteurs pour optimiser les re-renders
 * - Actions async directement dans le store
 */

export { useAuthStore } from './auth.store';

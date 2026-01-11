/**
 * =============================================================================
 * API CLIENT - Client HTTP de base
 * =============================================================================
 *
 * Principe: Un client HTTP générique qui gère:
 * - La configuration de base (URL, headers)
 * - L'injection automatique du token JWT
 * - La gestion des erreurs standardisée
 * - Le refresh automatique du token expiré
 *
 * Ce client est utilisé par tous les services API (articles, auth, etc.)
 * Il est isomorphe: fonctionne côté serveur (RSC) et client.
 */

import { TokenPair } from '@/types';

// =============================================================================
// CONFIGURATION
// =============================================================================

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

// =============================================================================
// ERROR HANDLING
// =============================================================================

export class ApiError extends Error {
  constructor(
    public status: number,
    public statusText: string,
    public data: unknown,
  ) {
    super(`API Error: ${status} ${statusText}`);
    this.name = 'ApiError';
  }

  /** Erreur de validation (400) */
  get isValidationError(): boolean {
    return this.status === 400;
  }

  /** Non authentifié (401) */
  get isUnauthorized(): boolean {
    return this.status === 401;
  }

  /** Accès refusé (403) */
  get isForbidden(): boolean {
    return this.status === 403;
  }

  /** Ressource non trouvée (404) */
  get isNotFound(): boolean {
    return this.status === 404;
  }

  /** Récupère les messages d'erreur de validation */
  getFieldErrors(): Record<string, string[]> {
    if (this.isValidationError && typeof this.data === 'object' && this.data !== null) {
      return this.data as Record<string, string[]>;
    }
    return {};
  }
}

// =============================================================================
// TOKEN MANAGEMENT
// =============================================================================

/**
 * Récupère le token depuis les cookies (côté serveur)
 * ou depuis le localStorage (côté client - fallback)
 *
 * Note: En production, on utilise des cookies httpOnly pour la sécurité.
 * Le localStorage est utilisé ici pour simplifier le dev.
 */
export function getAccessToken(): string | null {
  if (typeof window === 'undefined') {
    // Côté serveur: on lit depuis les headers/cookies via next/headers
    // Sera géré par le middleware
    return null;
  }
  return localStorage.getItem('access_token');
}

export function getRefreshToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('refresh_token');
}

export function setTokens(tokens: TokenPair): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('access_token', tokens.access);
  localStorage.setItem('refresh_token', tokens.refresh);
}

export function clearTokens(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
}

// =============================================================================
// FETCH WRAPPER
// =============================================================================

interface FetchOptions extends RequestInit {
  /** Skip l'ajout automatique du token */
  skipAuth?: boolean;
  /** Paramètres de query string */
  params?: Record<string, string | number | undefined>;
}

/**
 * Fonction fetch wrapper avec gestion automatique:
 * - Headers JSON
 * - Token d'authentification
 * - Gestion des erreurs
 * - Query params
 */
export async function apiFetch<T>(
  endpoint: string,
  options: FetchOptions = {},
): Promise<T> {
  const { skipAuth = false, params, ...fetchOptions } = options;

  // Construction de l'URL avec query params
  let url = `${API_BASE_URL}${endpoint}`;
  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.append(key, String(value));
      }
    });
    const queryString = searchParams.toString();
    if (queryString) {
      url += `?${queryString}`;
    }
  }

  // Headers par défaut
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...fetchOptions.headers,
  };

  // Ajout du token si disponible et non skipé
  if (!skipAuth) {
    const token = getAccessToken();
    if (token) {
      (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
    }
  }

  // Exécution de la requête
  const response = await fetch(url, {
    ...fetchOptions,
    headers,
  });

  // Gestion des erreurs
  if (!response.ok) {
    let data: unknown = null;
    try {
      data = await response.json();
    } catch {
      // Pas de body JSON
    }
    throw new ApiError(response.status, response.statusText, data);
  }

  // Pas de contenu (204)
  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}

// =============================================================================
// MÉTHODES HTTP HELPERS
// =============================================================================

export const api = {
  get: <T>(endpoint: string, options?: FetchOptions) =>
    apiFetch<T>(endpoint, { ...options, method: 'GET' }),

  post: <T>(endpoint: string, data?: unknown, options?: FetchOptions) =>
    apiFetch<T>(endpoint, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    }),

  put: <T>(endpoint: string, data?: unknown, options?: FetchOptions) =>
    apiFetch<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    }),

  patch: <T>(endpoint: string, data?: unknown, options?: FetchOptions) =>
    apiFetch<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    }),

  delete: <T>(endpoint: string, options?: FetchOptions) =>
    apiFetch<T>(endpoint, { ...options, method: 'DELETE' }),
};

/**
 * =============================================================================
 * AUTH SERVICE - Gestion de l'authentification
 * =============================================================================
 *
 * Gère:
 * - Login / Logout
 * - Refresh token
 * - Récupération de l'utilisateur courant
 */

import { api, setTokens, clearTokens, getRefreshToken } from '../client';
import type { LoginRequest, TokenPair, User } from '@/types';

export const authService = {
  /**
   * Connexion avec username/password
   * Stocke les tokens et retourne la paire
   */
  async login(credentials: LoginRequest): Promise<TokenPair> {
    const tokens = await api.post<TokenPair>('/auth/login/', credentials, {
      skipAuth: true,
    });
    setTokens(tokens);
    return tokens;
  },

  /**
   * Déconnexion - supprime les tokens locaux
   */
  logout(): void {
    clearTokens();
  },

  /**
   * Rafraîchit le token d'accès
   */
  async refreshToken(): Promise<TokenPair> {
    const refresh = getRefreshToken();
    if (!refresh) {
      throw new Error('No refresh token available');
    }
    const tokens = await api.post<TokenPair>(
      '/auth/refresh/',
      { refresh },
      { skipAuth: true },
    );
    setTokens(tokens);
    return tokens;
  },

  /**
   * Récupère l'utilisateur connecté
   */
  async getMe(): Promise<User> {
    return api.get<User>('/me/');
  },

  /**
   * Met à jour le profil de l'utilisateur connecté
   */
  async updateMe(data: Partial<User>): Promise<User> {
    return api.patch<User>('/me/', data);
  },
};

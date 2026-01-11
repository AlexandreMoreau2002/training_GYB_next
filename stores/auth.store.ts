/**
 * =============================================================================
 * AUTH STORE - Gestion de l'état d'authentification
 * =============================================================================
 *
 * Store Zustand pour gérer l'état utilisateur côté client.
 *
 * Principes Zustand:
 * - create() crée le store avec l'état initial et les actions
 * - Les actions modifient l'état via set()
 * - Les composants s'abonnent au store via le hook useAuthStore
 * - Zustand gère automatiquement les re-renders optimisés
 *
 * @example
 * // Dans un composant
 * const { user, isAuthenticated, login, logout } = useAuthStore();
 *
 * // Ou sélection partielle (optimisation des re-renders)
 * const user = useAuthStore((state) => state.user);
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { User } from '@/types';
import { authService, clearTokens } from '@/lib/api';

// =============================================================================
// TYPES
// =============================================================================

interface AuthState {
  /** Utilisateur connecté (null si non authentifié) */
  user: User | null;

  /** État de chargement initial (vérification du token au démarrage) */
  isLoading: boolean;

  /** Erreur lors de l'authentification */
  error: string | null;
}

interface AuthActions {
  /** Connexion avec username/password */
  login: (username: string, password: string) => Promise<void>;

  /** Déconnexion */
  logout: () => void;

  /** Récupère l'utilisateur depuis le token stocké */
  fetchUser: () => Promise<void>;

  /** Met à jour l'utilisateur en local (après edit profil) */
  setUser: (user: User) => void;

  /** Reset l'erreur */
  clearError: () => void;
}

type AuthStore = AuthState & AuthActions;

// =============================================================================
// STORE
// =============================================================================

export const useAuthStore = create<AuthStore>()(
  // persist: sauvegarde l'état dans localStorage
  persist(
    (set, get) => ({
      // === STATE ===
      user: null,
      isLoading: true,
      error: null,

      // === ACTIONS ===

      login: async (username: string, password: string) => {
        set({ isLoading: true, error: null });

        try {
          await authService.login({ username, password });
          const user = await authService.getMe();
          set({ user, isLoading: false });
        } catch (error) {
          const message =
            error instanceof Error ? error.message : 'Erreur de connexion';
          set({ error: message, isLoading: false });
          throw error;
        }
      },

      logout: () => {
        authService.logout();
        set({ user: null, error: null });
      },

      fetchUser: async () => {
        set({ isLoading: true });

        try {
          const user = await authService.getMe();
          set({ user, isLoading: false });
        } catch {
          // Token invalide ou expiré
          clearTokens();
          set({ user: null, isLoading: false });
        }
      },

      setUser: (user: User) => {
        set({ user });
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'summit-auth',
      storage: createJSONStorage(() => localStorage),
      // On ne persiste que l'utilisateur, pas l'état de chargement
      partialize: (state) => ({ user: state.user }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.isLoading = false;
        }
      },
    },
  ),
);

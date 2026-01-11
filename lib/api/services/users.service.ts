/**
 * =============================================================================
 * USERS SERVICE - Gestion des utilisateurs (Admin)
 * =============================================================================
 */

import { api } from '../client';
import type { User, PaginatedResponse } from '@/types';

export const usersService = {
    /**
     * Récupère la liste de tous les utilisateurs
     * (Accessible uniquement aux admins)
     */
    async getAll(params?: { page?: number; search?: string }): Promise<PaginatedResponse<User>> {
        return api.get<PaginatedResponse<User>>('/users/', { params });
    },
};

/**
 * =============================================================================
 * TYPES / DTOs - Data Transfer Objects
 * =============================================================================
 *
 * Ces types reflètent exactement la structure des données retournées par l'API.
 * Ils servent de contrat entre le frontend et le backend.
 *
 * Principe: On sépare les types en 3 catégories:
 * 1. Entités (User, Article, etc.) - les modèles de données
 * 2. Requests (LoginRequest, etc.) - les payloads envoyés à l'API
 * 3. Responses (PaginatedResponse, etc.) - les structures de réponse API
 */

// =============================================================================
// USER & AUTH
// =============================================================================

export interface Profile {
  bio: string | null;
  avatar_url: string | null;
  website: string | null;
}

export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  profile: Profile;
  date_joined: string;
  is_staff: boolean;
}

/** Version minimale pour les listes (auteur d'article, etc.) */
export interface UserMinimal {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  avatar_url: string | null;
}

// =============================================================================
// ARTICLES
// =============================================================================

export type ArticleStatus = 'draft' | 'published';

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  articles_count: number;
}

export interface Tag {
  id: number;
  name: string;
  slug: string;
}

/** Article en liste (compact) */
export interface ArticleListItem {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  image_url: string | null;
  author: UserMinimal;
  category: Category | null;
  tags: Tag[];
  status: ArticleStatus;
  published_at: string | null;
  created_at: string;
}

/** Article complet (détail) */
export interface Article extends ArticleListItem {
  content: string;
  updated_at: string;
  comments: Comment[];
}

// =============================================================================
// COMMENTS
// =============================================================================

export interface Comment {
  id: number;
  author: UserMinimal;
  content: string;
  parent: number | null;
  replies: Comment[];
  created_at: string;
  updated_at: string;
}

// =============================================================================
// API REQUESTS
// =============================================================================

export interface LoginRequest {
  username: string;
  password: string;
}

export interface ArticleCreateRequest {
  title: string;
  excerpt: string;
  content: string;
  image_url?: string;
  category?: number;
  tags?: number[];
  status?: ArticleStatus;
}

export type ArticleUpdateRequest = Partial<ArticleCreateRequest>;

export interface CommentCreateRequest {
  content: string;
  parent?: number;
}

export interface ProfileUpdateRequest {
  first_name?: string;
  last_name?: string;
  email?: string;
  profile?: Partial<Profile>;
}

// =============================================================================
// API RESPONSES
// =============================================================================

export interface TokenPair {
  access: string;
  refresh: string;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

// =============================================================================
// FILTERS & PARAMS
// =============================================================================

export interface ArticleFilters {
  category?: string;
  status?: ArticleStatus;
  author?: string;
  search?: string;
  ordering?: string;
  page?: number;
}

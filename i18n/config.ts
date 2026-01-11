/**
 * =============================================================================
 * I18N CONFIGURATION
 * =============================================================================
 *
 * Configuration centralisée pour l'internationalisation avec next-intl.
 *
 * Concepts clés:
 * - locales: Liste des langues supportées
 * - defaultLocale: Langue par défaut (français car blog francophone)
 * - localePrefix: 'as-needed' = pas de /fr pour la locale par défaut
 */

export const locales = ['fr', 'en'] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'fr';

/**
 * Labels des langues pour le sélecteur
 */
export const localeNames: Record<Locale, string> = {
  fr: 'Français',
  en: 'English',
};

/**
 * Configuration du préfixe de locale dans l'URL
 * - 'always': /fr/articles, /en/articles
 * - 'as-needed': /articles (fr), /en/articles
 * - 'never': pas de préfixe (détection par header)
 */
export const localePrefix = 'as-needed' as const;

/**
 * =============================================================================
 * I18N NAVIGATION - Composants de navigation localisés
 * =============================================================================
 *
 * Exporte des versions localisées des composants Next.js:
 * - Link: liens qui préservent la locale
 * - redirect: redirection avec locale
 * - usePathname: pathname sans le préfixe de locale
 * - useRouter: router avec méthodes localisées
 *
 * @example
 * import { Link } from '@/i18n/navigation';
 * <Link href="/articles">Articles</Link>  // → /fr/articles ou /en/articles
 */

import { createNavigation } from 'next-intl/navigation';
import { routing } from './routing';

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);

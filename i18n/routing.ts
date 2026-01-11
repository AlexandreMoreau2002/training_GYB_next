/**
 * =============================================================================
 * I18N ROUTING - Configuration du routage internationalisé
 * =============================================================================
 *
 * Définit comment next-intl gère les URLs localisées.
 * Utilisé par le middleware et les composants de navigation.
 */

import { defineRouting } from 'next-intl/routing';
import { locales, defaultLocale, localePrefix } from './config';

export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix,
});

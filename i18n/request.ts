/**
 * =============================================================================
 * I18N REQUEST CONFIG - Configuration pour Server Components
 * =============================================================================
 *
 * Ce fichier configure next-intl pour les Server Components.
 * Il est appelé automatiquement par le middleware pour chaque requête.
 *
 * Principe:
 * - getRequestConfig reçoit la locale de la requête
 * - Charge dynamiquement le fichier de messages correspondant
 * - Retourne la configuration pour next-intl
 */

import { getRequestConfig } from 'next-intl/server';
import { locales, type Locale } from './config';

export default getRequestConfig(async ({ requestLocale }) => {
  // Récupère la locale depuis le middleware
  let locale = await requestLocale;

  // Validation: s'assure que la locale est supportée
  if (!locale || !locales.includes(locale as Locale)) {
    locale = 'fr';
  }

  return {
    locale,
    // Chargement dynamique des messages
    // Avantage: seuls les messages de la locale courante sont chargés
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});

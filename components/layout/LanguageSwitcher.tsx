/**
 * =============================================================================
 * LANGUAGE SWITCHER - Sélecteur de langue
 * =============================================================================
 *
 * Permet de changer de locale.
 * Utilise useRouter de next-intl pour naviguer vers la même page
 * dans une autre langue.
 *
 * Accessibilité:
 * - aria-label descriptif
 * - Indication visuelle de la langue active
 */

'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/navigation';
import { locales, localeNames, type Locale } from '@/i18n/config';

export function LanguageSwitcher() {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();

  const handleChange = (newLocale: Locale) => {
    // Navigue vers la même page dans la nouvelle locale
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <div className="flex items-center gap-1" role="group" aria-label="Sélection de la langue">
      {locales.map((loc) => (
        <button
          key={loc}
          onClick={() => handleChange(loc)}
          className={`
            px-2 py-1 text-xs font-medium rounded transition-colors
            ${
              locale === loc
                ? 'bg-[var(--color-accent)] text-white'
                : 'text-[var(--color-secondary)] hover:bg-[var(--color-border)]'
            }
          `}
          aria-pressed={locale === loc}
          aria-label={localeNames[loc]}
        >
          {loc.toUpperCase()}
        </button>
      ))}
    </div>
  );
}

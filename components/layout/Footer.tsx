/**
 * =============================================================================
 * FOOTER - Pied de page
 * =============================================================================
 *
 * Accessibilité:
 * - Landmark <footer>
 * - Liens avec texte descriptif
 */

'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

export function Footer() {
  const t = useTranslations('footer');
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[var(--color-surface)] border-t border-[var(--color-border)] mt-auto">
      <div className="max-w-[var(--max-width-content)] mx-auto px-[var(--spacing-page)] py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <Link href="/" className="text-2xl font-bold text-[var(--color-foreground)] hover:text-[var(--color-accent)]">
              Summit
            </Link>
            <p className="mt-2 text-stone-500">
              {t('tagline')}
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="font-semibold text-[var(--color-foreground)] mb-3">Navigation</h3>
            <nav className="flex flex-col gap-2">
              <Link href="/" className="text-stone-500 hover:text-[var(--color-accent)] transition-colors">
                Accueil
              </Link>
              <Link href="/articles" className="text-stone-500 hover:text-[var(--color-accent)] transition-colors">
                Articles
              </Link>
              <Link href="/categories" className="text-stone-500 hover:text-[var(--color-accent)] transition-colors">
                Catégories
              </Link>
            </nav>
          </div>

          {/* Info */}
          <div>
            <h3 className="font-semibold text-[var(--color-foreground)] mb-3">Projet</h3>
            <p className="text-stone-500 text-sm">
              {t('madeWith')} pour l&apos;apprentissage de Next.js et Django REST Framework.
            </p>
          </div>
        </div>

        <hr className="my-8 border-[var(--color-border)]" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-stone-500">
          <p>
            © {currentYear} Summit. {t('rights')}.
          </p>
          <p>
            Next.js 16 + Django 6 + DRF
          </p>
        </div>
      </div>
    </footer>
  );
}

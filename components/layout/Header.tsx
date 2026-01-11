/**
 * =============================================================================
 * HEADER - En-tête du site
 * =============================================================================
 *
 * Composant Client car il utilise:
 * - useTranslations (hook next-intl)
 * - useAuthStore (état client)
 * - Navigation interactive (mobile menu)
 *
 * Accessibilité:
 * - Landmark <header>
 * - Navigation avec aria-label
 * - Skip link pour aller au contenu
 * - Menu mobile avec aria-expanded
 */

'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Link, usePathname, useRouter } from '@/i18n/navigation'
import { useAuthStore } from '@/stores'
import { LanguageSwitcher } from './LanguageSwitcher'
import { Button } from '@/components/ui'

// =============================================================================
// TYPES
// =============================================================================

interface NavItem {
  href: string
  labelKey: string
}

const NAV_ITEMS: NavItem[] = [
  { href: '/', labelKey: 'home' },
  { href: '/articles', labelKey: 'articles' },
  { href: '/categories', labelKey: 'categories' },
]

// =============================================================================
// COMPONENT
// =============================================================================

export function Header() {
  const t = useTranslations('nav')
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAuthStore()
  const isAuthenticated = !!user
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  return (
    <header className="sticky top-0 z-50 bg-[var(--color-surface)] border-b border-[var(--color-border)]">
      {/* Skip Link - Accessibilité */}
      <a href="#main-content" className="skip-link">
        {t('skipToContent')}
      </a>

      <div className="max-w-[var(--max-width-content)] mx-auto px-[var(--spacing-page)]">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/"
            className="text-xl font-bold text-[var(--color-foreground)] hover:text-[var(--color-accent)]"
          >
            Summit
          </Link>

          {/* Navigation Desktop */}
          <nav
            className="hidden md:flex items-center gap-6"
            aria-label="Navigation principale"
          >
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  text-sm font-medium transition-colors
                  ${
                    isActive(item.href)
                      ? 'text-[var(--color-accent)]'
                      : 'text-[var(--color-secondary)] hover:text-[var(--color-foreground)]'
                  }
                `}
                aria-current={isActive(item.href) ? 'page' : undefined}
              >
                {t(item.labelKey)}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <LanguageSwitcher />

            {isAuthenticated ? (
              <div className="hidden md:flex items-center gap-4">
                {user?.is_staff && (
                  <Link
                    href="/admin/users"
                    className="text-sm font-medium text-[var(--color-secondary)] hover:text-[var(--color-foreground)]"
                  >
                    {t('admin')}
                  </Link>
                )}
                <Link
                  href="/profile"
                  className="text-sm font-medium text-[var(--color-secondary)] hover:text-[var(--color-foreground)]"
                >
                  {user?.username}
                </Link>
                <Button variant="contrast" size="sm" onClick={() => logout()}>
                  {t('logout')}
                </Button>
              </div>
            ) : (
              <Button
                variant="primary"
                size="sm"
                className="hidden md:inline-flex"
                onClick={() => router.push('/auth/login')}
              >
                {t('login')}
              </Button>
            )}

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 text-[var(--color-secondary)]"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
              aria-label={
                isMobileMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'
              }
            >
              {isMobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <nav
            id="mobile-menu"
            className="md:hidden py-4 border-t border-[var(--color-border)]"
            aria-label="Navigation mobile"
          >
            <div className="flex flex-col gap-2">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    px-3 py-2 rounded-lg text-sm font-medium transition-colors
                    ${
                      isActive(item.href)
                        ? 'bg-[var(--color-accent)]/10 text-[var(--color-accent)]'
                        : 'text-[var(--color-secondary)] hover:bg-[var(--color-border)]'
                    }
                  `}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {t(item.labelKey)}
                </Link>
              ))}

              <hr className="my-2 border-[var(--color-border)]" />

              {isAuthenticated ? (
                <>
                  {user?.is_staff && (
                    <Link
                      href="/admin/users"
                      className="px-3 py-2 rounded-lg text-sm font-medium text-[var(--color-secondary)] hover:bg-[var(--color-border)]"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {t('admin')}
                    </Link>
                  )}
                  <Link
                    href="/profile"
                    className="px-3 py-2 rounded-lg text-sm font-medium text-[var(--color-secondary)] hover:bg-[var(--color-border)]"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {t('profile')}
                  </Link>
                  <button
                    onClick={() => {
                      logout()
                      setIsMobileMenuOpen(false)
                    }}
                    className="px-3 py-2 rounded-lg text-sm font-medium text-left text-[var(--color-secondary)] hover:bg-[var(--color-border)]"
                  >
                    {t('logout')}
                  </button>
                </>
              ) : (
                <Link
                  href="/auth/login"
                  className="px-3 py-2 rounded-lg text-sm font-medium text-[var(--color-surface)] bg-[var(--color-accent)] hover:bg-orange-700 text-center"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {t('login')}
                </Link>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}

// =============================================================================
// ICONS
// =============================================================================

function MenuIcon() {
  return (
    <svg
      className="w-6 h-6"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 6h16M4 12h16M4 18h16"
      />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg
      className="w-6 h-6"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  )
}

/**
 * =============================================================================
 * BUTTON - Composant bouton réutilisable
 * =============================================================================
 *
 * Variantes:
 * - primary: Action principale (orange)
 * - secondary: Action secondaire (outline)
 * - ghost: Bouton discret (hover only)
 * - danger: Action destructive (rouge)
 *
 * Accessibilité:
 * - Supporte aria-label, aria-disabled
 * - Focus visible pour navigation clavier
 * - États disabled visuels et fonctionnels
 */

import { forwardRef, type ButtonHTMLAttributes } from 'react';

// =============================================================================
// TYPES
// =============================================================================

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'contrast';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
}

// =============================================================================
// STYLES
// =============================================================================

const baseStyles = `
  inline-flex items-center justify-center gap-2
  font-medium rounded-lg
  transition-colors duration-150
  disabled:opacity-50 disabled:cursor-not-allowed
  focus-visible:outline-2 focus-visible:outline-offset-2
`;

const variantStyles: Record<ButtonVariant, string> = {
  primary: `
    bg-[var(--color-accent)] text-white
    hover:bg-orange-700
    focus-visible:outline-[var(--color-accent)]
  `,
  secondary: `
    border-2 border-[var(--color-border)] text-[var(--color-foreground)]
    hover:bg-[var(--color-border)]
    focus-visible:outline-[var(--color-foreground)]
  `,
  ghost: `
    text-[var(--color-secondary)]
    hover:bg-[var(--color-border)] hover:text-[var(--color-foreground)]
    focus-visible:outline-[var(--color-foreground)]
  `,
  danger: `
    bg-[var(--color-error)] text-white
    hover:bg-red-700
    focus-visible:outline-[var(--color-error)]
  `,
  contrast: `
    bg-[var(--color-foreground)] text-[var(--color-background)]
    hover:opacity-90
    focus-visible:outline-[var(--color-foreground)]
  `,
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
};

// =============================================================================
// COMPONENT
// =============================================================================

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      disabled,
      className = '',
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
        {...props}
      >
        {isLoading ? (
          <>
            <LoadingSpinner />
            <span>Chargement...</span>
          </>
        ) : (
          children
        )}
      </button>
    );
  },
);

Button.displayName = 'Button';

// =============================================================================
// LOADING SPINNER
// =============================================================================

function LoadingSpinner() {
  return (
    <svg
      className="animate-spin h-4 w-4"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}

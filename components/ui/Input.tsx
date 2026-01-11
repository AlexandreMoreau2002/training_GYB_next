/**
 * =============================================================================
 * INPUT - Composant input réutilisable
 * =============================================================================
 *
 * Accessibilité:
 * - Association label via htmlFor
 * - aria-describedby pour les messages d'erreur
 * - aria-invalid pour les états d'erreur
 * - Focus visible
 */

import { forwardRef, type InputHTMLAttributes, useId } from 'react';

// =============================================================================
// TYPES
// =============================================================================

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

// =============================================================================
// COMPONENT
// =============================================================================

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, id, className = '', ...props }, ref) => {
    // Génère un ID unique stable
    const generatedId = useId();
    const inputId = id || generatedId;
    const errorId = `${inputId}-error`;
    const hintId = `${inputId}-hint`;

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-[var(--color-foreground)]"
          >
            {label}
          </label>
        )}

        <input
          ref={ref}
          id={inputId}
          aria-invalid={!!error}
          aria-describedby={
            [error && errorId, hint && hintId].filter(Boolean).join(' ') ||
            undefined
          }
          className={`
            w-full px-3 py-2
            border rounded-lg
            bg-[var(--color-surface)]
            text-[var(--color-foreground)]
            placeholder:text-[var(--color-muted)]
            transition-colors duration-150
            ${
              error
                ? 'border-[var(--color-error)] focus:border-[var(--color-error)]'
                : 'border-[var(--color-border)] focus:border-[var(--color-accent)]'
            }
            focus:outline-none focus:ring-2 focus:ring-offset-0
            ${
              error
                ? 'focus:ring-[var(--color-error)]/20'
                : 'focus:ring-[var(--color-accent)]/20'
            }
            disabled:opacity-50 disabled:cursor-not-allowed
            ${className}
          `}
          {...props}
        />

        {hint && !error && (
          <p id={hintId} className="text-sm text-[var(--color-muted)]">
            {hint}
          </p>
        )}

        {error && (
          <p
            id={errorId}
            className="text-sm text-[var(--color-error)]"
            role="alert"
          >
            {error}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = 'Input';

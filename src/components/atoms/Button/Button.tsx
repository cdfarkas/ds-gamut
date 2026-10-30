import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { t } from '../../../lib/i18n';
import type { Intent } from '../../../lib/intents';
import styles from './Button.module.css';

export type ButtonIntent = Intent;
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  intent?: ButtonIntent;
  size?: ButtonSize;
  loading?: boolean;
  children: ReactNode;
}

const sizeClass: Record<ButtonSize, string> = {
  sm: styles.sm,
  md: styles.md,
  lg: styles.lg,
};

/** Primary interactive atom. Consumes semantic tokens only; themes/skins reskin it. */
export function Button({
  intent = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  type = 'button',
  className,
  children,
  ...rest
}: ButtonProps) {
  const classes = [styles.button, sizeClass[size], className].filter(Boolean).join(' ');

  const isDisabled = disabled || loading;

  return (
    <span className={styles.frame} data-scope="button" data-part="root">
      <button
        type={type}
        className={classes}
        disabled={isDisabled}
        aria-busy={loading || undefined}
        data-scope="button"
        data-part="button"
        data-intent={intent}
        data-size={size}
        data-loading={loading || undefined}
        data-disabled={isDisabled || undefined}
        {...rest}
      >
        {loading ? (
          <>
            <span
              className={styles.spinner}
              aria-hidden="true"
              data-scope="button"
              data-part="spinner"
            />
            <span className={styles.srOnly}>{t('button.loading')}</span>
          </>
        ) : null}
        <span data-scope="button" data-part="label">
          {children}
        </span>
      </button>
    </span>
  );
}

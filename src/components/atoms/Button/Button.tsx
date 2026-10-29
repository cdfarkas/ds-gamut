import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { t } from '../../../lib/i18n';
import styles from './Button.module.css';

export type ButtonIntent = 'primary' | 'neutral' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  intent?: ButtonIntent;
  size?: ButtonSize;
  loading?: boolean;
  children: ReactNode;
}

const intentClass: Record<ButtonIntent, string> = {
  primary: styles.primary,
  neutral: styles.neutral,
  danger: styles.danger,
};

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
  const classes = [styles.button, intentClass[intent], sizeClass[size], className]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...rest}
    >
      {loading ? (
        <>
          <span className={styles.spinner} aria-hidden="true" />
          <span className={styles.srOnly}>{t('button.loading')}</span>
        </>
      ) : null}
      <span>{children}</span>
    </button>
  );
}

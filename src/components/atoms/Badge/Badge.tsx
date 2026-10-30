import type { HTMLAttributes, ReactNode } from 'react';
import styles from './Badge.module.css';

export type BadgeIntent =
  'primary' | 'neutral' | 'success' | 'warning' | 'info' | 'danger';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  intent?: BadgeIntent;
  children: ReactNode;
}

const intentClass: Record<BadgeIntent, string> = {
  primary: styles.primary,
  neutral: styles.neutral,
  success: styles.success,
  warning: styles.warning,
  info: styles.info,
  danger: styles.danger,
};

/** Non-interactive status label. Consumes semantic tokens only; themes/skins reskin it. */
export function Badge({ intent = 'neutral', className, children, ...rest }: BadgeProps) {
  const classes = [styles.badge, intentClass[intent], className]
    .filter(Boolean)
    .join(' ');

  return (
    <span
      className={classes}
      data-scope="badge"
      data-part="root"
      data-intent={intent}
      {...rest}
    >
      {children}
    </span>
  );
}

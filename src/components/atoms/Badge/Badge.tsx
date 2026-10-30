import type { HTMLAttributes, ReactNode } from 'react';
import type { Intent } from '../../../lib/intents';
import styles from './Badge.module.css';

export type BadgeIntent = Intent;

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  intent?: BadgeIntent;
  children: ReactNode;
}

/** Non-interactive status label. Consumes semantic tokens only; themes/skins reskin it. */
export function Badge({ intent = 'neutral', className, children, ...rest }: BadgeProps) {
  const classes = [styles.badge, className].filter(Boolean).join(' ');

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

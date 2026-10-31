import type { InputHTMLAttributes, ReactNode, Ref } from 'react';
import styles from './Switch.module.css';

export type SwitchSize = 'sm' | 'md' | 'lg';

export interface SwitchProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'type' | 'children'
> {
  variantSize?: SwitchSize;
  /** Sets `aria-invalid="true"` on the `<input>` and the danger border on the track. */
  invalid?: boolean;
  /** The visible label, after the track. Without it, pass `aria-label` or `aria-labelledby`. */
  children?: ReactNode;
  /** Reaches the native `<input>`. */
  ref?: Ref<HTMLInputElement>;
}

const sizeClass: Record<SwitchSize, string> = {
  sm: styles.sm,
  md: styles.md,
  lg: styles.lg,
};

/**
 * Native `<input type="checkbox" role="switch">` drawn by CSS as a track and thumb, wrapped in a
 * `<label>`. `className` and `style` land on the root `<label>`; every other prop, `ref`
 * included, lands on the native input. `readOnly` has no effect on a checkbox-type input: use
 * `disabled`.
 */
export function Switch({
  variantSize = 'md',
  invalid = false,
  disabled = false,
  children,
  className,
  style,
  ref,
  ...rest
}: SwitchProps) {
  const classes = [styles.root, sizeClass[variantSize], className]
    .filter(Boolean)
    .join(' ');

  return (
    <label
      className={classes}
      style={style}
      data-scope="switch"
      data-part="root"
      data-size={variantSize}
      data-invalid={invalid || undefined}
      data-disabled={disabled || undefined}
    >
      <input
        ref={ref}
        type="checkbox"
        role="switch"
        className={styles.track}
        disabled={disabled}
        aria-invalid={invalid || undefined}
        data-scope="switch"
        data-part="track"
        {...rest}
      />
      {children != null && (
        <span className={styles.label} data-scope="switch" data-part="label">
          {children}
        </span>
      )}
    </label>
  );
}

import type { InputHTMLAttributes, ReactNode, Ref } from 'react';
import styles from './Input.module.css';

export type InputSize = 'sm' | 'md' | 'lg';
export type InputType = 'text' | 'email' | 'url' | 'tel' | 'password';

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  variantSize?: InputSize;
  type?: InputType;
  /** Sets `aria-invalid="true"` on the `<input>` and the danger border on the root. */
  invalid?: boolean;
  /** Decorative unless you give it meaning: mark icons `aria-hidden`. */
  startAdornment?: ReactNode;
  endAdornment?: ReactNode;
  /** Reaches the native `<input>`. */
  ref?: Ref<HTMLInputElement>;
}

const sizeClass: Record<InputSize, string> = {
  sm: styles.sm,
  md: styles.md,
  lg: styles.lg,
};

/**
 * Bare single-line text control; label, hint and error belong to a wrapping field.
 * `className` and `style` land on the root wrapper (the visible box); every other prop,
 * `ref` included, lands on the native `<input>`.
 */
export function Input({
  variantSize = 'md',
  type = 'text',
  invalid = false,
  disabled = false,
  readOnly = false,
  startAdornment,
  endAdornment,
  className,
  style,
  ref,
  ...rest
}: InputProps) {
  const classes = [styles.root, sizeClass[variantSize], className]
    .filter(Boolean)
    .join(' ');

  return (
    <span
      className={classes}
      style={style}
      data-scope="input"
      data-part="root"
      data-size={variantSize}
      data-invalid={invalid || undefined}
      data-disabled={disabled || undefined}
      data-readonly={readOnly || undefined}
    >
      {startAdornment != null && (
        <span className={styles.adornment} data-scope="input" data-part="start">
          {startAdornment}
        </span>
      )}
      <input
        ref={ref}
        type={type}
        className={styles.input}
        disabled={disabled}
        readOnly={readOnly}
        aria-invalid={invalid || undefined}
        data-scope="input"
        data-part="input"
        {...rest}
      />
      {endAdornment != null && (
        <span className={styles.adornment} data-scope="input" data-part="end">
          {endAdornment}
        </span>
      )}
    </span>
  );
}

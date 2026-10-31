import {
  useCallback,
  useLayoutEffect,
  useRef,
  type InputHTMLAttributes,
  type ReactNode,
  type Ref,
} from 'react';
import styles from './Checkbox.module.css';

export type CheckboxSize = 'sm' | 'md' | 'lg';

export interface CheckboxProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'type' | 'children'
> {
  variantSize?: CheckboxSize;
  /** Sets `aria-invalid="true"` on the `<input>` and the danger border on the box. */
  invalid?: boolean;
  /** Shows the mixed state through the DOM `indeterminate` property; never changes `checked`. */
  indeterminate?: boolean;
  /** The visible label. Without it, pass `aria-label` or `aria-labelledby`. */
  children?: ReactNode;
  /** Reaches the native `<input>`. */
  ref?: Ref<HTMLInputElement>;
}

const sizeClass: Record<CheckboxSize, string> = {
  sm: styles.sm,
  md: styles.md,
  lg: styles.lg,
};

/**
 * Native checkbox drawn by CSS, wrapped in a `<label>` so the whole row is the click target.
 * `className` and `style` land on the root `<label>`; every other prop, `ref` included, lands on
 * the native `<input type="checkbox">`.
 */
export function Checkbox({
  variantSize = 'md',
  invalid = false,
  indeterminate = false,
  disabled = false,
  children,
  className,
  style,
  onChange,
  ref,
  ...rest
}: CheckboxProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const setRef = useCallback(
    (node: HTMLInputElement | null) => {
      inputRef.current = node;
      if (typeof ref === 'function') return ref(node);
      if (ref) ref.current = node;
    },
    [ref],
  );

  useLayoutEffect(() => {
    if (inputRef.current) inputRef.current.indeterminate = indeterminate;
  });

  const classes = [styles.root, sizeClass[variantSize], className]
    .filter(Boolean)
    .join(' ');

  return (
    <label
      className={classes}
      style={style}
      data-scope="checkbox"
      data-part="root"
      data-size={variantSize}
      data-invalid={invalid || undefined}
      data-disabled={disabled || undefined}
      data-indeterminate={indeterminate || undefined}
    >
      <input
        ref={setRef}
        type="checkbox"
        className={styles.input}
        disabled={disabled}
        aria-invalid={invalid || undefined}
        data-scope="checkbox"
        data-part="input"
        onChange={(event) => {
          onChange?.(event);
          // A native click clears the DOM flag even when no re-render follows.
          event.currentTarget.indeterminate = indeterminate;
        }}
        {...rest}
      />
      {children != null && (
        <span className={styles.label} data-scope="checkbox" data-part="label">
          {children}
        </span>
      )}
    </label>
  );
}

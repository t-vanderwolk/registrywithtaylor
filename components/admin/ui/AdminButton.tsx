import {
  cloneElement,
  isValidElement,
  type ButtonHTMLAttributes,
  type ReactElement,
  type ReactNode,
} from 'react';
import { cn } from './cn';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'sm' | 'md';

type AdminButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  asChild?: boolean;
  variant?: Variant;
  size?: Size;
  children: ReactNode;
};

const sizeClass: Record<Size, string> = {
  sm: 'px-3.5 py-2 text-[0.64rem]',
  md: 'px-4.5 py-2.5 text-[0.69rem]',
};

const variantClass: Record<Variant, string> = {
  primary: 'admin-btn--primary',
  secondary: 'admin-btn--secondary',
  ghost: 'admin-btn--ghost',
  danger: 'admin-btn--danger',
};

export default function AdminButton({
  asChild = false,
  variant = 'secondary',
  size = 'md',
  className,
  children,
  disabled,
  onClick,
  type = 'button',
  ...rest
}: AdminButtonProps) {
  const classes = cn('admin-btn', variantClass[variant], sizeClass[size], className);

  if (asChild && isValidElement(children)) {
    const child = children as ReactElement<{
      className?: string;
      tabIndex?: number;
      ['aria-disabled']?: boolean;
    }>;

    return cloneElement(child, {
      className: cn(classes, disabled ? 'pointer-events-none opacity-55' : '', child.props.className),
      'aria-disabled': disabled || undefined,
      tabIndex: disabled ? -1 : child.props.tabIndex,
    });
  }

  return (
    <button type={type} className={classes} disabled={disabled} onClick={onClick} {...rest}>
      {children}
    </button>
  );
}

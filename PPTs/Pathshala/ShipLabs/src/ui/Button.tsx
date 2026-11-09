import type { ButtonHTMLAttributes } from 'react';

export function Button({ variant = 'secondary', className = '', ...rest }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'ghost' }) {
  return <button type="button" className={`btn ${className}`} data-variant={variant} {...rest} />;
}

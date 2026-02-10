'use client';

import { cn } from '@/lib/utils';
import { ButtonHTMLAttributes, forwardRef } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline-gold' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', fullWidth = false, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center uppercase tracking-wider font-medium transition-all duration-300 cursor-pointer',
          {
            'bg-fiorella-gold text-white hover:bg-fiorella-gold-dark': variant === 'primary',
            'border border-fiorella-charcoal text-fiorella-charcoal hover:bg-fiorella-charcoal hover:text-white': variant === 'secondary',
            'border border-fiorella-gold text-fiorella-gold hover:bg-fiorella-gold hover:text-white': variant === 'outline-gold',
            'text-fiorella-charcoal hover:text-fiorella-gold': variant === 'ghost',
          },
          {
            'text-xs px-5 py-2': size === 'sm',
            'text-sm px-8 py-3': size === 'md',
            'text-base px-10 py-4': size === 'lg',
          },
          fullWidth && 'w-full',
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button };

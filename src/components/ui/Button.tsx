import React, { forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { twMerge } from 'tailwind-merge';

/**
 * shadcn-style primitive, art-directed for this site: square corners, hairline
 * borders, mono labels, no shadows, no default radius.
 */
export const button = cva(
  'inline-flex items-center justify-center gap-2 font-mono uppercase tracking-[0.14em] transition-[background-color,color,border-color,transform] duration-500 ease-atlas focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent disabled:opacity-40',
  {
    variants: {
      intent: {
        solid: 'bg-ink text-canvas hover:bg-accent',
        outline: 'border border-ink text-ink hover:bg-ink hover:text-canvas',
        ghost: 'text-graphite hover:text-ink',
        marker: 'border border-hairline text-graphite hover:border-ink hover:text-ink'
      },
      size: {
        sm: 'h-8 px-3 text-micro',
        md: 'h-11 px-5 text-label',
        lg: 'h-14 px-7 text-label'
      }
    },
    defaultVariants: { intent: 'outline', size: 'md' }
  }
);

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof button>;

export const Button = forwardRef<HTMLButtonElement, Props>(
  ({ className, intent, size, ...props }, ref) =>
  <button ref={ref} className={twMerge(button({ intent, size }), className)} {...props} />

);
Button.displayName = 'Button';
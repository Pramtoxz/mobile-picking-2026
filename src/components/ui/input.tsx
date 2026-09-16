import * as React from 'react';
import { cn } from '@/lib/utils';

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, type, ...props }, ref) => (
    <input
        type={type}
        ref={ref}
        className={cn(
            'flex h-12 w-full rounded-sm border-2 border-rule bg-panel px-3 text-base text-ink placeholder:text-ink-2/60',
            'focus-visible:border-ink focus-visible:outline-none',
            'disabled:cursor-not-allowed disabled:opacity-50',
            className,
        )}
        {...props}
    />
));
Input.displayName = 'Input';

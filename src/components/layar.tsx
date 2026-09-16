import * as React from 'react';
import { cn } from '@/lib/utils';

export const Layar = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
    <div className={cn('flex h-full flex-col bg-ground', className)} {...props} />
);

export const LayarKepala = ({ className, ...props }: React.HTMLAttributes<HTMLElement>) => (
    <header
        className={cn('flex h-12 shrink-0 items-center gap-3 border-b-2 border-ink bg-panel px-3', className)}
        {...props}
    />
);

export const LayarIsi = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
    <div className={cn('min-h-0 flex-1 overflow-y-auto overscroll-contain', className)} {...props} />
);

export const LayarAksi = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
    <div className={cn('shrink-0 border-t border-rule bg-panel px-3 py-2.5', className)} {...props} />
);

export const TombolKepala = ({ className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
    <button
        className={cn(
            'flex h-8 shrink-0 items-center gap-1.5 px-2 text-sm font-medium text-ink-2',
            'transition-colors hover:text-ink focus-visible:ring-2 focus-visible:ring-honda focus-visible:outline-none',
            'disabled:opacity-40 [&_svg]:size-4 [&_svg]:shrink-0',
            className,
        )}
        {...props}
    />
);

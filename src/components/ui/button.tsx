import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
    'inline-flex items-center justify-center gap-2 rounded-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-honda focus-visible:ring-offset-2 focus-visible:ring-offset-panel disabled:opacity-40 disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0',
    {
        variants: {
            variant: {
                utama: 'bg-honda text-white hover:brightness-110 active:brightness-95',
                selesai: 'bg-selesai text-white hover:brightness-110 active:brightness-95',
                garis: 'border-2 border-ink bg-transparent text-ink hover:bg-ink/[0.06]',
                senyap: 'text-ink-2 hover:bg-ink/[0.06] hover:text-ink',
            },
            size: {
                sm: 'h-9 px-3 text-sm [&_svg]:size-4',
                md: 'h-11 px-4 text-base [&_svg]:size-4',
                lg: 'h-14 px-6 text-lg [&_svg]:size-5',
                xl: 'h-16 px-8 text-xl tracking-wide uppercase [&_svg]:size-6',
            },
        },
        defaultVariants: {
            variant: 'utama',
            size: 'md',
        },
    },
);

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
        VariantProps<typeof buttonVariants> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, ...props }, ref) => (
        <button ref={ref} className={cn(buttonVariants({ variant, size, className }))} {...props} />
    ),
);
Button.displayName = 'Button';

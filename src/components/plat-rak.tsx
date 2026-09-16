import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const platVariants = cva(
    'inline-flex items-center justify-center border-ink bg-plate font-mono font-bold tracking-[0.08em] text-ink uppercase',
    {
        variants: {
            ukuran: {
                sm: 'min-w-20 border px-1.5 py-0.5 text-sm',
                md: 'min-w-28 border-2 px-2.5 py-1 text-xl',
                xl: 'w-full border-[3px] px-4 py-3 text-[2.75rem] leading-none',
            },
        },
        defaultVariants: {
            ukuran: 'sm',
        },
    },
);

interface PlatRakProps extends VariantProps<typeof platVariants> {
    kode: string;
    className?: string;
}

export const PlatRak = ({ kode, ukuran, className }: PlatRakProps) => (
    <span className={cn(platVariants({ ukuran }), className)}>{kode}</span>
);

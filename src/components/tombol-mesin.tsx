import { cn } from '@/lib/utils';
import { sensory } from '@/lib/sensory';
import { motion, type HTMLMotionProps } from 'motion/react';
import React from 'react';

export type VarianTombolMesin = 'honda' | 'selesai' | 'panel' | 'outline' | 'amber';
export type UkuranTombolMesin = 'sm' | 'md' | 'lg' | 'numpad';

interface TombolMesinProps extends Omit<HTMLMotionProps<'button'>, 'size'> {
    varian?: VarianTombolMesin;
    ukuran?: UkuranTombolMesin;
    suara?: boolean;
    children: React.ReactNode;
}

const gayaVarian: Record<VarianTombolMesin, string> = {
    honda: 'bg-honda text-white border-2 border-[#8f1212] shadow-[0_4px_0_0_#750d0d] active:shadow-[0_1px_0_0_#750d0d] shadow-[inset_0_1px_0_rgba(255,255,255,0.3)]',
    selesai: 'bg-selesai text-white border-2 border-[#125928] shadow-[0_4px_0_0_#0c401c] active:shadow-[0_1px_0_0_#0c401c] shadow-[inset_0_1px_0_rgba(255,255,255,0.3)]',
    panel: 'bg-plate text-ink border-2 border-rule shadow-[0_4px_0_0_#b5b0a4] active:shadow-[0_1px_0_0_#b5b0a4] shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] hover:bg-ground',
    outline: 'bg-panel text-ink-2 border-2 border-rule shadow-[0_3px_0_0_#cfc9bd] active:shadow-[0_1px_0_0_#cfc9bd] hover:text-ink',
    amber: 'bg-amber-600 text-white border-2 border-amber-800 shadow-[0_4px_0_0_#78350f] active:shadow-[0_1px_0_0_#78350f] shadow-[inset_0_1px_0_rgba(255,255,255,0.3)]',
};

const gayaUkuran: Record<UkuranTombolMesin, string> = {
    sm: 'h-8 px-2.5 text-xs font-mono font-bold tracking-wider',
    md: 'h-10 px-4 text-xs font-mono font-bold tracking-wider',
    lg: 'h-12 px-5 text-sm font-mono font-bold tracking-wider',
    numpad: 'h-14 sm:h-16 text-xl sm:text-2xl font-mono font-bold tracking-wider',
};

export const TombolMesin = React.forwardRef<HTMLButtonElement, TombolMesinProps>(
    ({ varian = 'panel', ukuran = 'md', suara = true, className, disabled, onClick, children, ...props }, ref) => {
        const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
            if (disabled) return;
            if (suara) {
                sensory.tap();
            }
            onClick?.(e);
        };

        return (
            <motion.button
                ref={ref}
                disabled={disabled}
                onClick={handleClick}
                whileTap={disabled ? undefined : { y: 3 }}
                transition={{ type: 'spring', stiffness: 600, damping: 35 }}
                className={cn(
                    'relative select-none inline-flex items-center justify-center gap-2 rounded-xs uppercase cursor-pointer',
                    'transition-colors duration-75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-honda',
                    'disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none',
                    gayaVarian[varian],
                    gayaUkuran[ukuran],
                    className,
                )}
                {...props}
            >
                {children}
            </motion.button>
        );
    },
);

TombolMesin.displayName = 'TombolMesin';

import { cn } from '@/lib/utils';
import React from 'react';

export type StatusPilot = 'waiting' | 'done' | 'final' | 'progress';

interface LampuPilotProps {
    status: StatusPilot;
    label?: string;
    ukuran?: 'sm' | 'md';
    className?: string;
}

const gayaLensa: Record<StatusPilot, { border: string; bg: string; glow: string; text: string }> = {
    done: {
        border: 'border-emerald-700',
        bg: 'bg-emerald-500',
        glow: 'shadow-[0_0_8px_rgba(16,185,129,0.7)]',
        text: 'text-emerald-800',
    },
    waiting: {
        border: 'border-amber-700',
        bg: 'bg-amber-500',
        glow: 'shadow-[0_0_8px_rgba(245,158,11,0.6)]',
        text: 'text-amber-800',
    },
    progress: {
        border: 'border-blue-700',
        bg: 'bg-blue-500',
        glow: 'shadow-[0_0_8px_rgba(59,130,246,0.7)] animate-pulse',
        text: 'text-blue-800',
    },
    final: {
        border: 'border-neutral-700',
        bg: 'bg-neutral-500',
        glow: 'shadow-none',
        text: 'text-neutral-700',
    },
};

export const LampuPilot: React.FC<LampuPilotProps> = ({ status, label, ukuran = 'sm', className }) => {
    const config = gayaLensa[status] ?? gayaLensa.waiting;

    return (
        <div className={cn('inline-flex items-center gap-1.5 select-none font-mono', className)}>
            {/* Bezel Logam Luar + Lensa Lampu */}
            <span className="relative flex items-center justify-center size-3.5 rounded-full border border-ink/40 bg-plate p-0.5 shadow-xs">
                <span
                    className={cn(
                        'size-full rounded-full border transition-all duration-300',
                        config.border,
                        config.bg,
                        config.glow,
                    )}
                />
            </span>
            {label && (
                <span
                    className={cn(
                        'text-[10px] font-bold tracking-wider uppercase',
                        ukuran === 'sm' ? 'text-[10px]' : 'text-xs',
                        config.text,
                    )}
                >
                    {label}
                </span>
            )}
        </div>
    );
};

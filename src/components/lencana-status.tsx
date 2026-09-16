import { cn } from '@/lib/utils';
import type { BarisDo } from '@/types';

const gaya: Record<BarisDo['status_do'], string> = {
    Done: 'border-selesai/40 bg-selesai/10 text-selesai',
    'On Progress': 'border-amber-600/40 bg-amber-500/10 text-amber-700',
    Waiting: 'border-honda/40 bg-honda/10 text-honda',
};

export const LencanaStatus = ({ status, className }: { status: BarisDo['status_do']; className?: string }) => (
    <span
        className={cn(
            'inline-flex items-center rounded-xs border px-1.5 py-0.5 font-mono text-[10px] font-bold tracking-wider uppercase',
            gaya[status] ?? 'border-rule bg-panel text-ink-2',
            className,
        )}
    >
        {status}
    </span>
);

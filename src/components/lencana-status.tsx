import { cn } from '@/lib/utils';
import type { BarisDo } from '@/types';

const gaya: Record<BarisDo['status_do'], string> = {
    Done: 'border-selesai text-selesai',
    'On Progress': 'border-ink text-ink',
    Waiting: 'border-honda text-honda',
};

export const LencanaStatus = ({ status, className }: { status: BarisDo['status_do']; className?: string }) => (
    <span
        className={cn(
            'inline-flex items-center border bg-panel px-1.5 py-px font-mono text-[10px] font-bold tracking-wider uppercase',
            gaya[status],
            className,
        )}
    >
        {status}
    </span>
);

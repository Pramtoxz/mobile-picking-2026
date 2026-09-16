import { LencanaStatus } from '@/components/lencana-status';
import { cn } from '@/lib/utils';
import type { BarisDo } from '@/types';
import { ChevronRight } from 'lucide-react';

interface BarisDoItemProps {
    item: BarisDo;
    nomor: number;
    onClick: () => void;
}

export function KepalaKolomDo() {
    return (
        <div className="sticky top-0 z-10 flex items-center gap-2 border-b-2 border-ink bg-plate px-3 py-1.5 font-mono text-[10px] font-bold tracking-wider text-ink-2 uppercase select-none">
            <span className="w-7 shrink-0 text-right">No.</span>
            <span className="min-w-0 flex-1">Nomor DO / Channel</span>
            <span className="w-24 shrink-0">Status</span>
            <span className="w-12 shrink-0 text-right">Item</span>
            <span className="w-14 shrink-0 text-right">Picking</span>
            <span className="w-24 shrink-0 text-center">Progress</span>
            <span className="w-4 shrink-0" />
        </div>
    );
}

export default function BarisDoItem({ item, nomor, onClick }: BarisDoItemProps) {
    const persen = item.total_items > 0 ? Math.round((item.done_parts / item.total_items) * 100) : 0;
    const warnaBar = persen === 100 ? 'bg-selesai' : persen > 0 ? 'bg-amber-600' : 'bg-rule';

    return (
        <li>
            <button
                type="button"
                onClick={onClick}
                className="flex w-full items-center gap-2 border-l-4 border-transparent px-3 py-2 text-left transition-colors hover:bg-plate active:bg-plate/80 focus-visible:border-honda focus-visible:bg-plate focus-visible:outline-none select-none min-h-[46px]"
            >
                <span className="w-7 shrink-0 text-right font-mono text-[11px] font-semibold text-ink-2">
                    {nomor}
                </span>

                <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-1.5">
                        <span className="truncate font-mono text-sm font-bold text-ink">
                            {item.fk_do}
                        </span>
                        {item.is_bundling && (
                            <span className="shrink-0 bg-honda px-1.5 py-px font-mono text-[9px] font-bold tracking-wider text-white uppercase rounded-xs">
                                Urgent
                            </span>
                        )}
                    </span>
                    <span className="mt-0.5 flex items-center gap-1.5 truncate text-[11px] text-ink-2">
                        <span className="truncate font-medium">{item.nama_channel}</span>
                        {item.area ? (
                            <span className="font-mono text-[10px] px-1 bg-plate border border-rule rounded-xs">
                                {item.area}
                            </span>
                        ) : null}
                    </span>
                </span>

                <span className="w-24 shrink-0">
                    <LencanaStatus status={item.status_do} />
                </span>

                <span className="w-12 shrink-0 text-right font-mono text-xs font-bold text-ink">
                    {item.total_items}
                </span>

                <span className="w-14 shrink-0 text-right font-mono text-xs text-ink-2">
                    {item.total_picking}
                </span>

                <span className="flex w-24 shrink-0 items-center gap-1.5">
                    <span className="relative h-2.5 flex-1 overflow-hidden rounded-xs border border-rule bg-panel">
                        <span
                            className={cn('block h-full transition-all duration-300', warnaBar)}
                            style={{ width: `${persen}%` }}
                        />
                    </span>
                    <span
                        className={cn(
                            'w-7 text-right font-mono text-[10px] font-bold',
                            persen === 100 ? 'text-selesai' : persen > 0 ? 'text-amber-700' : 'text-ink-2',
                        )}
                    >
                        {persen}%
                    </span>
                </span>

                <ChevronRight className="size-4 shrink-0 text-ink-2" />
            </button>
        </li>
    );
}

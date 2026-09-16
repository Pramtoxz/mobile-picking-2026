import { PlatRak } from '@/components/plat-rak';
import { cn } from '@/lib/utils';
import type { BarisPart } from '@/types';
import { Check, Lock, MapPin } from 'lucide-react';

interface DaftarPartProps {
    parts: BarisPart[];
    idTerpilih: number | null;
    onPilih: (part: BarisPart) => void;
}

export default function DaftarPart({ parts, idTerpilih, onPilih }: DaftarPartProps) {
    return (
        <div className="flex h-full flex-col select-none">
            {/* Sticky Header Antrean */}
            <div className="sticky top-0 z-10 flex shrink-0 items-center justify-between border-b border-rule bg-plate/90 px-3 py-1.5 backdrop-blur-xs">
                <span className="flex items-center gap-1.5 font-mono text-[10px] font-bold tracking-wider text-ink uppercase">
                    <MapPin className="size-3 text-honda" />
                    Antrean Rak
                </span>
                <span className="font-mono text-[10px] font-semibold text-ink-2">
                    {parts.length} Part
                </span>
            </div>

            {/* List Part dalam DO */}
            <ul className="divide-y divide-rule flex-1 overflow-y-auto">
                {parts.map((part) => {
                    const terpilih = part.id === idTerpilih;
                    const selesai = part.status_picking_list === 'done';
                    const terkunci = part.status_picking_list === 'final';

                    return (
                        <li key={part.id}>
                            <button
                                type="button"
                                onClick={() => onPilih(part)}
                                aria-current={terpilih}
                                className={cn(
                                    'flex w-full items-center gap-2 border-l-4 px-2.5 py-2 text-left transition-colors min-h-[44px]',
                                    'focus-visible:outline-none select-none',
                                    terpilih
                                        ? 'border-honda bg-plate/90 shadow-xs'
                                        : 'border-transparent hover:bg-plate/50 active:bg-plate focus-visible:bg-plate',
                                    (selesai || terkunci) && !terpilih && 'opacity-60',
                                )}
                            >
                                <PlatRak kode={part.lokasi_part} ukuran="sm" />

                                <span className="min-w-0 flex-1">
                                    <span className="block truncate font-mono text-xs font-bold text-ink">
                                        {part.fk_part}
                                    </span>
                                    <span className="block truncate text-[10px] text-ink-2">
                                        {part.nm_part ?? '-'}
                                    </span>
                                </span>

                                <span className="shrink-0 font-mono text-xs font-bold px-1.5 py-0.5 rounded-xs bg-panel border border-rule text-ink">
                                    {part.qty_part}
                                </span>

                                <span className="w-4 shrink-0 flex items-center justify-center">
                                    {terkunci ? (
                                        <Lock className="size-3.5 text-ink-2" />
                                    ) : selesai ? (
                                        <Check className="size-4 text-selesai" strokeWidth={3} />
                                    ) : null}
                                </span>
                            </button>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}

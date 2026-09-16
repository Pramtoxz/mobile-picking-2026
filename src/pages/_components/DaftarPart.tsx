import { PlatRak } from '@/components/plat-rak';
import { cn } from '@/lib/utils';
import type { BarisPart } from '@/types';
import { Check, Lock } from 'lucide-react';

interface DaftarPartProps {
    parts: BarisPart[];
    idTerpilih: number | null;
    onPilih: (part: BarisPart) => void;
}

export default function DaftarPart({ parts, idTerpilih, onPilih }: DaftarPartProps) {
    return (
        <ul className="divide-y divide-rule">
            {parts.map((part) => {
                const terpilih = part.id === idTerpilih;
                const selesai = part.status_picking_list === 'done';
                const terkunci = part.status_picking_list === 'final';

                return (
                    <li key={part.id}>
                        <button
                            onClick={() => onPilih(part)}
                            aria-current={terpilih}
                            className={cn(
                                'flex w-full items-center gap-2.5 border-l-4 px-2.5 py-2 text-left transition-colors',
                                'focus-visible:outline-none',
                                terpilih
                                    ? 'border-honda bg-plate'
                                    : 'border-transparent hover:bg-plate focus-visible:bg-plate',
                                (selesai || terkunci) && !terpilih && 'opacity-55',
                            )}
                        >
                            <PlatRak kode={part.lokasi_part} />

                            <span className="min-w-0 flex-1">
                                <span className="block truncate font-mono text-xs font-semibold text-ink">
                                    {part.fk_part}
                                </span>
                                <span className="block truncate text-[11px] text-ink-2">{part.nm_part ?? '-'}</span>
                            </span>

                            <span className="shrink-0 font-mono text-sm font-bold text-ink">{part.qty_part}</span>

                            <span className="w-4 shrink-0">
                                {terkunci ? (
                                    <Lock className="size-4 text-ink-2" />
                                ) : selesai ? (
                                    <Check className="size-4 text-selesai" strokeWidth={3} />
                                ) : null}
                            </span>
                        </button>
                    </li>
                );
            })}
        </ul>
    );
}

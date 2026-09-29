import { LampuPilot, type StatusPilot } from '@/components/lampu-pilot';
import { PlatRak } from '@/components/plat-rak';
import { sensory } from '@/lib/sensory';
import { cn } from '@/lib/utils';
import type { BarisPart } from '@/types';
import { motion } from 'motion/react';
import { Lock, MapPin } from 'lucide-react';

interface DaftarPartProps {
    parts: BarisPart[];
    idTerpilih: number | null;
    onPilih: (part: BarisPart) => void;
}

export default function DaftarPart({ parts, idTerpilih, onPilih }: DaftarPartProps) {
    const handlePilih = (part: BarisPart) => {
        sensory.tap();
        onPilih(part);
    };

    return (
        <div className="flex h-full flex-col select-none">
            {/* Sticky Header Antrean */}
            <div className="sticky top-0 z-10 flex shrink-0 items-center justify-between border-b-2 border-ink bg-plate px-3 py-1.5 backdrop-blur-xs">
                <span className="flex items-center gap-1.5 font-mono text-[10px] font-bold tracking-wider text-ink uppercase">
                    <MapPin className="size-3.5 text-honda" />
                    Antrean Rak Gudang
                </span>
                <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded-xs bg-ink text-white">
                    {parts.length} PART
                </span>
            </div>

            {/* List Part dalam DO */}
            <ul className="divide-y divide-rule flex-1 overflow-y-auto">
                {parts.map((part, index) => {
                    const terpilih = part.id === idTerpilih;
                    const selesai = part.status_picking_list === 'done';
                    const terkunci = part.status_picking_list === 'final';

                    const pilotStatus: StatusPilot = selesai
                        ? 'done'
                        : terkunci
                        ? 'final'
                        : 'waiting';

                    return (
                        <motion.li
                            key={part.id}
                            whileTap={{ scale: 0.98 }}
                            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                        >
                            <button
                                type="button"
                                onClick={() => handlePilih(part)}
                                aria-current={terpilih}
                                className={cn(
                                    'flex w-full items-center gap-2 border-l-4 px-2.5 py-2 text-left transition-all min-h-[46px]',
                                    'focus-visible:outline-none select-none cursor-pointer',
                                    terpilih
                                        ? 'border-honda bg-honda/10 font-bold'
                                        : 'border-transparent hover:bg-plate/60 active:bg-plate',
                                    (selesai || terkunci) && !terpilih && 'opacity-65',
                                )}
                            >
                                <span className="font-mono text-[10px] font-bold text-ink-2 w-4 text-center">
                                    {index + 1}
                                </span>

                                <PlatRak kode={part.lokasi_part} ukuran="sm" />

                                <span className="min-w-0 flex-1">
                                    <span className="block truncate font-mono text-xs font-bold text-ink">
                                        {part.fk_part}
                                    </span>
                                    <span className="block truncate text-[10px] text-ink-2">
                                        {part.nm_part ?? '-'}
                                    </span>
                                </span>

                                <span className="shrink-0 font-mono text-xs font-black px-2 py-0.5 rounded-xs bg-panel border-2 border-ink text-ink shadow-2xs">
                                    {part.qty_part}
                                </span>

                                <span className="w-4 shrink-0 flex items-center justify-center">
                                    {terkunci ? (
                                        <Lock className="size-3.5 text-ink-2" />
                                    ) : (
                                        <LampuPilot status={pilotStatus} />
                                    )}
                                </span>
                            </button>
                        </motion.li>
                    );
                })}
            </ul>
        </div>
    );
}

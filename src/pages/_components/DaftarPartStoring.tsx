import { LampuPilot, type StatusPilot } from '@/components/lampu-pilot';
import { PlatRak } from '@/components/plat-rak';
import { sensory } from '@/lib/sensory';
import { cn } from '@/lib/utils';
import type { BarisPartStoring } from '@/types';
import { motion } from 'motion/react';
import { Box, MapPin } from 'lucide-react';

interface DaftarPartStoringProps {
    parts: BarisPartStoring[];
    idTerpilih: number | null;
    onPilih: (part: BarisPartStoring) => void;
}

export default function DaftarPartStoring({ parts, idTerpilih, onPilih }: DaftarPartStoringProps) {
    const handlePilih = (part: BarisPartStoring) => {
        sensory.tap();
        onPilih(part);
    };

    return (
        <div className="flex h-full flex-col select-none">
            <div className="sticky top-0 z-10 flex shrink-0 items-center justify-between border-b-2 border-ink bg-plate px-3 py-1.5 backdrop-blur-xs">
                <span className="flex items-center gap-1.5 font-mono text-[10px] font-bold tracking-wider text-ink uppercase">
                    <MapPin className="size-3.5 text-honda" />
                    Antrean Rak Storing
                </span>
                <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded-xs bg-ink text-white">
                    {parts.length} PART
                </span>
            </div>

            <ul className="divide-y divide-rule flex-1 overflow-y-auto">
                {parts.map((part, index) => {
                    const terpilih = part.id === idTerpilih;
                    const selesai = part.status_masuk;

                    const pilotStatus: StatusPilot = selesai ? 'done' : 'waiting';

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
                                    selesai && !terpilih && 'opacity-65',
                                )}
                            >
                                <span className="font-mono text-[10px] font-bold text-ink-2 w-4 text-center">
                                    {index + 1}
                                </span>

                                <PlatRak kode={part.kode_rak} ukuran="sm" />

                                <span className="min-w-0 flex-1">
                                    <span className="block truncate font-mono text-xs font-bold text-ink">
                                        {part.no_part}
                                    </span>
                                    <span className="block truncate text-[10px] text-ink-2">
                                        {part.nm_part || '-'}
                                    </span>
                                </span>

                                {part.no_doos && (
                                    <span className="shrink-0 flex items-center gap-1 font-mono text-[10px] px-1.5 py-0.5 rounded-2xs bg-panel border border-rule text-ink-2">
                                        <Box className="size-2.5" />
                                        {part.no_doos}
                                    </span>
                                )}

                                <span className="shrink-0 font-mono text-xs font-black px-2 py-0.5 rounded-xs bg-panel border-2 border-ink text-ink shadow-2xs">
                                    {part.qty_masuk !== null ? `${part.qty_masuk}/${part.qty_diterima}` : part.qty_diterima}
                                </span>

                                <span className="w-4 shrink-0 flex items-center justify-center">
                                    <LampuPilot status={pilotStatus} />
                                </span>
                            </button>
                        </motion.li>
                    );
                })}
            </ul>
        </div>
    );
}

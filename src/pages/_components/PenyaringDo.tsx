import { sensory } from '@/lib/sensory';
import { cn } from '@/lib/utils';
import { SEMUA_AREA, STATUS_BAWAAN, type SaringDo } from '@/types';
import { motion } from 'motion/react';
import { Calendar, MapPin, RotateCcw, Search, X } from 'lucide-react';

interface PenyaringDoProps {
    saring: SaringDo;
    daftarAreaChannel: string[];
    adaPenyaring: boolean;
    onUbah: (perubahan: Partial<SaringDo>) => void;
    onReset: () => void;
}

const statusAktif = (status: string | null) => status ?? STATUS_BAWAAN;

export default function PenyaringDo({
    saring,
    daftarAreaChannel,
    adaPenyaring,
    onUbah,
    onReset,
}: PenyaringDoProps) {
    const statusSekarang = statusAktif(saring.status);

    const handlePilihStatus = (val: string) => {
        sensory.tap();
        onUbah({ status: val === STATUS_BAWAAN ? null : val });
    };

    return (
        <div className="shrink-0 space-y-1.5 border-b-2 border-ink bg-plate px-3 py-2 select-none shadow-2xs">
            {/* Baris 1: Pencarian + Area + Segmented Tabs Status */}
            <div className="flex flex-wrap items-center gap-2">
                {/* Search Box Terminal Inset */}
                <div className="relative min-w-44 flex-1">
                    <Search className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-ink-2" />
                    <input
                        value={saring.cari ?? ''}
                        onChange={(e) => onUbah({ cari: e.target.value || null })}
                        placeholder="Cari DO, dealer, channel..."
                        aria-label="Cari DO, channel, atau dealer"
                        className="h-9 w-full rounded-xs border-2 border-ink bg-panel pr-8 pl-8 font-mono text-xs font-bold text-ink placeholder:text-ink-2/60 shadow-[inset_0_2px_4px_rgba(0,0,0,0.06)] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-honda"
                    />
                    {saring.cari && (
                        <button
                            type="button"
                            onClick={() => {
                                sensory.tap();
                                onUbah({ cari: null });
                            }}
                            className="absolute top-1/2 right-2 -translate-y-1/2 flex size-6 items-center justify-center rounded text-ink-2 hover:bg-rule hover:text-ink"
                            aria-label="Hapus pencarian"
                        >
                            <X className="size-3.5" />
                        </button>
                    )}
                </div>

                {/* Segmented Quick Filter Tabs */}
                <div className="flex rounded-xs border-2 border-ink bg-panel p-0.5 shadow-[1px_1px_0_0_#17150f]">
                    <button
                        type="button"
                        onClick={() => handlePilihStatus(STATUS_BAWAAN)}
                        className={cn(
                            'px-2.5 py-1 font-mono text-[10px] font-black uppercase tracking-wider rounded-2xs transition-all cursor-pointer',
                            statusSekarang === STATUS_BAWAAN
                                ? 'bg-ink text-white shadow-xs'
                                : 'text-ink-2 hover:text-ink hover:bg-plate',
                        )}
                    >
                        Antrean Aktif
                    </button>
                    <button
                        type="button"
                        onClick={() => handlePilihStatus('Done')}
                        className={cn(
                            'px-2.5 py-1 font-mono text-[10px] font-black uppercase tracking-wider rounded-2xs transition-all cursor-pointer',
                            statusSekarang === 'Done'
                                ? 'bg-selesai text-white shadow-xs'
                                : 'text-ink-2 hover:text-ink hover:bg-plate',
                        )}
                    >
                        Selesai (Done)
                    </button>
                    <button
                        type="button"
                        onClick={() => handlePilihStatus('all')}
                        className={cn(
                            'px-2.5 py-1 font-mono text-[10px] font-black uppercase tracking-wider rounded-2xs transition-all cursor-pointer',
                            statusSekarang === 'all'
                                ? 'bg-ink text-white shadow-xs'
                                : 'text-ink-2 hover:text-ink hover:bg-plate',
                        )}
                    >
                        Semua Hari Ini
                    </button>
                </div>

                {/* Area Dropdown */}
                <div className="relative flex items-center">
                    <MapPin className="pointer-events-none absolute left-2 size-3 text-honda z-10" />
                    <select
                        value={saring.area ?? SEMUA_AREA}
                        onChange={(e) => {
                            sensory.tap();
                            onUbah({ area: e.target.value === SEMUA_AREA ? null : e.target.value });
                        }}
                        aria-label="Saring area channel"
                        className="h-9 shrink-0 rounded-xs border-2 border-ink bg-panel pr-3 pl-6 font-mono text-xs font-black text-ink shadow-[1px_1px_0_0_#17150f] focus-visible:outline-none max-w-40"
                    >
                        <option value={SEMUA_AREA}>Semua Area</option>
                        {daftarAreaChannel.map((nama) => (
                            <option key={nama} value={nama}>
                                {nama}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Reset Button Taktil */}
                {adaPenyaring && (
                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                            sensory.tap();
                            onReset();
                        }}
                        aria-label="Reset penyaring"
                        className="flex h-9 shrink-0 items-center gap-1.5 rounded-xs border-2 border-honda bg-honda/10 px-2.5 text-xs font-black text-honda shadow-[1px_1px_0_0_#750d0d] hover:bg-honda/20 transition-all cursor-pointer"
                        title="Reset semua filter"
                    >
                        <RotateCcw className="size-3.5" />
                        <span className="font-mono text-[10px] uppercase tracking-wider">Reset</span>
                    </motion.button>
                )}
            </div>

            {/* Baris 2: Rentang Tanggal jika Status = Done */}
            {saring.status === 'Done' && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="flex items-center gap-2 pt-1 border-t border-rule/60"
                >
                    <span className="flex items-center gap-1 font-mono text-[10px] font-bold text-ink-2 uppercase">
                        <Calendar className="size-3 text-honda" />
                        Periode DO:
                    </span>
                    <input
                        type="date"
                        value={saring.tgl_dari ?? ''}
                        onChange={(e) => onUbah({ tgl_dari: e.target.value || null })}
                        aria-label="Dari tanggal"
                        className="h-8 rounded-xs border-2 border-ink bg-panel px-2 font-mono text-xs font-bold text-ink shadow-2xs"
                    />
                    <span className="font-mono text-[10px] font-black text-ink-2 uppercase">S/D</span>
                    <input
                        type="date"
                        value={saring.tgl_sampai ?? ''}
                        onChange={(e) => onUbah({ tgl_sampai: e.target.value || null })}
                        aria-label="Sampai tanggal"
                        className="h-8 rounded-xs border-2 border-ink bg-panel px-2 font-mono text-xs font-bold text-ink shadow-2xs"
                    />
                    <span className="font-mono text-[10px] text-ink-2 italic">
                        (Kosongkan untuk riwayat hari ini)
                    </span>
                </motion.div>
            )}
        </div>
    );
}

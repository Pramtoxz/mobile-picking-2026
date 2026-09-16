import { cn } from '@/lib/utils';
import { SEMUA_AREA, STATUS_BAWAAN, type SaringDo } from '@/types';
import { RotateCcw, Search } from 'lucide-react';

interface PenyaringDoProps {
    saring: SaringDo;
    daftarAreaChannel: string[];
    adaPenyaring: boolean;
    onUbah: (perubahan: Partial<SaringDo>) => void;
    onReset: () => void;
}

const kelasPilih =
    'h-8 shrink-0 rounded-sm border border-rule bg-panel px-2 font-mono text-xs font-medium text-ink focus-visible:border-ink focus-visible:outline-none';

export default function PenyaringDo({
    saring,
    daftarAreaChannel,
    adaPenyaring,
    onUbah,
    onReset,
}: PenyaringDoProps) {
    return (
        <div className="shrink-0 space-y-1.5 border-b border-rule bg-plate px-3 py-2">
            <div className="flex items-center gap-1.5">
                <div className="relative min-w-0 flex-1">
                    <Search className="pointer-events-none absolute top-1/2 left-2 size-3.5 -translate-y-1/2 text-ink-2" />
                    <input
                        value={saring.cari ?? ''}
                        onChange={(e) => onUbah({ cari: e.target.value || null })}
                        placeholder="Cari DO, channel, dealer"
                        aria-label="Cari DO, channel, atau dealer"
                        className="h-8 w-full rounded-sm border border-rule bg-panel pr-2 pl-7 text-xs text-ink placeholder:text-ink-2/70 focus-visible:border-ink focus-visible:outline-none"
                    />
                </div>

                <select
                    value={saring.status ?? STATUS_BAWAAN}
                    onChange={(e) => onUbah({ status: e.target.value === STATUS_BAWAAN ? null : e.target.value })}
                    aria-label="Saring status"
                    className={kelasPilih}
                >
                    <option value={STATUS_BAWAAN}>On Progress &amp; Waiting</option>
                    <option value="all">Semua Status (hari ini)</option>
                    <option value="Done">Done</option>
                    <option value="On Progress">On Progress</option>
                    <option value="Waiting">Waiting</option>
                </select>

                <select
                    value={saring.area ?? SEMUA_AREA}
                    onChange={(e) => onUbah({ area: e.target.value === SEMUA_AREA ? null : e.target.value })}
                    aria-label="Saring area channel"
                    className={cn(kelasPilih, 'max-w-36')}
                >
                    <option value={SEMUA_AREA}>Semua area</option>
                    {daftarAreaChannel.map((nama) => (
                        <option key={nama} value={nama}>
                            {nama}
                        </option>
                    ))}
                </select>

                {adaPenyaring && (
                    <button
                        onClick={onReset}
                        aria-label="Reset penyaring"
                        className="flex h-8 shrink-0 items-center gap-1 border border-rule bg-panel px-2 text-xs font-medium text-ink-2 hover:text-ink"
                    >
                        <RotateCcw className="size-3.5" />
                    </button>
                )}
            </div>

            {saring.status === 'Done' && (
                <div className="flex items-center gap-1.5">
                    <input
                        type="date"
                        value={saring.tgl_dari ?? ''}
                        onChange={(e) => onUbah({ tgl_dari: e.target.value || null })}
                        aria-label="Dari tanggal"
                        className={cn(kelasPilih, 'flex-1')}
                    />
                    <span className="font-mono text-[10px] text-ink-2">s/d</span>
                    <input
                        type="date"
                        value={saring.tgl_sampai ?? ''}
                        onChange={(e) => onUbah({ tgl_sampai: e.target.value || null })}
                        aria-label="Sampai tanggal"
                        className={cn(kelasPilih, 'flex-1')}
                    />
                    <span className="font-mono text-[10px] text-ink-2">kosong = hari ini</span>
                </div>
            )}
        </div>
    );
}

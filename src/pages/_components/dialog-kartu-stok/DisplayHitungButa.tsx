import { PlatRak } from '@/components/plat-rak';
import type { ItemKartuStok } from '@/types';
import { AlertTriangle, Lock } from 'lucide-react';

interface DisplayHitungButaProps {
    items: ItemKartuStok[];
    itemAktifIndex: number;
    onPilihItem: (index: number) => void;
    nilaiInput: string;
    peringatan: string | null;
}

export default function DisplayHitungButa({
    items,
    itemAktifIndex,
    onPilihItem,
    nilaiInput,
    peringatan,
}: DisplayHitungButaProps) {
    const itemAktif = items[itemAktifIndex] ?? items[0];

    return (
        <div className="flex flex-col justify-between h-full space-y-2 p-1">
            {/* Header info */}
            <div>
                <div className="flex items-center gap-1.5 text-ink-2 font-mono text-[11px] font-bold tracking-widest uppercase">
                    <Lock className="size-3.5 text-honda shrink-0" />
                    Hitung Buta (Verifikasi Fisik)
                </div>
                <p className="mt-0.5 text-[11px] text-ink-2 leading-tight">
                    Hitung barang fisik dari rak, masukkan angkanya. Nilai target sengaja disembunyikan.
                </p>
            </div>

            {/* Multiple item selector jika batch */}
            {items.length > 1 && (
                <div className="flex gap-1 overflow-x-auto py-1 border-y border-rule">
                    {items.map((item, idx) => {
                        const aktif = idx === itemAktifIndex;
                        const terisi = (item.jumlah_input ?? 0) > 0;
                        return (
                            <button
                                key={idx}
                                type="button"
                                onClick={() => onPilihItem(idx)}
                                className={`px-2 py-1 text-xs font-mono font-bold rounded-xs border ${
                                    aktif
                                        ? 'bg-ink text-white border-ink'
                                        : terisi
                                        ? 'bg-selesai/15 text-selesai border-selesai/40'
                                        : 'bg-panel text-ink border-rule'
                                }`}
                            >
                                Part {idx + 1}
                            </button>
                        );
                    })}
                </div>
            )}

            {/* Tampilan Plat Rak & Part Number */}
            <div className="space-y-1.5 bg-plate/40 p-2 border border-rule rounded-sm">
                <div className="flex items-center justify-between gap-2">
                    <PlatRak kode={itemAktif?.lokasi_part ?? '-'} ukuran="md" />
                    {items.length > 1 && (
                        <span className="font-mono text-xs font-semibold text-ink-2">
                            Item {itemAktifIndex + 1} dari {items.length}
                        </span>
                    )}
                </div>
                <p className="font-mono text-base sm:text-lg font-bold text-ink truncate">
                    {itemAktif?.fk_part}
                </p>
            </div>

            {/* Display Input Angka Masukan */}
            <div className="flex flex-col items-center justify-center bg-panel border-2 border-ink rounded-sm py-2 px-3">
                <span className="font-mono text-[10px] tracking-widest text-ink-2 uppercase mb-0.5">
                    Jumlah Fisik Diambil (PCS)
                </span>
                <div className="font-mono text-3xl sm:text-4xl font-bold tracking-wider text-ink">
                    {nilaiInput || <span className="text-rule">0</span>}
                </div>
            </div>

            {/* Peringatan error validasi hitung buta */}
            {peringatan && (
                <div className="flex items-start gap-1.5 border-l-4 border-honda bg-honda/10 p-2 text-xs font-semibold text-honda leading-snug rounded-xs">
                    <AlertTriangle className="size-4 shrink-0 mt-0.5" />
                    <span>{peringatan}</span>
                </div>
            )}
        </div>
    );
}

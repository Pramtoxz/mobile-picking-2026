import { PlatRakIndustri } from '@/components/plat-rak-industri';
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
        <div className="flex flex-col justify-between h-full space-y-2 p-1 select-none">
            {/* Header info */}
            <div>
                <div className="flex items-center gap-1.5 text-ink font-mono text-[11px] font-black tracking-widest uppercase">
                    <Lock className="size-3.5 text-honda shrink-0" />
                    HITUNG BUTA (VERIFIKASI FISIK)
                </div>
                <p className="mt-0.5 text-[10px] font-mono text-ink-2 leading-tight">
                    Hitung barang fisik dari rak, masukkan angkanya. Target QTY disembunyikan.
                </p>
            </div>

            {/* Multiple item selector jika batch */}
            {items.length > 1 && (
                <div className="flex gap-1.5 overflow-x-auto py-1 border-y-2 border-rule">
                    {items.map((item, idx) => {
                        const aktif = idx === itemAktifIndex;
                        const terisi = (item.jumlah_input ?? 0) > 0;
                        return (
                            <button
                                key={idx}
                                type="button"
                                onClick={() => onPilihItem(idx)}
                                className={`px-2.5 py-1 text-xs font-mono font-black rounded-xs border-2 uppercase transition-all ${
                                    aktif
                                        ? 'bg-ink text-white border-ink shadow-[0_2px_0_0_#17150f]'
                                        : terisi
                                        ? 'bg-selesai/20 text-selesai border-selesai shadow-none'
                                        : 'bg-panel text-ink border-rule shadow-[0_2px_0_0_#cfc9bd]'
                                }`}
                            >
                                Part {idx + 1}
                            </button>
                        );
                    })}
                </div>
            )}

            {/* Tampilan Plat Rak & Part Number */}
            <div className="space-y-1.5 bg-plate p-2 border-2 border-ink rounded-xs shadow-[2px_2px_0_0_#17150f]">
                <div className="flex items-center justify-between gap-2">
                    <PlatRakIndustri kode={itemAktif?.lokasi_part ?? '-'} ukuran="sm" />
                    {items.length > 1 && (
                        <span className="font-mono text-[11px] font-bold text-ink-2">
                            Item {itemAktifIndex + 1} dari {items.length}
                        </span>
                    )}
                </div>
                <p className="font-mono text-base sm:text-lg font-black text-ink truncate mt-1">
                    {itemAktif?.fk_part}
                </p>
            </div>

            {/* Display Input Angka Masukan (Recessed Digital Instrument Display) */}
            <div className="flex flex-col items-center justify-center bg-[#111612] border-2 border-ink rounded-xs py-2 px-4 shadow-[inset_0_3px_6px_rgba(0,0,0,0.7)]">
                <span className="font-mono text-[9px] font-black tracking-widest text-emerald-500/80 uppercase mb-0.5">
                    JUMLAH FISIK DIAMBIL (PCS)
                </span>
                <div className="font-mono text-4xl sm:text-5xl font-black tracking-wider text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.6)]">
                    {nilaiInput || <span className="text-emerald-950">0</span>}
                </div>
            </div>

            {/* Peringatan error validasi hitung buta */}
            {peringatan && (
                <div className="flex items-start gap-2 border-2 border-honda bg-honda/15 p-2 text-xs font-bold text-honda leading-snug rounded-xs shadow-xs">
                    <AlertTriangle className="size-4 shrink-0 mt-0.5" />
                    <span>{peringatan}</span>
                </div>
            )}
        </div>
    );
}

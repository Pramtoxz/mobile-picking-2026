import { useKunciLayar } from '@/hooks/use-kunci-layar';
import type { ItemKartuStok } from '@/types';
import { Lock } from 'lucide-react';
import { useState } from 'react';
import DisplayHitungButa from './dialog-kartu-stok/DisplayHitungButa';
import NumpadIndustri from './dialog-kartu-stok/NumpadIndustri';

interface DialogKartuStokProps {
    items: ItemKartuStok[];
    menyimpan: boolean;
    peringatan: string | null;
    onSimpan: (items: ItemKartuStok[]) => void;
}

export default function DialogKartuStok({
    items,
    menyimpan,
    peringatan,
    onSimpan,
}: DialogKartuStokProps) {
    const [jumlah, setJumlah] = useState<Record<number, string>>({});
    const [itemAktifIndex, setItemAktifIndex] = useState(0);

    useKunciLayar(true);

    const handleDigit = (digit: string) => {
        setJumlah((prev) => {
            const sekarang = prev[itemAktifIndex] ?? '';
            if (sekarang.length >= 4) return prev;
            return { ...prev, [itemAktifIndex]: sekarang + digit };
        });
    };

    const handleBackspace = () => {
        setJumlah((prev) => {
            const sekarang = prev[itemAktifIndex] ?? '';
            return { ...prev, [itemAktifIndex]: sekarang.slice(0, -1) };
        });
    };

    const handleClear = () => {
        setJumlah((prev) => ({ ...prev, [itemAktifIndex]: '' }));
    };

    const semuaTerisi = items.every((_, i) => {
        const val = parseInt(jumlah[i] ?? '0', 10);
        return val >= 1;
    });

    const handleSimpan = () => {
        if (!semuaTerisi || menyimpan) return;

        onSimpan(
            items.map((item, i) => ({
                ...item,
                jumlah_input: parseInt(jumlah[i] ?? '0', 10) || 0,
            })),
        );
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/65 p-2 sm:p-3 backdrop-blur-xs">
            <div className="flex max-h-full w-full max-w-2xl flex-col border-2 border-ink bg-panel rounded-sm shadow-xl overflow-hidden">
                {/* Header Bar */}
                <div className="flex shrink-0 items-center justify-between border-b-2 border-ink bg-ink px-3 py-2 text-white">
                    <div className="flex items-center gap-2">
                        <Lock className="size-4 shrink-0 text-honda" />
                        <h2 className="font-mono text-xs sm:text-sm font-bold tracking-widest uppercase">
                            Kartu Stok Keluar — Hitung Buta
                        </h2>
                    </div>
                    <span className="font-mono text-[11px] text-white/70">
                        Layar Terkunci
                    </span>
                </div>

                {/* 2-Column Workstation Layout for Landscape */}
                <div className="grid grid-cols-2 gap-2 p-2 sm:p-3 overflow-y-auto">
                    <DisplayHitungButa
                        items={items}
                        itemAktifIndex={itemAktifIndex}
                        onPilihItem={setItemAktifIndex}
                        nilaiInput={jumlah[itemAktifIndex] ?? ''}
                        peringatan={peringatan}
                    />

                    <NumpadIndustri
                        onDigit={handleDigit}
                        onBackspace={handleBackspace}
                        onClear={handleClear}
                        onSubmit={handleSimpan}
                        disabled={menyimpan}
                        canSubmit={semuaTerisi}
                        submitting={menyimpan}
                    />
                </div>
            </div>
        </div>
    );
}

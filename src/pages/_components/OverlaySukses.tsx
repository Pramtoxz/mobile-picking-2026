import { AnimasiLottie } from '@/components/animasi-lottie';
import { Check } from 'lucide-react';
import { useEffect } from 'react';

interface OverlaySuksesProps {
    pesan: string;
    onSelesai: () => void;
}

const BATAS_TAMPIL_MS = 2500;

export default function OverlaySukses({ pesan, onSelesai }: OverlaySuksesProps) {
    /**
     * Jaring pengaman: bila animasi gagal dimuat, `complete` tidak pernah
     * terpanggil dan operator akan terjebak di layar ini. Overlay selalu
     * tertutup paling lambat setelah batas waktu.
     */
    useEffect(() => {
        const jeda = setTimeout(onSelesai, BATAS_TAMPIL_MS);
        return () => clearTimeout(jeda);
    }, [onSelesai]);

    return (
        <div
            role="status"
            className="fixed inset-0 z-60 flex flex-col items-center justify-center bg-panel/95 backdrop-blur-xs px-4 select-none"
        >
            <div className="flex flex-col items-center justify-center text-center max-w-sm">
                {/* Lottie ukuran proporsional untuk landscape (112-128px) */}
                <div className="h-28 w-28 sm:h-32 sm:w-32 shrink-0 flex items-center justify-center">
                    <AnimasiLottie
                        nama="sukses"
                        loop={false}
                        onSelesai={onSelesai}
                        className="h-full w-full object-contain"
                        gantiDiam={
                            <span className="flex h-full w-full items-center justify-center">
                                <Check className="size-20 text-selesai" strokeWidth={3} />
                            </span>
                        }
                    />
                </div>

                <p className="mt-2 font-mono text-base sm:text-lg font-bold text-ink tracking-wide">
                    {pesan}
                </p>
                <p className="mt-0.5 font-mono text-xs text-selesai font-semibold uppercase tracking-wider">
                    ✓ Kartu Stok Tersimpan
                </p>
            </div>
        </div>
    );
}

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
        <div role="status" className="fixed inset-0 z-60 flex flex-col bg-panel">
            <AnimasiLottie
                nama="sukses"
                loop={false}
                onSelesai={onSelesai}
                className="min-h-0 w-full flex-1"
                gantiDiam={
                    <span className="flex h-full w-full items-center justify-center">
                        <Check className="size-24 text-selesai" strokeWidth={3} />
                    </span>
                }
            />

            <p className="shrink-0 px-4 pb-6 text-center text-lg font-semibold text-ink">{pesan}</p>
        </div>
    );
}

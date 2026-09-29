import { cn } from '@/lib/utils';
import React from 'react';

interface PlatRakIndustriProps {
    kode: string;
    ukuran?: 'sm' | 'md' | 'lg';
    className?: string;
}

/**
 * Mendeteksi perkiraan tingkat rak fisik dari digit kode (contoh A1.02.1 -> Level 1).
 */
function deteksiTingkatRak(kode: string): { tingkat: number; label: string } {
    if (!kode || kode === '-') return { tingkat: 2, label: 'STANDAR' };
    
    // Cari angka level di bagian tengah atau akhir
    const bagian = kode.split(/[.\-_]/);
    let levelNum = 2;
    
    if (bagian.length >= 2) {
        const num = parseInt(bagian[bagian.length - 1], 10);
        if (!isNaN(num) && num >= 1 && num <= 5) {
            levelNum = num;
        }
    }

    if (levelNum === 1) return { tingkat: 1, label: 'BAWAH' };
    if (levelNum >= 3) return { tingkat: 3, label: 'ATAS' };
    return { tingkat: 2, label: 'TENGAH' };
}

export const PlatRakIndustri: React.FC<PlatRakIndustriProps> = ({ kode, ukuran = 'md', className }) => {
    const { tingkat, label } = deteksiTingkatRak(kode);

    return (
        <div
            className={cn(
                'relative inline-flex items-center gap-2 rounded-xs border-2 border-ink bg-amber-400/90 text-ink shadow-[2px_2px_0_0_#17150f] select-none',
                ukuran === 'sm' && 'px-2 py-0.5 text-xs',
                ukuran === 'md' && 'px-3 py-1 text-sm',
                ukuran === 'lg' && 'px-4 py-2 text-base',
                className,
            )}
        >
            {/* Sudut baut rivet mini */}
            <span className="absolute top-1 left-1 size-1 rounded-full bg-ink/40" />
            <span className="absolute top-1 right-1 size-1 rounded-full bg-ink/40" />
            <span className="absolute bottom-1 left-1 size-1 rounded-full bg-ink/40" />
            <span className="absolute bottom-1 right-1 size-1 rounded-full bg-ink/40" />

            {/* Kode Rak Teks Masif */}
            <div className="flex flex-col">
                <span className="font-mono text-[9px] font-bold uppercase tracking-widest text-ink/70 leading-none">
                    LOKASI RAK
                </span>
                <span className="font-mono font-black tracking-wider text-ink leading-tight text-base sm:text-lg">
                    {kode}
                </span>
            </div>

            {/* Skema Visual Tingkat Rak 3-Tier */}
            <div className="ml-1 flex flex-col items-center border-l border-ink/30 pl-2">
                <div className="flex flex-col gap-0.5">
                    {/* Tier Atas */}
                    <span
                        className={cn(
                            'h-1.5 w-4 rounded-xs border border-ink/40',
                            tingkat === 3 ? 'bg-ink' : 'bg-transparent',
                        )}
                        title="Tingkat Atas"
                    />
                    {/* Tier Tengah */}
                    <span
                        className={cn(
                            'h-1.5 w-4 rounded-xs border border-ink/40',
                            tingkat === 2 ? 'bg-ink' : 'bg-transparent',
                        )}
                        title="Tingkat Tengah"
                    />
                    {/* Tier Bawah */}
                    <span
                        className={cn(
                            'h-1.5 w-4 rounded-xs border border-ink/40',
                            tingkat === 1 ? 'bg-ink' : 'bg-transparent',
                        )}
                        title="Tingkat Bawah"
                    />
                </div>
                <span className="mt-0.5 font-mono text-[8px] font-bold text-ink/70 leading-none">
                    {label}
                </span>
            </div>
        </div>
    );
};

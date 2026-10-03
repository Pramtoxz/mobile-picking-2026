import { LampuPilot } from '@/components/lampu-pilot';
import { sensory } from '@/lib/sensory';
import { useAuthStore } from '@/store/auth';
import { ArrowDownToLine, Check, ChevronsUpDown, Package, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export type ModulLapangan = 'picking' | 'storing';

interface ModulSwitcherProps {
    modulAktif: ModulLapangan;
}

interface ItemModul {
    kode: ModulLapangan;
    nama: string;
    subJudul: string;
    path: string;
    icon: typeof Package;
}

const DAFTAR_MODUL: ItemModul[] = [
    {
        kode: 'picking',
        nama: 'PICKING DO',
        subJudul: 'Pengambilan part Delivery Order untuk ekspedisi/dealer',
        path: '/do',
        icon: Package,
    },
    {
        kode: 'storing',
        nama: 'STORING PART',
        subJudul: 'Penempatan part penerimaan (RS) ke rak penyimpanan',
        path: '/storing',
        icon: ArrowDownToLine,
    },
];

export function ModulSwitcher({ modulAktif }: ModulSwitcherProps) {
    const navigate = useNavigate();
    const user = useAuthStore((state) => state.user);
    const [buka, setBuka] = useState(false);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && buka) {
                setBuka(false);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [buka]);

    const aktif = DAFTAR_MODUL.find((m) => m.kode === modulAktif) ?? DAFTAR_MODUL[0];

    const pilihModul = (modul: ItemModul) => {
        sensory.tap();
        setBuka(false);
        if (modul.kode !== modulAktif) {
            navigate(modul.path);
        }
    };

    return (
        <>
            <button
                type="button"
                onClick={() => {
                    sensory.tap();
                    setBuka(true);
                }}
                className="flex items-center gap-2.5 text-left cursor-pointer group min-w-0 p-1 -ml-1 rounded-xs hover:bg-plate active:bg-plate/80 transition-colors"
                aria-label="Ganti Modul Kerja"
                title="Tekan untuk beralih antara Picking DO dan Storing Part"
            >
                <LampuPilot status="done" />
                <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                        <p className="truncate text-xs sm:text-sm font-black text-ink uppercase tracking-wide group-hover:text-honda transition-colors">
                            {user?.nama ?? 'OPERATOR'}
                        </p>
                        <ChevronsUpDown className="size-3.5 shrink-0 text-ink-2 group-hover:text-ink transition-colors" />
                    </div>
                    <p className="truncate font-mono text-[10px] font-bold text-ink-2 uppercase">
                        {aktif.nama} · {user?.adalah_admin_area ? 'SEMUA AREA GUDANG' : `AREA: ${user?.area_operator ?? '-'}`}
                    </p>
                </div>
            </button>


            {buka && (
                <div
                    role="dialog"
                    aria-modal="true"
                    className="fixed inset-0 z-50 flex items-center justify-center bg-ink/70 p-4 animate-in fade-in duration-150"
                    onClick={() => setBuka(false)}
                >
                    <div
                        className="flex w-full max-w-md flex-col border-2 border-ink bg-panel rounded-xs shadow-[4px_4px_0_0_#17150f]"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between border-b-2 border-ink bg-ink px-4 py-2.5 text-white">
                            <div className="flex items-center gap-2">
                                <span className="font-mono text-xs font-black uppercase tracking-widest">
                                    GANTI MODUL KERJA
                                </span>
                            </div>
                            <button
                                type="button"
                                onClick={() => setBuka(false)}
                                className="p-0.5 text-white/70 hover:text-white transition-colors cursor-pointer"
                                aria-label="Tutup"
                            >
                                <X className="size-4" />
                            </button>
                        </div>

                        <div className="p-3 space-y-2">
                            {DAFTAR_MODUL.map((modul) => {
                                const Ikon = modul.icon;
                                const adalahAktif = modul.kode === modulAktif;

                                return (
                                    <button
                                        key={modul.kode}
                                        type="button"
                                        onClick={() => pilihModul(modul)}
                                        className={`w-full flex items-start gap-3 p-3 border-2 text-left rounded-xs transition-all cursor-pointer ${
                                            adalahAktif
                                                ? 'border-ink bg-plate shadow-[2px_2px_0_0_#17150f]'
                                                : 'border-rule hover:border-ink/50 bg-panel hover:bg-plate/40 active:bg-plate'
                                        }`}
                                    >
                                        <div
                                            className={`flex size-9 shrink-0 items-center justify-center rounded-2xs border ${
                                                adalahAktif
                                                    ? 'border-ink bg-ink text-white shadow-2xs'
                                                    : 'border-rule bg-panel text-ink'
                                            }`}
                                        >
                                            <Ikon className="size-5" />
                                        </div>

                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-center justify-between gap-2">
                                                <span className="font-mono text-sm font-black text-ink tracking-wide uppercase">
                                                    {modul.nama}
                                                </span>
                                                {adalahAktif && (
                                                    <span className="inline-flex items-center gap-1 bg-selesai text-white text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-2xs shadow-2xs">
                                                        <Check className="size-3" />
                                                        AKTIF
                                                    </span>
                                                )}
                                            </div>
                                            <p className="mt-0.5 text-xs text-ink-2 font-mono leading-relaxed">
                                                {modul.subJudul}
                                            </p>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>

                        <div className="border-t border-rule bg-plate/40 px-4 py-2 text-right">
                            <span className="font-mono text-[10px] text-ink-2 uppercase">
                                {user?.adalah_admin_area ? 'AKSES: SEMUA AREA GUDANG' : `AKSES OPERATOR: AREA ${user?.area_operator ?? '-'}`}
                            </span>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

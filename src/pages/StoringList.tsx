import { Layar, LayarIsi, LayarKepala, TombolKepala } from '@/components/layar';
import LayarBoot from '@/components/layar-boot';
import { ModulSwitcher } from '@/components/modul-switcher';
import { perluLayarBoot, tandaiSudahBoot } from '@/lib/boot';
import { sensory } from '@/lib/sensory';
import { authService } from '@/services/auth';
import { storingService } from '@/services/storing';
import { saringStoringKosong, type BarisStoring, type MetaPaginasi, type SaringStoring } from '@/types';
import axios from 'axios';
import { AlertTriangle, Boxes, LogOut, RefreshCw } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BarisStoringItem, { KepalaKolomStoring } from './_components/BarisStoringItem';
import PenyaringStoring from './_components/PenyaringStoring';

function BarisKerangka() {
    return (
        <li className="flex items-center gap-2 px-3 py-2.5">
            <div className="h-3.5 w-7 shrink-0 animate-pulse bg-rule rounded-2xs" />
            <div className="min-w-0 flex-1 space-y-1.5">
                <div className="h-4 w-44 animate-pulse bg-rule rounded-2xs" />
                <div className="h-3 w-56 animate-pulse bg-rule rounded-2xs" />
            </div>
            <div className="h-4 w-12 shrink-0 animate-pulse bg-rule rounded-2xs" />
        </li>
    );
}

export default function StoringList() {
    const navigate = useNavigate();
    const [storingList, setStoringList] = useState<BarisStoring[]>([]);
    const [meta, setMeta] = useState<MetaPaginasi | null>(null);
    const [saring, setSaring] = useState<SaringStoring>(saringStoringKosong());
    const [loadingAwal, setLoadingAwal] = useState(true);
    const [loadingLanjut, setLoadingLanjut] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [tampilBoot, setTampilBoot] = useState(perluLayarBoot);
    const sentinelRef = useRef<HTMLDivElement>(null);

    const muatHalaman = useCallback(
        async (halaman: number, saringDipakai: SaringStoring) => {
            const res = await storingService.daftar({ page: halaman, ...saringDipakai });
            const data: BarisStoring[] = res.data ?? [];

            setStoringList((sebelumnya) => (halaman === 1 ? data : [...sebelumnya, ...data]));
            setMeta(res.meta ?? null);
        },
        [],
    );

    const muatUlang = useCallback(
        async (saringDipakai: SaringStoring) => {
            setLoadingAwal(true);
            setError(null);
            try {
                await muatHalaman(1, saringDipakai);
            } catch (err) {
                console.error('Load error storing:', err);
                if (axios.isAxiosError(err) && err.response?.status === 401) {
                    navigate('/login', { replace: true });
                    return;
                }
                setError('Gagal memuat data storing part.');
            } finally {
                setLoadingAwal(false);
                tandaiSudahBoot();
                setTampilBoot(false);
            }
        },
        [muatHalaman, navigate],
    );

    useEffect(() => {
        const jeda = setTimeout(() => muatUlang(saring), saring.cari ? 350 : 0);
        return () => clearTimeout(jeda);
    }, [saring, muatUlang]);

    const muatLanjutan = useCallback(async () => {
        if (!meta || loadingLanjut || loadingAwal || meta.current_page >= meta.last_page) {
            return;
        }

        setLoadingLanjut(true);
        try {
            await muatHalaman(meta.current_page + 1, saring);
        } catch (err) {
            console.error('Load more storing error:', err);
        } finally {
            setLoadingLanjut(false);
        }
    }, [meta, loadingLanjut, loadingAwal, muatHalaman, saring]);

    useEffect(() => {
        const sentinel = sentinelRef.current;
        if (!sentinel) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0]?.isIntersecting) {
                    muatLanjutan();
                }
            },
            { rootMargin: '240px' },
        );

        observer.observe(sentinel);
        return () => observer.disconnect();
    }, [muatLanjutan]);

    const keluar = async () => {
        sensory.tap();
        await authService.logout();
        navigate('/login', { replace: true });
    };

    const adaPenyaring = Object.values(saring).some((nilai) => nilai !== null && nilai !== '');
    const semuaSudahDimuat = meta !== null && meta.current_page >= meta.last_page;

    if (loadingAwal && tampilBoot) {
        return <LayarBoot />;
    }

    return (
        <Layar>
            <LayarKepala>
                <ModulSwitcher modulAktif="storing" />

                <div className="shrink-0 flex items-center gap-1.5 border-2 border-ink bg-panel px-3 py-1 rounded-xs shadow-[1px_1px_0_0_#17150f]">
                    <span className="font-mono text-base font-black text-ink leading-none">
                        {meta?.total ?? storingList.length}
                    </span>
                    <span className="font-mono text-[10px] font-black text-ink-2 uppercase tracking-wider">
                        STORING TOTAL
                    </span>
                </div>

                <TombolKepala
                    onClick={() => {
                        sensory.tap();
                        muatUlang(saring);
                    }}
                    disabled={loadingAwal}
                    aria-label="Segarkan daftar storing"
                >
                    <RefreshCw className={loadingAwal ? 'animate-spin' : undefined} />
                </TombolKepala>
                <TombolKepala onClick={keluar} aria-label="Keluar">
                    <LogOut />
                </TombolKepala>
            </LayarKepala>

            <PenyaringStoring
                saring={saring}
                adaPenyaring={adaPenyaring}
                onUbah={(perubahan) => setSaring((s) => ({ ...s, ...perubahan }))}
                onReset={() => setSaring(saringStoringKosong())}
            />

            {error && (
                <p className="flex shrink-0 items-center gap-2 border-l-4 border-honda bg-honda/10 px-3 py-2 text-xs font-bold text-honda shadow-2xs">
                    <AlertTriangle className="size-4 shrink-0" />
                    {error}
                </p>
            )}

            <LayarIsi className="bg-panel">
                {loadingAwal ? (
                    <ul className="divide-y divide-rule">
                        {Array.from({ length: 7 }).map((_, i) => (
                            <BarisKerangka key={i} />
                        ))}
                    </ul>
                ) : storingList.length === 0 ? (
                    <div className="flex h-full flex-col items-center justify-center gap-2.5 px-6 text-center select-none">
                        <div className="flex size-14 items-center justify-center rounded-xs border-2 border-ink bg-plate shadow-[2px_2px_0_0_#17150f]">
                            <Boxes className="size-8 text-selesai" />
                        </div>
                        <p className="font-mono text-base font-black text-ink uppercase tracking-wider">
                            {adaPenyaring ? 'TIDAK ADA STORING YANG COCOK' : 'SEMUA STORING SELESAI'}
                        </p>
                        <p className="font-mono text-xs text-ink-2 max-w-sm">
                            {adaPenyaring
                                ? 'Ubah kata kunci pencarian atau tekan tombol Reset.'
                                : 'Tidak ada dokumen penerimaan part masuk untuk area kerja Anda saat ini.'}
                        </p>
                    </div>
                ) : (
                    <>
                        <KepalaKolomStoring />
                        <ul className="divide-y divide-rule">
                            {storingList.map((item, indeks) => (
                                <BarisStoringItem
                                    key={item.fk_do}
                                    item={item}
                                    nomor={indeks + 1}
                                    onClick={() => navigate(`/storing/${item.fk_do}`)}
                                />
                            ))}
                        </ul>

                        <div ref={sentinelRef} className="h-1" />

                        {loadingLanjut && (
                            <p className="py-3 text-center font-mono text-xs font-bold text-ink-2">
                                Memuat antrean lanjutan...
                            </p>
                        )}
                        {semuaSudahDimuat && (
                            <p className="py-4 text-center font-mono text-[10px] font-bold tracking-widest text-ink-2 uppercase">
                                AKHIR DAFTAR · {meta?.total} DOKUMEN STORING
                            </p>
                        )}
                    </>
                )}
            </LayarIsi>
        </Layar>
    );
}

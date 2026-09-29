import { LampuPilot } from '@/components/lampu-pilot';
import { Layar, LayarIsi, LayarKepala, TombolKepala } from '@/components/layar';
import LayarBoot from '@/components/layar-boot';
import api from '@/lib/api';
import { perluLayarBoot, tandaiSudahBoot } from '@/lib/boot';
import { sensory } from '@/lib/sensory';
import { authService } from '@/services/auth';
import { useAuthStore } from '@/store/auth';
import { saringKosong, type BarisDo, type MetaPaginasi, type SaringDo } from '@/types';
import axios from 'axios';
import { AlertTriangle, LogOut, PackageCheck, RefreshCw } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BarisDoItem, { KepalaKolomDo } from './_components/BarisDoItem';
import PenyaringDo from './_components/PenyaringDo';

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

export default function DoList() {
    const navigate = useNavigate();
    const user = useAuthStore((state) => state.user);
    const [doList, setDoList] = useState<BarisDo[]>([]);
    const [meta, setMeta] = useState<MetaPaginasi | null>(null);
    const [saring, setSaring] = useState<SaringDo>(saringKosong);
    const [daftarAreaChannel, setDaftarAreaChannel] = useState<string[]>([]);
    const [loadingAwal, setLoadingAwal] = useState(true);
    const [loadingLanjut, setLoadingLanjut] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [tampilBoot, setTampilBoot] = useState(perluLayarBoot);
    const sentinelRef = useRef<HTMLDivElement>(null);

    const muatHalaman = useCallback(
        async (halaman: number, saringDipakai: SaringDo) => {
            const response = await api.get('/lapangan/do', {
                params: { page: halaman, ...saringDipakai },
            });
            const data: BarisDo[] = response.data.data ?? [];

            setDoList((sebelumnya) => (halaman === 1 ? data : [...sebelumnya, ...data]));
            setMeta(response.data.meta ?? null);

            if (halaman === 1) {
                setDaftarAreaChannel(response.data.daftar_area_channel ?? []);
            }
        },
        [],
    );

    const muatUlang = useCallback(
        async (saringDipakai: SaringDo) => {
            setLoadingAwal(true);
            setError(null);
            try {
                await muatHalaman(1, saringDipakai);
            } catch (err) {
                console.error('Load error:', err);
                if (axios.isAxiosError(err) && err.response?.status === 401) {
                    navigate('/login', { replace: true });
                    return;
                }
                setError('Gagal memuat data DO.');
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
            console.error('Load more error:', err);
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
                <div className="min-w-0 flex-1 flex items-center gap-2.5">
                    <LampuPilot status="done" />
                    <div className="min-w-0">
                        <p className="truncate text-xs sm:text-sm font-black text-ink uppercase tracking-wide">
                            {user?.nama ?? 'OPERATOR'}
                        </p>
                        <p className="truncate font-mono text-[10px] font-bold text-ink-2 uppercase">
                            {user?.adalah_admin_area ? 'SEMUA AREA GUDANG' : `AREA: ${user?.area_operator ?? '-'}`}
                        </p>
                    </div>
                </div>

                {/* Telemetri Total Counter Meter */}
                <div className="shrink-0 flex items-center gap-1.5 border-2 border-ink bg-panel px-3 py-1 rounded-xs shadow-[1px_1px_0_0_#17150f]">
                    <span className="font-mono text-base font-black text-ink leading-none">
                        {meta?.total ?? doList.length}
                    </span>
                    <span className="font-mono text-[10px] font-black text-ink-2 uppercase tracking-wider">
                        DO TOTAL
                    </span>
                </div>

                <TombolKepala
                    onClick={() => {
                        sensory.tap();
                        muatUlang(saring);
                    }}
                    disabled={loadingAwal}
                    aria-label="Segarkan daftar"
                >
                    <RefreshCw className={loadingAwal ? 'animate-spin' : undefined} />
                </TombolKepala>
                <TombolKepala onClick={keluar} aria-label="Keluar">
                    <LogOut />
                </TombolKepala>
            </LayarKepala>

            <PenyaringDo
                saring={saring}
                daftarAreaChannel={daftarAreaChannel}
                adaPenyaring={adaPenyaring}
                onUbah={(perubahan) => setSaring((s) => ({ ...s, ...perubahan }))}
                onReset={() => setSaring(saringKosong())}
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
                ) : doList.length === 0 ? (
                    <div className="flex h-full flex-col items-center justify-center gap-2.5 px-6 text-center select-none">
                        <div className="flex size-14 items-center justify-center rounded-xs border-2 border-ink bg-plate shadow-[2px_2px_0_0_#17150f]">
                            <PackageCheck className="size-8 text-selesai" />
                        </div>
                        <p className="font-mono text-base font-black text-ink uppercase tracking-wider">
                            {adaPenyaring ? 'TIDAK ADA DO YANG COCOK' : 'SEMUA ANTREAN SELESAI'}
                        </p>
                        <p className="font-mono text-xs text-ink-2 max-w-sm">
                            {adaPenyaring
                                ? 'Ubah kata kunci pencarian atau tekan tombol Reset.'
                                : 'Tidak ada DO yang menunggu untuk area kerja Anda saat ini.'}
                        </p>
                    </div>
                ) : (
                    <>
                        <KepalaKolomDo />
                        <ul className="divide-y divide-rule">
                            {doList.map((item, indeks) => (
                                <BarisDoItem
                                    key={item.fk_do}
                                    item={item}
                                    nomor={indeks + 1}
                                    onClick={() => navigate(`/kerja/${item.fk_do}`)}
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
                                AKHIR DAFTAR · {meta?.total} DOKUMEN DO
                            </p>
                        )}
                    </>
                )}
            </LayarIsi>
        </Layar>
    );
}

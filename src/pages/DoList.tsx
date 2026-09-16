import { Layar, LayarIsi, LayarKepala, TombolKepala } from '@/components/layar';
import LayarBoot from '@/components/layar-boot';
import api from '@/lib/api';
import { perluLayarBoot, tandaiSudahBoot } from '@/lib/boot';
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
        <li className="flex items-center gap-2 px-3 py-2">
            <div className="h-3 w-7 shrink-0 animate-pulse bg-rule" />
            <div className="min-w-0 flex-1 space-y-1.5">
                <div className="h-3.5 w-44 animate-pulse bg-rule" />
                <div className="h-2.5 w-56 animate-pulse bg-rule" />
            </div>
            <div className="h-3.5 w-10 shrink-0 animate-pulse bg-rule" />
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
                <div className="min-w-0 flex-1">
                    <p className="truncate text-sm leading-tight font-semibold text-ink">{user?.nama ?? 'Operator'}</p>
                    <p className="truncate font-mono text-[11px] leading-tight text-ink-2">
                        {user?.adalah_admin_area ? 'SEMUA AREA' : (user?.area_operator ?? '-')}
                    </p>
                </div>

                <span className="shrink-0 border-x border-rule px-3 text-center">
                    <span className="block font-mono text-base leading-none font-bold text-ink">
                        {meta?.total ?? doList.length}
                    </span>
                    <span className="block font-mono text-[10px] tracking-wide text-ink-2 uppercase">DO</span>
                </span>

                <TombolKepala onClick={() => muatUlang(saring)} disabled={loadingAwal} aria-label="Segarkan daftar">
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
                <p className="flex shrink-0 items-center gap-2 border-l-4 border-honda bg-honda/8 px-3 py-2 text-sm text-honda">
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
                    <div className="flex h-full flex-col items-center justify-center gap-2 px-6 text-center">
                        <PackageCheck className="size-8 text-selesai" />
                        <p className="font-semibold text-ink">
                            {adaPenyaring ? 'Tidak ada DO yang cocok' : 'Semua DO sudah beres'}
                        </p>
                        <p className="text-sm text-ink-2">
                            {adaPenyaring ? 'Ubah atau reset penyaring.' : 'Tidak ada DO yang menunggu saat ini.'}
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
                            <p className="py-3 text-center font-mono text-xs text-ink-2">Memuat lagi…</p>
                        )}
                        {semuaSudahDimuat && (
                            <p className="py-4 text-center font-mono text-[10px] tracking-wider text-ink-2 uppercase">
                                Akhir daftar · {meta?.total} DO
                            </p>
                        )}
                    </>
                )}
            </LayarIsi>
        </Layar>
    );
}

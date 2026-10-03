import { Layar, LayarIsi, LayarKepala, TombolKepala } from '@/components/layar';
import LayarBoot from '@/components/layar-boot';
import { Button } from '@/components/ui/button';
import { tanggalIndo } from '@/lib/format';
import { sensory } from '@/lib/sensory';
import { authService } from '@/services/auth';
import { storingService } from '@/services/storing';
import type { BarisPartStoring, DokumenStoringInfo } from '@/types';
import axios from 'axios';
import { AlertTriangle, ArrowLeft, LogOut, RefreshCw } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import DaftarPartStoring from './_components/DaftarPartStoring';
import PanelPartStoring from './_components/PanelPartStoring';

export default function StoringWorkItem() {
    const { '*': noPenerimaan } = useParams();
    const navigate = useNavigate();
    const [dokumen, setDokumen] = useState<DokumenStoringInfo | null>(null);
    const [parts, setParts] = useState<BarisPartStoring[]>([]);
    const [idTerpilih, setIdTerpilih] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [memproses, setMemproses] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const partTerpilih = parts.find((p) => p.id === idTerpilih) ?? null;

    const muatParts = useCallback(async () => {
        if (!noPenerimaan) return;

        try {
            const response = await storingService.parts(noPenerimaan);
            const data: BarisPartStoring[] = response.data ?? [];
            setParts(data);
            setDokumen(response.dokumen ?? null);

            setIdTerpilih((prev) => {
                if (prev && data.some((p) => p.id === prev)) return prev;
                const pertamaWaiting = data.find((p) => !p.status_masuk);
                return pertamaWaiting?.id ?? data[0]?.id ?? null;
            });
        } catch (err: unknown) {
            console.error('Load storing parts error:', err);
            if (axios.isAxiosError(err) && err.response?.status === 401) {
                navigate('/login', { replace: true });
                return;
            }
            setError('Gagal memuat part storing.');
        } finally {
            setLoading(false);
        }
    }, [noPenerimaan, navigate]);

    useEffect(() => {
        muatParts();
    }, [muatParts]);

    const simpanPart = async (qtyMasuk: number) => {
        if (!partTerpilih || !noPenerimaan || memproses) return;

        setMemproses(true);
        setError(null);

        try {
            const res = await storingService.simpan({
                fk_do: noPenerimaan,
                no_part: partTerpilih.no_part,
                kode_rak: partTerpilih.kode_rak,
                qty_masuk: qtyMasuk,
            });

            if (!res.success) {
                sensory.peringatan();
                setError(res.message || 'Gagal menyimpan storing.');
                return;
            }

            sensory.sukses();
            toast.success(`Part ${partTerpilih.no_part} berhasil disimpan ke rak.`);

            const updatedParts = parts.map((p) =>
                p.id === partTerpilih.id
                    ? { ...p, status_masuk: true, qty_masuk: qtyMasuk }
                    : p,
            );
            setParts(updatedParts);

            const sisaWaiting = updatedParts.filter((p) => !p.status_masuk);
            if (sisaWaiting.length > 0) {
                const nextWaiting = sisaWaiting.find((p) => p.id !== partTerpilih.id) ?? sisaWaiting[0];
                setIdTerpilih(nextWaiting.id);
            }
        } catch (err: unknown) {
            sensory.peringatan();
            console.error('Save storing part error:', err);
            if (axios.isAxiosError(err)) {
                setError(err.response?.data?.message || 'Gagal menyimpan part storing.');
            } else if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('Terjadi kesalahan sistem.');
            }
        } finally {
            setMemproses(false);
        }
    };

    if (loading) {
        return <LayarBoot keterangan="Memuat part storing" />;
    }

    if (parts.length === 0) {
        return (
            <Layar className="items-center justify-center gap-3 px-6 text-center">
                <p className="font-semibold text-ink">Tidak ada part di area Anda untuk penerimaan ini</p>
                <Button variant="garis" onClick={() => navigate('/storing')}>
                    <ArrowLeft />
                    Kembali ke daftar storing
                </Button>
            </Layar>
        );
    }

    const totalItem = parts.length;
    const doneItem = parts.filter((p) => p.status_masuk).length;
    const persen = totalItem > 0 ? Math.round((doneItem / totalItem) * 100) : 0;

    const keluar = async () => {
        sensory.tap();
        await authService.logout();
        navigate('/login', { replace: true });
    };

    return (
        <Layar>
            <LayarKepala>
                <TombolKepala
                    onClick={() => {
                        sensory.tap();
                        navigate('/storing');
                    }}
                    aria-label="Kembali ke daftar storing"
                >
                    <ArrowLeft />
                </TombolKepala>

                <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                        <span className="truncate font-mono text-sm font-semibold text-ink">{noPenerimaan}</span>
                        {dokumen?.nm_gudang_part && (
                            <span className="shrink-0 bg-plate border border-rule px-1.5 py-px font-mono text-[10px] font-bold tracking-wider text-ink-2 uppercase">
                                {dokumen.nm_gudang_part}
                            </span>
                        )}
                    </div>
                </div>

                <span className="shrink-0 border-l border-rule px-2.5 text-right">
                    <span className="block font-mono text-base leading-none font-bold text-ink">
                        {doneItem}
                        <span className="text-ink-2">/{totalItem}</span>
                    </span>
                    <span className="block font-mono text-[10px] text-ink-2">{persen}%</span>
                </span>

                <TombolKepala
                    onClick={() => {
                        sensory.tap();
                        muatParts();
                    }}
                    disabled={memproses}
                    aria-label="Segarkan data"
                >
                    <RefreshCw className={memproses ? 'animate-spin' : undefined} />
                </TombolKepala>
                <TombolKepala onClick={keluar} aria-label="Keluar">
                    <LogOut />
                </TombolKepala>
            </LayarKepala>

            {dokumen && (
                <div className="flex shrink-0 items-center justify-between gap-x-3 border-b border-rule bg-plate/60 px-3 py-1 select-none overflow-x-auto">
                    <div className="flex items-center gap-x-4 shrink-0 font-mono text-[10px]">
                        <span className="flex items-center gap-1">
                            <span className="text-ink-2 tracking-wider uppercase">Gudang:</span>
                            <span className="font-bold text-ink truncate">{dokumen.nm_gudang_part || '-'}</span>
                        </span>
                        <span className="text-rule">•</span>
                        <span className="flex items-center gap-1">
                            <span className="text-ink-2 tracking-wider uppercase">Total Part:</span>
                            <span className="font-bold text-ink truncate">
                                {dokumen.total_items} Item ({parts.length} di area ini)
                            </span>
                        </span>
                    </div>

                    <div className="shrink-0 font-mono text-[10px]">
                        <span className="flex items-center gap-1">
                            <span className="text-ink-2 tracking-wider uppercase">Tgl Penerimaan:</span>
                            <span className="font-bold text-ink truncate">
                                {dokumen.tgl_kartu ? tanggalIndo(dokumen.tgl_kartu) : '—'}
                            </span>
                        </span>
                    </div>
                </div>
            )}

            {error && (
                <p className="flex shrink-0 items-center gap-2 border-l-4 border-honda bg-honda/10 px-3 py-2 text-xs font-bold text-honda shadow-2xs">
                    <AlertTriangle className="size-4 shrink-0" />
                    {error}
                </p>
            )}

            <div className="flex min-h-0 flex-1">
                <aside className="w-[38%] min-w-60 shrink-0 overflow-y-auto overscroll-contain border-r-2 border-ink bg-panel">
                    <DaftarPartStoring
                        parts={parts}
                        idTerpilih={idTerpilih}
                        onPilih={(p) => setIdTerpilih(p.id)}
                    />
                </aside>

                <section className="flex min-w-0 flex-1 flex-col overflow-y-auto bg-panel">
                    <LayarIsi className="p-3">
                        {partTerpilih ? (
                            <PanelPartStoring
                                part={partTerpilih}
                                sedangMenyimpan={memproses}
                                onSimpan={simpanPart}
                            />
                        ) : (
                            <div className="flex h-full items-center justify-center p-6 text-center text-ink-2 font-mono text-xs">
                                Pilih salah satu item part dari daftar di sebelah kiri.
                            </div>
                        )}
                    </LayarIsi>
                </section>
            </div>
        </Layar>
    );
}

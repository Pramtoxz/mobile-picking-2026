import { DialogKonfirmasi } from '@/components/dialog-konfirmasi';
import { Layar, LayarAksi, LayarIsi, LayarKepala, TombolKepala } from '@/components/layar';
import LayarBoot from '@/components/layar-boot';
import { PlatRak } from '@/components/plat-rak';
import { Button } from '@/components/ui/button';
import api from '@/lib/api';
import type { BarisPart, ItemKartuStok } from '@/types';
import axios from 'axios';
import { AlertTriangle, ArrowLeft, Check, Loader2, Lock, RotateCcw } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DaftarPart from './_components/DaftarPart';
import DialogKartuStok from './_components/DialogKartuStok';
import InfoDo from './_components/InfoDo';
import OverlaySukses from './_components/OverlaySukses';
import PanelPart from './_components/PanelPart';

export default function WorkItem() {
    const { '*': fkDo } = useParams();
    const navigate = useNavigate();
    const [parts, setParts] = useState<BarisPart[]>([]);
    const [idTerpilih, setIdTerpilih] = useState<number | null>(null);
    const [bundling, setBundling] = useState(false);
    const [loading, setLoading] = useState(true);
    const [memproses, setMemproses] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [itemKartuStok, setItemKartuStok] = useState<ItemKartuStok[]>([]);
    const [menyimpanKartu, setMenyimpanKartu] = useState(false);
    const [peringatanKartu, setPeringatanKartu] = useState<string | null>(null);
    const [suksesTampil, setSuksesTampil] = useState(false);
    const [konfirmasiUndo, setKonfirmasiUndo] = useState(false);
    const tutupSukses = useCallback(() => setSuksesTampil(false), []);

    const partTerpilih = parts.find((p) => p.id === idTerpilih) ?? null;

    const muatParts = useCallback(async () => {
        try {
            const response = await api.get(`/lapangan/do/${fkDo}/parts`);
            const data: BarisPart[] = response.data.data ?? [];

            setParts(data);
            setBundling(Boolean(response.data.is_bundling));
            setIdTerpilih((sekarang) => {
                if (sekarang !== null && data.some((p) => p.id === sekarang)) {
                    return sekarang;
                }
                return data.find((p) => p.status_picking_list === 'waiting')?.id ?? data[0]?.id ?? null;
            });
        } catch (err: unknown) {
            console.error('Load error:', err);
            if (axios.isAxiosError(err) && err.response?.status === 401) {
                navigate('/login', { replace: true });
                return;
            }
            setError('Gagal memuat data part.');
        } finally {
            setLoading(false);
        }
    }, [fkDo, navigate]);

    useEffect(() => {
        if (!fkDo) return;
        muatParts();
    }, [fkDo, muatParts]);

    const ubahStatus = async (status: 'done' | 'waiting') => {
        if (!partTerpilih || memproses) return;

        setMemproses(true);
        setError(null);

        try {
            const response = await api.post('/lapangan/part/update-status', {
                id: partTerpilih.id,
                status,
            });

            if (!response.data.success) {
                throw new Error(response.data.message || 'Gagal memperbarui status.');
            }

            const daftarKartu: ItemKartuStok[] = response.data.kartustok_list ?? [];

            if (daftarKartu.length > 0) {
                setPeringatanKartu(null);
                setItemKartuStok(daftarKartu);
            } else {
                await muatParts();
            }
        } catch (err: unknown) {
            console.error('Update status error:', err);
            if (axios.isAxiosError(err)) {
                setError(err.response?.data?.message ?? 'Gagal menyimpan perubahan.');
            } else if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('Terjadi kesalahan.');
            }
        } finally {
            setMemproses(false);
        }
    };

    const simpanKartuStok = async (items: ItemKartuStok[]) => {
        setMenyimpanKartu(true);
        setPeringatanKartu(null);

        try {
            await api.post('/lapangan/kartustok', { items });
            setItemKartuStok([]);
            setSuksesTampil(true);
            await muatParts();
        } catch (err: unknown) {
            console.error('Simpan kartu stok error:', err);
            if (axios.isAxiosError(err)) {
                setPeringatanKartu(
                    err.response?.data?.message ??
                        'Jumlah tidak sesuai. Hitung ulang part yang Anda keluarkan atau hubungi kepala gudang.',
                );
            } else {
                setPeringatanKartu('Gagal menyimpan Kartu Stok.');
            }
        } finally {
            setMenyimpanKartu(false);
        }
    };

    if (loading) {
        return <LayarBoot keterangan="Memuat part" />;
    }

    if (parts.length === 0) {
        return (
            <Layar className="items-center justify-center gap-3 px-6 text-center">
                <p className="font-semibold text-ink">Tidak ada part di area Anda untuk DO ini</p>
                <Button variant="garis" onClick={() => navigate('/do')}>
                    <ArrowLeft />
                    Kembali ke daftar DO
                </Button>
            </Layar>
        );
    }

    const selesai = parts.filter((p) => p.status_picking_list !== 'waiting').length;
    const persen = Math.round((selesai / parts.length) * 100);
    const partSelesai = partTerpilih?.status_picking_list === 'done';
    const partTerkunci = partTerpilih?.status_picking_list === 'final';

    return (
        <Layar>
            <LayarKepala>
                <TombolKepala onClick={() => navigate('/do')} aria-label="Kembali ke daftar DO">
                    <ArrowLeft />
                </TombolKepala>

                <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                        <span className="truncate font-mono text-sm font-semibold text-ink">{fkDo}</span>
                        {bundling && (
                            <span className="shrink-0 bg-honda px-1.5 py-px font-mono text-[10px] font-bold tracking-wider text-white uppercase">
                                Urgent
                            </span>
                        )}
                    </div>
                </div>

                <span className="shrink-0 border-l border-rule pl-3 text-right">
                    <span className="block font-mono text-base leading-none font-bold text-ink">
                        {selesai}
                        <span className="text-ink-2">/{parts.length}</span>
                    </span>
                    <span className="block font-mono text-[10px] text-ink-2">{persen}%</span>
                </span>
            </LayarKepala>

            {partTerpilih && <InfoDo part={partTerpilih} />}

            <div className="flex min-h-0 flex-1">
                <aside className="w-[38%] min-w-60 shrink-0 overflow-y-auto overscroll-contain border-r-2 border-ink bg-panel">
                    <DaftarPart parts={parts} idTerpilih={idTerpilih} onPilih={(p) => setIdTerpilih(p.id)} />
                </aside>

                <section className="flex min-w-0 flex-1 flex-col">
                    <LayarIsi className="p-3">{partTerpilih && <PanelPart part={partTerpilih} />}</LayarIsi>

                    <LayarAksi className="space-y-2">
                        {error && (
                            <p className="flex items-start gap-2 border-l-4 border-honda bg-honda/8 px-3 py-2 text-sm text-honda">
                                <AlertTriangle className="mt-0.5 size-4 shrink-0" />
                                {error}
                            </p>
                        )}

                        {partTerkunci ? (
                            <Button size="xl" variant="garis" className="w-full" disabled>
                                <Lock className="size-5" />
                                Final Check
                            </Button>
                        ) : partSelesai ? (
                            <div className="flex gap-2">
                                <Button size="xl" variant="garis" className="flex-1" disabled>
                                    <Check className="size-6" strokeWidth={3} />
                                    Sudah Diambil
                                </Button>
                                <Button
                                    size="xl"
                                    variant="senyap"
                                    className="shrink-0 border-2 border-rule"
                                    disabled={memproses}
                                    onClick={() => setKonfirmasiUndo(true)}
                                >
                                    {memproses ? <Loader2 className="size-6 animate-spin" /> : <RotateCcw />}
                                    Undo
                                </Button>
                            </div>
                        ) : (
                            <Button
                                size="xl"
                                className="w-full"
                                disabled={memproses}
                                onClick={() => ubahStatus('done')}
                            >
                                {memproses ? <Loader2 className="size-6 animate-spin" /> : 'Ambil'}
                            </Button>
                        )}
                    </LayarAksi>
                </section>
            </div>

            {itemKartuStok.length > 0 && (
                <DialogKartuStok
                    items={itemKartuStok}
                    menyimpan={menyimpanKartu}
                    peringatan={peringatanKartu}
                    onSimpan={simpanKartuStok}
                />
            )}

            {konfirmasiUndo && partTerpilih && (
                <DialogKonfirmasi
                    judul="Batalkan pengambilan?"
                    labelKonfirmasi="Ya, batalkan"
                    sedangProses={memproses}
                    onBatal={() => setKonfirmasiUndo(false)}
                    onKonfirmasi={async () => {
                        await ubahStatus('waiting');
                        setKonfirmasiUndo(false);
                    }}
                    keterangan={
                        <div className="space-y-2.5">
                            <div className="flex items-center gap-3">
                                <PlatRak kode={partTerpilih.lokasi_part} ukuran="md" />
                                <span className="min-w-0">
                                    <span className="block truncate font-mono text-base font-bold text-ink">
                                        {partTerpilih.fk_part}
                                    </span>
                                    <span className="block truncate text-xs text-ink-2">
                                        {partTerpilih.nm_part ?? '-'}
                                    </span>
                                </span>
                            </div>
                            <p>
                                Part ini kembali berstatus <strong>Waiting</strong>, dan{' '}
                                <strong>{partTerpilih.qty_part}</strong> barang dicatat masuk kembali ke rak pada
                                kartu stok.
                            </p>
                            <p className="text-ink-2">Pastikan barangnya benar-benar sudah Anda kembalikan ke rak.</p>
                        </div>
                    }
                />
            )}

            {suksesTampil && <OverlaySukses pesan="Kartu stok tersimpan" onSelesai={tutupSukses} />}
        </Layar>
    );
}

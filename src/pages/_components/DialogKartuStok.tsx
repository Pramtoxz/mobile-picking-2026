import { PlatRak } from '@/components/plat-rak';
import { Button } from '@/components/ui/button';
import { useKunciLayar } from '@/hooks/use-kunci-layar';
import type { ItemKartuStok } from '@/types';
import { AlertTriangle, Loader2, Lock } from 'lucide-react';
import { useState } from 'react';

interface DialogKartuStokProps {
    items: ItemKartuStok[];
    menyimpan: boolean;
    peringatan: string | null;
    onSimpan: (items: ItemKartuStok[]) => void;
}

export default function DialogKartuStok({ items, menyimpan, peringatan, onSimpan }: DialogKartuStokProps) {
    const [jumlah, setJumlah] = useState<Record<number, string>>({});

    useKunciLayar(true);

    const semuaTerisi = items.every((_, i) => (jumlah[i] ?? '').trim() !== '' && Number(jumlah[i]) >= 1);

    const simpan = () => {
        onSimpan(
            items.map((item, i) => ({
                ...item,
                jumlah_input: parseInt(jumlah[i] ?? '0', 10) || 0,
            })),
        );
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/70 p-4">
            <div className="flex max-h-full w-full max-w-2xl flex-col border-2 border-ink bg-panel">
                <div className="shrink-0 border-b-2 border-ink bg-ink px-4 py-2.5">
                    <h2 className="flex items-center gap-2 font-mono text-sm font-bold tracking-widest text-white uppercase">
                        <Lock className="size-3.5 shrink-0" />
                        Kartu Stok Keluar
                    </h2>
                    <p className="mt-0.5 text-xs text-white/60">
                        Barang sudah keluar dari rak. Hitung fisik yang Anda ambil, masukkan jumlahnya, lalu simpan
                        untuk melanjutkan.
                    </p>
                </div>

                <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
                    <ul className="divide-y divide-rule">
                        {items.map((item, i) => (
                            <li key={i} className="flex items-center gap-3 px-4 py-2.5">
                                <PlatRak kode={item.lokasi_part} />
                                <span className="min-w-0 flex-1 truncate font-mono text-sm font-semibold text-ink">
                                    {item.fk_part}
                                </span>
                                <input
                                    type="number"
                                    min="1"
                                    max="9999"
                                    inputMode="numeric"
                                    value={jumlah[i] ?? ''}
                                    onChange={(e) => setJumlah((v) => ({ ...v, [i]: e.target.value }))}
                                    disabled={menyimpan}
                                    autoFocus={i === 0}
                                    placeholder="0"
                                    aria-label={`Jumlah keluar untuk part ${item.fk_part}`}
                                    className="h-12 w-24 shrink-0 rounded-sm border-2 border-rule bg-panel text-center font-mono text-xl font-bold text-ink focus-visible:border-ink focus-visible:outline-none"
                                />
                            </li>
                        ))}
                    </ul>
                </div>

                {peringatan && (
                    <p className="flex shrink-0 items-start gap-2 border-t-2 border-honda bg-honda/10 px-4 py-2.5 text-sm font-semibold text-honda">
                        <AlertTriangle className="mt-0.5 size-4 shrink-0" />
                        {peringatan}
                    </p>
                )}

                <div className="shrink-0 border-t border-rule px-4 py-3">
                    <Button size="lg" className="w-full" disabled={menyimpan || !semuaTerisi} onClick={simpan}>
                        {menyimpan ? (
                            <>
                                <Loader2 className="size-5 animate-spin" />
                                Menyimpan
                            </>
                        ) : (
                            'Simpan'
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
}

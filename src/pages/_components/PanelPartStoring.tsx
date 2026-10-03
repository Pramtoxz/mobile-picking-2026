import { LampuPilot, type StatusPilot } from '@/components/lampu-pilot';
import { PlatRakIndustri } from '@/components/plat-rak-industri';
import { Button } from '@/components/ui/button';
import { sensory } from '@/lib/sensory';
import type { BarisPartStoring } from '@/types';
import { Box, Check, Layers, Minus, Package, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';

interface PanelPartStoringProps {
    part: BarisPartStoring;
    sedangMenyimpan: boolean;
    onSimpan: (qtyMasuk: number) => void;
}

export default function PanelPartStoring({ part, sedangMenyimpan, onSimpan }: PanelPartStoringProps) {
    const [qty, setQty] = useState<number>(part.qty_masuk ?? part.qty_diterima);

    useEffect(() => {
        setQty(part.qty_masuk ?? part.qty_diterima);
    }, [part.id, part.qty_masuk, part.qty_diterima]);

    const pilotStatus: StatusPilot = part.status_masuk ? 'done' : 'waiting';

    const ubahQty = (delta: number) => {
        sensory.tap();
        setQty((prev) => Math.max(0, prev + delta));
    };

    const handleKirim = () => {
        sensory.tap();
        onSimpan(qty);
    };

    return (
        <div className="flex h-full flex-col justify-between space-y-2 p-1 select-none">
            {/* Header: Plat Rak Industri & Target Qty Box */}
            <div className="grid grid-cols-[1fr_auto] items-stretch gap-2.5">
                <div className="flex flex-col justify-center min-w-0">
                    <PlatRakIndustri kode={part.kode_rak} ukuran="lg" />
                </div>

                <div className="flex flex-col items-center justify-center border-2 border-ink bg-plate px-4 py-1 rounded-xs min-w-28 text-center text-ink shadow-[2px_2px_0_0_#17150f]">
                    <span className="font-mono text-[9px] font-black tracking-widest uppercase text-ink-2">
                        TARGET
                    </span>
                    <span className="font-mono text-3xl sm:text-4xl leading-none font-black my-0.5 tracking-tight">
                        {part.qty_diterima}
                    </span>
                    <span className="font-mono text-[9px] font-bold text-ink-2 uppercase">
                        PCS
                    </span>
                </div>
            </div>

            {/* Part Identifier Card */}
            <div className="border-2 border-ink bg-panel p-2.5 rounded-xs shadow-[2px_2px_0_0_#17150f] space-y-1">
                <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-[10px] font-bold tracking-widest text-ink-2 uppercase flex items-center gap-1.5">
                        <Package className="size-3.5 text-honda" />
                        Part Number Honda
                    </span>
                    <LampuPilot
                        status={pilotStatus}
                        label={part.status_masuk ? 'SELESAI MASUK RAK' : 'MENUNGGU STORING'}
                    />
                </div>
                <p className="font-mono text-xl sm:text-2xl font-black tracking-wider text-ink truncate">
                    {part.no_part}
                </p>
                <p className="text-xs text-ink font-semibold truncate">
                    {part.nm_part || '-'}
                </p>
            </div>

            {/* Doos / Dus Box Info & Detail Bar */}
            <div className="grid grid-cols-3 gap-1.5 border-t-2 border-rule pt-2">
                <div className="bg-plate border border-rule p-1.5 rounded-xs shadow-2xs">
                    <p className="font-mono text-[9px] font-bold text-ink-2 tracking-wider uppercase">Nomor Doos</p>
                    <p className="font-mono text-xs font-black text-ink truncate flex items-center gap-1">
                        <Box className="size-3 text-ink-2 shrink-0" />
                        {part.no_doos || '—'}
                    </p>
                </div>
                <div className="bg-plate border border-rule p-1.5 rounded-xs shadow-2xs">
                    <p className="font-mono text-[9px] font-bold text-ink-2 tracking-wider uppercase">Grup Rak</p>
                    <p className="font-mono text-xs font-bold text-ink truncate flex items-center gap-1">
                        <Layers className="size-3 text-ink-2 shrink-0" />
                        {part.kode_rak.split('.')[0] || 'Rak'}
                    </p>
                </div>
                <div className="bg-plate border border-rule p-1.5 rounded-xs shadow-2xs">
                    <p className="font-mono text-[9px] font-bold text-ink-2 tracking-wider uppercase">Status Masuk</p>
                    <p className="font-mono text-xs font-bold text-ink truncate">
                        {part.status_masuk ? `Selesai (${part.qty_masuk} pcs)` : 'Belum'}
                    </p>
                </div>
            </div>

            {/* Form Input QTY Masuk & Tombol Aksi Taktil */}
            <div className="border-2 border-ink bg-panel p-2.5 rounded-xs shadow-[2px_2px_0_0_#17150f] space-y-2">
                <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] font-black uppercase tracking-wider text-ink">
                        JUMLAH MASUK KE RAK:
                    </span>
                    <button
                        type="button"
                        onClick={() => {
                            sensory.tap();
                            setQty(part.qty_diterima);
                        }}
                        className="font-mono text-[10px] font-bold text-honda hover:underline cursor-pointer"
                    >
                        Samakan ({part.qty_diterima})
                    </button>
                </div>

                <div className="flex items-center gap-2">
                    <Button
                        type="button"
                        variant="garis"
                        size="sm"
                        onClick={() => ubahQty(-1)}
                        disabled={qty <= 0 || sedangMenyimpan}
                        className="h-10 px-3 cursor-pointer"
                    >
                        <Minus className="size-4" />
                    </Button>

                    <input
                        type="number"
                        min="0"
                        value={qty}
                        onChange={(e) => setQty(Math.max(0, parseInt(e.target.value || '0', 10)))}
                        disabled={sedangMenyimpan}
                        className="h-10 flex-1 rounded-xs border-2 border-ink bg-plate text-center font-mono text-xl font-black text-ink shadow-[inset_0_2px_4px_rgba(0,0,0,0.06)] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-honda"
                    />

                    <Button
                        type="button"
                        variant="garis"
                        size="sm"
                        onClick={() => ubahQty(1)}
                        disabled={sedangMenyimpan}
                        className="h-10 px-3 cursor-pointer"
                    >
                        <Plus className="size-4" />
                    </Button>
                </div>

                <Button
                    type="button"
                    size="lg"
                    onClick={handleKirim}
                    disabled={sedangMenyimpan}
                    className="w-full h-12 bg-ink hover:bg-ink/90 text-white font-mono text-sm font-black tracking-widest uppercase cursor-pointer shadow-[2px_2px_0_0_#17150f] active:translate-x-0.5 active:translate-y-0.5"
                >
                    <Check className="size-5 mr-1.5" />
                    {sedangMenyimpan ? 'MENYIMPAN...' : part.status_masuk ? 'PERBARUI MASUK RAK' : 'SIMPAN MASUK RAK'}
                </Button>
            </div>
        </div>
    );
}

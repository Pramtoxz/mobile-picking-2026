import { PlatRak } from '@/components/plat-rak';
import { waktuIndo } from '@/lib/format';
import type { BarisPart } from '@/types';
import { Layers, MapPin, Package } from 'lucide-react';

const statusBadge: Record<string, { label: string; kelas: string }> = {
    done: { label: 'SUDAH DIAMBIL', kelas: 'border-selesai/40 bg-selesai/10 text-selesai' },
    final: { label: 'FINAL CHECK', kelas: 'border-ink-2/40 bg-plate text-ink-2' },
    waiting: { label: 'MENUNGGU', kelas: 'border-rule bg-panel text-ink-2' },
};

export default function PanelPart({ part }: { part: BarisPart }) {
    const status = statusBadge[part.status_picking_list] ?? {
        label: (part.status_picking_list || 'WAITING').toUpperCase(),
        kelas: 'border-rule bg-panel text-ink',
    };

    return (
        <div className="flex h-full flex-col justify-between space-y-2 p-1 select-none">
            {/* Header: Plat Rak Fisik & Target Ambil Box */}
            <div className="grid grid-cols-[1fr_auto] items-stretch gap-2.5">
                <div className="flex flex-col justify-center min-w-0">
                    <span className="font-mono text-[10px] font-bold tracking-widest text-ink-2 uppercase flex items-center gap-1 mb-1">
                        <MapPin className="size-3 text-honda" />
                        Lokasi Rak Fisik
                    </span>
                    <PlatRak kode={part.lokasi_part} ukuran="xl" className="shadow-xs" />
                </div>

                {/* Box QTY Ambil (Fokus Utama Angka Fisik) */}
                <div className="flex flex-col items-center justify-center border-2 border-honda bg-honda/8 px-3.5 py-1 rounded-sm min-w-24 text-center">
                    <span className="font-mono text-[9px] font-bold tracking-widest text-honda uppercase">
                        Ambil
                    </span>
                    <span className="font-mono text-3xl sm:text-4xl leading-none font-black text-honda my-0.5">
                        {part.qty_part}
                    </span>
                    <span className="font-mono text-[9px] font-bold text-honda/80 uppercase">
                        PCS
                    </span>
                </div>
            </div>

            {/* Part Identifier Card */}
            <div className="border-2 border-rule bg-plate/40 p-2 rounded-sm space-y-1">
                <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-[10px] tracking-wider text-ink-2 uppercase flex items-center gap-1">
                        <Package className="size-3" />
                        Part Number
                    </span>
                    <span className={`px-1.5 py-0.5 font-mono text-[9px] font-bold tracking-wider rounded-xs border ${status.kelas}`}>
                        {status.label}
                    </span>
                </div>
                <p className="font-mono text-lg sm:text-xl font-bold tracking-wide text-ink truncate">
                    {part.fk_part}
                </p>
                <p className="text-xs text-ink-2 font-medium truncate">
                    {part.nm_part ?? '-'}
                </p>
            </div>

            {/* Telemetry Metrics Bar */}
            <div className="grid grid-cols-3 gap-1.5 border-t border-rule pt-1.5">
                <div className="bg-panel border border-rule p-1 rounded-xs">
                    <p className="font-mono text-[9px] text-ink-2 tracking-wider uppercase">Qty Picking</p>
                    <p className="font-mono text-xs font-bold text-ink">{part.qty_picking} PCS</p>
                </div>
                <div className="bg-panel border border-rule p-1 rounded-xs">
                    <p className="font-mono text-[9px] text-ink-2 tracking-wider uppercase">Waktu Selesai</p>
                    <p className="font-mono text-xs font-semibold text-ink truncate">
                        {part.waktu_done ? waktuIndo(part.waktu_done) : '—'}
                    </p>
                </div>
                <div className="bg-panel border border-rule p-1 rounded-xs">
                    <p className="font-mono text-[9px] text-ink-2 tracking-wider uppercase">Grup Rak</p>
                    <p className="font-mono text-xs font-semibold text-ink truncate flex items-center gap-1">
                        <Layers className="size-3 text-ink-2 shrink-0" />
                        {part.lokasi_part.split('.')[0] || 'Rak'}
                    </p>
                </div>
            </div>

            {/* Catatan / Keterangan Khusus DO jika ada */}
            {part.keterangan_picking && part.keterangan_picking !== '-' && (
                <div className="border-l-4 border-honda bg-honda/5 px-2 py-1 text-xs text-ink font-medium rounded-xs">
                    <span className="font-mono font-bold text-[9px] text-honda uppercase block">Catatan:</span>
                    <span className="truncate block">{part.keterangan_picking}</span>
                </div>
            )}
        </div>
    );
}

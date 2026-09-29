import { LampuPilot, type StatusPilot } from '@/components/lampu-pilot';
import { PlatRakIndustri } from '@/components/plat-rak-industri';
import { waktuIndo } from '@/lib/format';
import type { BarisPart } from '@/types';
import { AlertTriangle, Layers, Package } from 'lucide-react';

const statusLabel: Record<string, string> = {
    done: 'SELESAI DIAMBIL',
    final: 'FINAL CHECK',
    waiting: 'MENUNGGU AMBIL',
};

export default function PanelPart({ part }: { part: BarisPart }) {
    const pilotStatus: StatusPilot =
        part.status_picking_list === 'done'
            ? 'done'
            : part.status_picking_list === 'final'
            ? 'final'
            : 'waiting';

    return (
        <div className="flex h-full flex-col justify-between space-y-2 p-1 select-none">
            {/* Header: Plat Rak Industri & Target Ambil Box */}
            <div className="grid grid-cols-[1fr_auto] items-stretch gap-2.5">
                <div className="flex flex-col justify-center min-w-0">
                    <PlatRakIndustri kode={part.lokasi_part} ukuran="lg" />
                </div>

                {/* Box QTY Ambil (Fokus Utama Angka Fisik - Taktil Mesin) */}
                <div className="flex flex-col items-center justify-center border-2 border-ink bg-honda px-4 py-1 rounded-xs min-w-28 text-center text-white shadow-[2px_2px_0_0_#17150f]">
                    <span className="font-mono text-[9px] font-black tracking-widest uppercase text-white/90">
                        AMBIL
                    </span>
                    <span className="font-mono text-3xl sm:text-4xl leading-none font-black my-0.5 tracking-tight">
                        {part.qty_part}
                    </span>
                    <span className="font-mono text-[9px] font-bold text-white/90 uppercase">
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
                    <LampuPilot status={pilotStatus} label={statusLabel[part.status_picking_list] ?? part.status_picking_list} />
                </div>
                <p className="font-mono text-xl sm:text-2xl font-black tracking-wider text-ink truncate">
                    {part.fk_part}
                </p>
                <p className="text-xs text-ink font-semibold truncate">
                    {part.nm_part ?? '-'}
                </p>
            </div>

            {/* Telemetry Metrics Bar */}
            <div className="grid grid-cols-3 gap-1.5 border-t-2 border-rule pt-2">
                <div className="bg-plate border border-rule p-1.5 rounded-xs shadow-2xs">
                    <p className="font-mono text-[9px] font-bold text-ink-2 tracking-wider uppercase">Qty Picking</p>
                    <p className="font-mono text-xs font-black text-ink">{part.qty_picking} PCS</p>
                </div>
                <div className="bg-plate border border-rule p-1.5 rounded-xs shadow-2xs">
                    <p className="font-mono text-[9px] font-bold text-ink-2 tracking-wider uppercase">Waktu Selesai</p>
                    <p className="font-mono text-xs font-bold text-ink truncate">
                        {part.waktu_done ? waktuIndo(part.waktu_done) : '—'}
                    </p>
                </div>
                <div className="bg-plate border border-rule p-1.5 rounded-xs shadow-2xs">
                    <p className="font-mono text-[9px] font-bold text-ink-2 tracking-wider uppercase">Grup Rak</p>
                    <p className="font-mono text-xs font-bold text-ink truncate flex items-center gap-1">
                        <Layers className="size-3 text-ink-2 shrink-0" />
                        {part.lokasi_part.split('.')[0] || 'Rak'}
                    </p>
                </div>
            </div>

            {/* Keterangan DO / Catatan Khusus (Tampil Penuh Tanpa Terpotong) */}
            {part.keterangan_picking && part.keterangan_picking !== '-' && (
                <div className="border-2 border-honda/40 border-l-4 border-l-honda bg-honda/8 p-2.5 rounded-xs shadow-2xs">
                    <div className="flex items-center gap-1.5 font-mono font-bold text-[10px] text-honda uppercase tracking-wide">
                        <AlertTriangle className="size-3.5 shrink-0 text-honda" />
                        <span>Keterangan:</span>
                    </div>
                    <p className="mt-1 font-mono text-xs font-bold leading-relaxed text-ink select-text break-words whitespace-pre-wrap">
                        {part.keterangan_picking}
                    </p>
                </div>
            )}
        </div>
    );
}

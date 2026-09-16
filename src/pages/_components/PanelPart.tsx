import { PlatRak } from '@/components/plat-rak';
import { waktuIndo } from '@/lib/format';
import type { BarisPart } from '@/types';

const statusLabel: Record<string, string> = {
    done: 'Done',
    final: 'Final',
    waiting: 'Waiting',
};

const Kolom = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div className="min-w-0">
        <p className="font-mono text-[10px] tracking-wider text-ink-2 uppercase">{label}</p>
        {children}
    </div>
);

export default function PanelPart({ part }: { part: BarisPart }) {
    return (
        <div className="space-y-2.5">
            <PlatRak kode={part.lokasi_part} ukuran="xl" />

            <div className="grid grid-cols-[auto_1fr] gap-x-5">
                <Kolom label="Ambil">
                    <p className="font-mono text-4xl leading-none font-bold text-ink">{part.qty_part}</p>
                </Kolom>

                <Kolom label="Part Number">
                    <p className="truncate font-mono text-xl font-bold text-ink">{part.fk_part}</p>
                    <p className="mt-0.5 truncate text-sm text-ink-2">{part.nm_part ?? '-'}</p>
                </Kolom>
            </div>

            <div className="grid grid-cols-3 gap-3 border-t border-rule pt-2">
                <Kolom label="Qty Picking">
                    <p className="font-mono text-sm font-semibold text-ink">{part.qty_picking}</p>
                </Kolom>
                <Kolom label="Status">
                    <p className="font-mono text-sm font-semibold text-ink">
                        {statusLabel[part.status_picking_list] ?? part.status_picking_list}
                    </p>
                </Kolom>
                <Kolom label="Waktu Done">
                    <p className="truncate font-mono text-sm font-semibold text-ink">{waktuIndo(part.waktu_done)}</p>
                </Kolom>
            </div>

            {part.keterangan_picking && part.keterangan_picking !== '-' && (
                <p className="border-l-4 border-rule bg-plate px-3 py-1.5 text-sm text-ink">
                    {part.keterangan_picking}
                </p>
            )}
        </div>
    );
}

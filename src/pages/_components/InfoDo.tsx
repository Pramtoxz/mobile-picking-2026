import { tanggalIndo } from '@/lib/format';
import type { BarisPart } from '@/types';

const ItemInfo = ({ label, nilai }: { label: string; nilai: string }) => (
    <span className="flex items-center gap-1 text-[10px] font-mono">
        <span className="text-ink-2 tracking-wider uppercase">{label}:</span>
        <span className="font-bold text-ink truncate">{nilai}</span>
    </span>
);

export default function InfoDo({ part }: { part: BarisPart }) {
    return (
        <div className="flex shrink-0 items-center justify-between gap-x-3 border-b border-rule bg-plate/60 px-3 py-1 select-none overflow-x-auto">
            <div className="flex items-center gap-x-4 shrink-0">
                <ItemInfo label="Area" nilai={part.area || '-'} />
                <span className="text-rule">•</span>
                <ItemInfo label="Channel" nilai={part.nama_channel || '-'} />
                <span className="text-rule">•</span>
                <ItemInfo label="Dealer" nilai={part.fk_dealer || '-'} />
            </div>

            <div className="shrink-0">
                <ItemInfo label="Tgl DO" nilai={tanggalIndo(part.tgl_picking_list_part)} />
            </div>
        </div>
    );
}

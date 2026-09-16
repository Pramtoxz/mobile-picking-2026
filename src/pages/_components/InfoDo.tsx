import { tanggalIndo } from '@/lib/format';
import type { BarisPart } from '@/types';

const Butir = ({ label, nilai }: { label: string; nilai: string }) => (
    <span className="flex min-w-0 items-baseline gap-1.5">
        <span className="shrink-0 font-mono text-[10px] tracking-wider text-ink-2 uppercase">{label}</span>
        <span className="truncate text-[11px] font-semibold text-ink">{nilai}</span>
    </span>
);

export default function InfoDo({ part }: { part: BarisPart }) {
    return (
        <div className="flex shrink-0 flex-wrap items-baseline gap-x-4 gap-y-0.5 border-b border-rule bg-plate px-3 py-1.5">
            <Butir label="Area" nilai={part.area || '-'} />
            <Butir label="Channel" nilai={part.nama_channel || '-'} />
            <Butir label="Dealer" nilai={part.fk_dealer || '-'} />
            <Butir label="Tgl DO" nilai={tanggalIndo(part.tgl_picking_list_part)} />
        </div>
    );
}

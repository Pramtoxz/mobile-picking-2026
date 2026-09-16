import { LencanaStatus } from "@/components/lencana-status";
import type { BarisDo } from "@/types";
import { ChevronRight } from "lucide-react";

interface BarisDoItemProps {
  item: BarisDo;
  nomor: number;
  onClick: () => void;
}

export function KepalaKolomDo() {
  return (
    <div className="sticky top-0 z-10 flex items-center gap-2 border-b border-rule bg-plate px-3 py-1.5 font-mono text-[10px] tracking-wider text-ink-2 uppercase">
      <span className="w-7 shrink-0 text-right">No.</span>
      <span className="min-w-0 flex-1">Nomor DO / Channel</span>
      <span className="hidden w-24 shrink-0 sm:block">Status</span>
      <span className="w-10 shrink-0 text-right">Item</span>
      <span className="hidden w-12 shrink-0 text-right sm:block">Picking</span>
      <span className="hidden w-20 shrink-0 sm:block">Progress</span>
      <span className="w-4 shrink-0" />
    </div>
  );
}

export default function BarisDoItem({
  item,
  nomor,
  onClick,
}: BarisDoItemProps) {
  const persen =
    item.total_items > 0
      ? Math.round((item.done_parts / item.total_items) * 100)
      : 0;
  const warnaBar =
    persen === 100 ? "bg-selesai" : persen > 0 ? "bg-ink" : "bg-honda";

  return (
    <li>
      <button
        onClick={onClick}
        className="flex w-full items-center gap-2 border-l-4 border-transparent px-3 py-2 text-left transition-colors hover:bg-plate focus-visible:border-honda focus-visible:bg-plate focus-visible:outline-none"
      >
        <span className="w-7 shrink-0 text-right font-mono text-[11px] text-ink-2">
          {nomor}
        </span>

        <span className="min-w-0 flex-1">
          <span className="flex items-center gap-1.5">
            <span className="truncate font-mono text-sm font-semibold text-ink">
              {item.fk_do}
            </span>
            {item.is_bundling && (
              <span className="shrink-0 bg-honda px-1.5 py-px font-mono text-[10px] font-bold tracking-wider text-white uppercase">
                Urgent
              </span>
            )}
          </span>
          <span className="mt-0.5 flex items-center gap-1.5">
            <span className="truncate text-[11px] text-ink-2">
              {item.nama_channel}
              {item.area ? ` · ${item.area}` : ""}
            </span>
            <LencanaStatus
              status={item.status_do}
              className="shrink-0 sm:hidden"
            />
          </span>
        </span>

        <span className="hidden w-24 shrink-0 sm:block">
          <LencanaStatus status={item.status_do} />
        </span>

        <span className="w-10 shrink-0 text-right font-mono text-sm font-semibold text-ink">
          {item.total_items}
        </span>

        <span className="hidden w-12 shrink-0 text-right font-mono text-sm text-ink-2 sm:block">
          {item.total_picking}
        </span>

        <span className="hidden w-20 shrink-0 sm:block">
          <span className="relative block h-4 w-full overflow-hidden border border-rule bg-panel">
            <span
              className={`block h-full ${warnaBar}`}
              style={{ width: `${persen}%` }}
            />
            <span className="absolute inset-0 flex items-center justify-center font-mono text-[10px] font-bold text-ink mix-blend-difference invert">
              {persen}%
            </span>
          </span>
        </span>

        <ChevronRight className="size-4 shrink-0 text-ink-2" />
      </button>
    </li>
  );
}

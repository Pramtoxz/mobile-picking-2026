import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import type { ReactNode } from 'react';

interface DialogKonfirmasiProps {
    judul: string;
    keterangan: ReactNode;
    labelKonfirmasi: string;
    sedangProses?: boolean;
    onBatal: () => void;
    onKonfirmasi: () => void;
}

export function DialogKonfirmasi({
    judul,
    keterangan,
    labelKonfirmasi,
    sedangProses = false,
    onBatal,
    onKonfirmasi,
}: DialogKonfirmasiProps) {
    return (
        <div
            role="alertdialog"
            aria-modal="true"
            className="fixed inset-0 z-50 flex items-center justify-center bg-ink/70 p-4"
        >
            <div className="flex w-full max-w-xl flex-col border-2 border-ink bg-panel">
                <div className="shrink-0 border-b-2 border-ink bg-ink px-4 py-2.5">
                    <h2 className="font-mono text-sm font-bold tracking-widest text-white uppercase">{judul}</h2>
                </div>

                <div className="min-h-0 flex-1 overflow-y-auto px-4 py-3 text-sm text-ink">{keterangan}</div>

                <div className="flex shrink-0 gap-2 border-t border-rule px-4 py-3">
                    <Button variant="garis" size="lg" className="flex-1" disabled={sedangProses} onClick={onBatal}>
                        Batal
                    </Button>
                    <Button size="lg" className="flex-1" disabled={sedangProses} onClick={onKonfirmasi}>
                        {sedangProses ? <Loader2 className="size-5 animate-spin" /> : labelKonfirmasi}
                    </Button>
                </div>
            </div>
        </div>
    );
}

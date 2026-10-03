import { AlertTriangle, Clock, KeyRound, ShieldCheck } from 'lucide-react';

interface DisplayKodeLoginProps {
    kode: string;
    error: string | null;
}

export default function DisplayKodeLogin({ kode, error }: DisplayKodeLoginProps) {
    const digit1 = [0, 1, 2];
    const digit2 = [3, 4, 5];

    return (
        <div className="flex flex-col justify-between h-full space-y-3 p-1 select-none">
            <div className="space-y-1">
                <div className="flex items-center gap-1.5 font-mono text-[11px] font-black tracking-widest text-ink uppercase">
                    <ShieldCheck className="size-4 text-honda shrink-0" />
                    OTORISASI KEPALA GUDANG
                </div>
                <p className="font-mono text-[10px] text-ink-2 leading-tight">
                    Minta 6 digit kode angka ke Kepala Gudang untuk masuk ke terminal ini.
                </p>
            </div>

            {/* Industrial Plate Display untuk 6-Digit Code */}
            <div className="flex w-full flex-col items-center justify-center bg-plate border-2 border-ink rounded-xs py-2.5 sm:py-3 px-2 sm:px-3 shadow-[2px_2px_0_0_#17150f]">
                <span className="font-mono text-[10px] font-bold tracking-widest text-ink-2 uppercase mb-2 flex items-center gap-1.5">
                    <KeyRound className="size-3.5 text-honda" />
                    KODE AKSES LOGIN (6 DIGIT)
                </span>

                <div className="flex w-full items-center justify-center gap-1 sm:gap-1.5">
                    <div className="flex items-center gap-1 sm:gap-1.5">
                        {digit1.map((idx) => {
                            const char = kode[idx];
                            return (
                                <div
                                    key={idx}
                                    className="flex size-8 sm:size-9 aspect-square items-center justify-center border-2 border-ink bg-panel rounded-xs shadow-[1px_1px_0_0_#17150f] shrink"
                                >
                                    <span className="font-mono text-lg sm:text-xl font-black text-ink leading-none">
                                        {char ?? <span className="text-rule font-normal">·</span>}
                                    </span>
                                </div>
                            );
                        })}
                    </div>

                    <span className="font-mono text-base font-black text-ink-2 select-none px-0.5 shrink-0">-</span>

                    <div className="flex items-center gap-1 sm:gap-1.5">
                        {digit2.map((idx) => {
                            const char = kode[idx];
                            return (
                                <div
                                    key={idx}
                                    className="flex size-8 sm:size-9 aspect-square items-center justify-center border-2 border-ink bg-panel rounded-xs shadow-[1px_1px_0_0_#17150f] shrink"
                                >
                                    <span className="font-mono text-lg sm:text-xl font-black text-ink leading-none">
                                        {char ?? <span className="text-rule font-normal">·</span>}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="mt-2.5 flex items-center gap-1 font-mono text-[10px] text-ink-2 font-bold uppercase tracking-wider">
                    <Clock className="size-3 text-ink-2" />
                    <span>Masa berlaku per kode: 5 Menit</span>
                </div>
            </div>

            {/* Error Banner */}
            {error && (
                <div className="flex items-start gap-2 border-2 border-honda bg-honda/15 p-2 text-xs font-bold text-honda leading-snug rounded-xs shadow-xs">
                    <AlertTriangle className="size-4 shrink-0 mt-0.5" />
                    <span>{error}</span>
                </div>
            )}

            {!error && (
                <div className="bg-plate border border-rule p-2 rounded-xs">
                    <p className="font-mono text-[10px] text-ink-2 leading-relaxed">
                        Satu kode hanya dapat digunakan sekali. Setelah masuk, sesi kerja tetap aktif di HP ini.
                    </p>
                </div>
            )}
        </div>
    );
}

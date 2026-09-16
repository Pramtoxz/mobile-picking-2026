import { Button } from '@/components/ui/button';
import { Delete, Loader2, Send } from 'lucide-react';
import { useEffect } from 'react';

interface NumpadIndustriProps {
    onDigit: (digit: string) => void;
    onBackspace: () => void;
    onClear: () => void;
    onSubmit: () => void;
    disabled?: boolean;
    canSubmit?: boolean;
    submitting?: boolean;
}

const TOMBOL_ANGKA = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];

export default function NumpadIndustri({
    onDigit,
    onBackspace,
    onClear,
    onSubmit,
    disabled = false,
    canSubmit = false,
    submitting = false,
}: NumpadIndustriProps) {
    useEffect(() => {
        const tanganiKeydown = (e: KeyboardEvent) => {
            if (disabled || submitting) return;

            if (e.key >= '0' && e.key <= '9') {
                e.preventDefault();
                onDigit(e.key);
            } else if (e.key === 'Backspace') {
                e.preventDefault();
                onBackspace();
            } else if (e.key === 'Escape' || e.key.toLowerCase() === 'c') {
                e.preventDefault();
                onClear();
            } else if (e.key === 'Enter') {
                e.preventDefault();
                if (canSubmit) onSubmit();
            }
        };

        window.addEventListener('keydown', tanganiKeydown);
        return () => window.removeEventListener('keydown', tanganiKeydown);
    }, [disabled, submitting, canSubmit, onDigit, onBackspace, onClear, onSubmit]);

    return (
        <div className="flex flex-col gap-1.5 p-2 bg-plate/50 border border-rule rounded-sm select-none">
            <div className="grid grid-cols-3 gap-1.5">
                {TOMBOL_ANGKA.map((angka) => (
                    <button
                        key={angka}
                        type="button"
                        disabled={disabled || submitting}
                        onClick={() => onDigit(angka)}
                        className="h-10 sm:h-11 rounded-sm border-2 border-rule bg-panel font-mono text-lg font-bold text-ink shadow-xs transition-colors hover:bg-plate active:bg-ink active:text-white disabled:opacity-40"
                        aria-label={`Angka ${angka}`}
                    >
                        {angka}
                    </button>
                ))}

                <button
                    type="button"
                    disabled={disabled || submitting}
                    onClick={onClear}
                    className="h-10 sm:h-11 rounded-sm border-2 border-rule bg-panel font-mono text-xs font-bold tracking-wider text-ink-2 shadow-xs transition-colors hover:bg-plate active:bg-ink active:text-white disabled:opacity-40"
                    aria-label="Bersihkan input"
                >
                    CLR
                </button>

                <button
                    type="button"
                    disabled={disabled || submitting}
                    onClick={() => onDigit('0')}
                    className="h-10 sm:h-11 rounded-sm border-2 border-rule bg-panel font-mono text-lg font-bold text-ink shadow-xs transition-colors hover:bg-plate active:bg-ink active:text-white disabled:opacity-40"
                    aria-label="Angka 0"
                >
                    0
                </button>

                <button
                    type="button"
                    disabled={disabled || submitting}
                    onClick={onBackspace}
                    className="flex h-10 sm:h-11 items-center justify-center rounded-sm border-2 border-rule bg-panel text-ink shadow-xs transition-colors hover:bg-plate active:bg-ink active:text-white disabled:opacity-40"
                    aria-label="Hapus satu digit"
                >
                    <Delete className="size-5" />
                </button>
            </div>

            <Button
                type="button"
                size="lg"
                disabled={disabled || submitting || !canSubmit}
                onClick={onSubmit}
                className="mt-0.5 h-11 w-full bg-honda text-white font-mono text-sm font-bold tracking-wider hover:bg-honda/90 active:bg-honda/80 border-2 border-ink rounded-sm"
            >
                {submitting ? (
                    <>
                        <Loader2 className="size-4 animate-spin" />
                        Menyimpan
                    </>
                ) : (
                    <>
                        <Send className="size-4" />
                        Simpan Kartu Stok
                    </>
                )}
            </Button>
        </div>
    );
}

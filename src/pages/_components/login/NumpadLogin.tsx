import { TombolMesin } from '@/components/tombol-mesin';
import { sensory } from '@/lib/sensory';
import { Delete, Loader2, LogIn } from 'lucide-react';
import { motion } from 'motion/react';
import { useEffect } from 'react';

interface NumpadLoginProps {
    onDigit: (digit: string) => void;
    onBackspace: () => void;
    onClear: () => void;
    onSubmit: () => void;
    disabled?: boolean;
    canSubmit?: boolean;
    submitting?: boolean;
}

const TOMBOL_ANGKA = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];

export default function NumpadLogin({
    onDigit,
    onBackspace,
    onClear,
    onSubmit,
    disabled = false,
    canSubmit = false,
    submitting = false,
}: NumpadLoginProps) {
    const handleDigit = (digit: string) => {
        sensory.tap();
        onDigit(digit);
    };

    const handleBackspace = () => {
        sensory.tap();
        onBackspace();
    };

    const handleClear = () => {
        sensory.tap();
        onClear();
    };

    useEffect(() => {
        const tanganiKeydown = (e: KeyboardEvent) => {
            if (disabled || submitting) return;

            if (e.key >= '0' && e.key <= '9') {
                e.preventDefault();
                handleDigit(e.key);
            } else if (e.key === 'Backspace') {
                e.preventDefault();
                handleBackspace();
            } else if (e.key === 'Escape' || e.key.toLowerCase() === 'c') {
                e.preventDefault();
                handleClear();
            } else if (e.key === 'Enter') {
                e.preventDefault();
                if (canSubmit) onSubmit();
            }
        };

        window.addEventListener('keydown', tanganiKeydown);
        return () => window.removeEventListener('keydown', tanganiKeydown);
    }, [disabled, submitting, canSubmit, onDigit, onBackspace, onClear, onSubmit]);

    const kelasKeycap =
        'relative flex h-11 sm:h-12 items-center justify-center rounded-xs border-2 border-ink bg-panel font-mono text-xl sm:text-2xl font-black text-ink shadow-[0_3px_0_0_#17150f] active:shadow-none active:translate-y-[2px] transition-all select-none cursor-pointer disabled:opacity-40 disabled:pointer-events-none';

    return (
        <div className="flex flex-col gap-2 p-2.5 bg-plate border-2 border-ink rounded-xs shadow-[2px_2px_0_0_#17150f] select-none">
            <div className="grid grid-cols-3 gap-2">
                {TOMBOL_ANGKA.map((angka) => (
                    <motion.button
                        key={angka}
                        type="button"
                        disabled={disabled || submitting}
                        onClick={() => handleDigit(angka)}
                        whileTap={{ y: 2 }}
                        className={kelasKeycap}
                        aria-label={`Angka ${angka}`}
                    >
                        {angka}
                    </motion.button>
                ))}

                <motion.button
                    type="button"
                    disabled={disabled || submitting}
                    onClick={handleClear}
                    whileTap={{ y: 2 }}
                    className="relative flex h-11 sm:h-12 items-center justify-center rounded-xs border-2 border-ink bg-plate/80 font-mono text-xs font-black tracking-widest text-ink shadow-[0_3px_0_0_#17150f] active:shadow-none active:translate-y-[2px] transition-all select-none cursor-pointer disabled:opacity-40"
                    aria-label="Bersihkan input"
                >
                    CLR
                </motion.button>

                <motion.button
                    type="button"
                    disabled={disabled || submitting}
                    onClick={() => handleDigit('0')}
                    whileTap={{ y: 2 }}
                    className={kelasKeycap}
                    aria-label="Angka 0"
                >
                    0
                </motion.button>

                <motion.button
                    type="button"
                    disabled={disabled || submitting}
                    onClick={handleBackspace}
                    whileTap={{ y: 2 }}
                    className="relative flex h-11 sm:h-12 items-center justify-center rounded-xs border-2 border-ink bg-plate/80 text-ink shadow-[0_3px_0_0_#17150f] active:shadow-none active:translate-y-[2px] transition-all select-none cursor-pointer disabled:opacity-40"
                    aria-label="Hapus satu digit"
                >
                    <Delete className="size-5" />
                </motion.button>
            </div>

            <TombolMesin
                varian="honda"
                ukuran="lg"
                disabled={disabled || submitting || !canSubmit}
                onClick={onSubmit}
                className="w-full tracking-widest font-black"
            >
                {submitting ? (
                    <>
                        <Loader2 className="size-4 animate-spin" />
                        MEMVERIFIKASI KODE...
                    </>
                ) : (
                    <>
                        <LogIn className="size-4" />
                        MASUK TERMINAL
                    </>
                )}
            </TombolMesin>
        </div>
    );
}

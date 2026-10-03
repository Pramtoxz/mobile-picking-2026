import logoMenara from '@/assets/images/logo-menara-horizontal.png';
import { sensory } from '@/lib/sensory';
import { authService } from '@/services/auth';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DisplayKodeLogin from './_components/login/DisplayKodeLogin';
import NumpadLogin from './_components/login/NumpadLogin';

const PANJANG_KODE = 6;

export default function Login() {
    const [kode, setKode] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleDigit = (digit: string) => {
        if (loading) return;
        setError(null);
        setKode((sebelumnya) => {
            if (sebelumnya.length >= PANJANG_KODE) return sebelumnya;
            return sebelumnya + digit;
        });
    };

    const handleBackspace = () => {
        if (loading) return;
        setError(null);
        setKode((sebelumnya) => sebelumnya.slice(0, -1));
    };

    const handleClear = () => {
        if (loading) return;
        setError(null);
        setKode('');
    };

    const masuk = async () => {
        if (kode.length !== PANJANG_KODE || loading) {
            return;
        }

        setLoading(true);
        setError(null);

        try {
            await authService.loginWithCode(kode);
            sensory.sukses();
            navigate('/do', { replace: true });
        } catch (err: unknown) {
            sensory.peringatan();
            let pesan = 'Kode akses tidak valid atau sudah kedaluwarsa.';
            if (err && typeof err === 'object' && 'response' in err) {
                const res = (err as any).response;
                if (res?.data?.message) {
                    pesan = res.data.message;
                }
            } else if (err instanceof Error && err.message) {
                pesan = err.message;
            }
            setError(pesan);
            setKode('');
        } finally {
            setLoading(false);
        }
    };

    const siapKirim = kode.length === PANJANG_KODE;

    return (
        <div className="h-full overflow-y-auto overscroll-contain bg-ground">
            <div className="flex min-h-full items-center justify-center p-2 sm:p-3">
                <div className="w-full max-w-2xl space-y-2">
                    {/* Header Bar */}
                    <div className="flex items-end justify-between gap-4 px-1">
                        <img src={logoMenara} alt="Menara Agung" className="h-7 w-auto shrink-0" />
                        <h1 className="font-mono text-[11px] tracking-[0.15em] text-ink-2 uppercase">
                            Terminal Operator Picking
                        </h1>
                    </div>

                    {/* Workstation 2-Kolom Landscape */}
                    <div className="grid grid-cols-2 gap-2 border-2 border-ink bg-panel p-2 sm:p-3 rounded-xs shadow-[2px_2px_0_0_#17150f]">
                        <DisplayKodeLogin kode={kode} error={error} />

                        <NumpadLogin
                            onDigit={handleDigit}
                            onBackspace={handleBackspace}
                            onClear={handleClear}
                            onSubmit={masuk}
                            disabled={loading}
                            canSubmit={siapKirim}
                            submitting={loading}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

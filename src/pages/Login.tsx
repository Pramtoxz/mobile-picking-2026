import logoMenara from '@/assets/images/logo-menara-horizontal.png';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { authService, type LoginRequest } from '@/services/auth';
import { AlertTriangle, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [lihatSandi, setLihatSandi] = useState(false);
    const [ingatSaya, setIngatSaya] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const masuk = async () => {
        if (!email || !password) {
            setError('Isi email dan password terlebih dahulu.');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            await authService.login({ email, password } as LoginRequest, ingatSaya);
            navigate('/do', { replace: true });
        } catch (err: unknown) {
            let pesan = 'Email atau password salah.';
            if (err instanceof Error && err.message) {
                pesan = err.message;
            }
            setError(pesan);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-full overflow-y-auto overscroll-contain bg-ground">
            <div className="flex min-h-full items-center justify-center px-4 py-4">
                <div className="w-full max-w-lg space-y-3">
                    <div className="flex items-end justify-between gap-4">
                        <img src={logoMenara} alt="Menara Agung" className="h-8 w-auto shrink-0" />
                        <h1 className="font-mono text-[11px] tracking-[0.15em] text-ink-2 uppercase">
                            Picking Lapangan
                        </h1>
                    </div>

                    <div className="grid gap-3 border-2 border-ink bg-panel p-4 sm:grid-cols-2">
                        <div className="space-y-1.5">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                inputMode="email"
                                placeholder="nama@menara-agung.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={loading}
                                autoComplete="username"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="password">Password</Label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={lihatSandi ? 'text' : 'password'}
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    disabled={loading}
                                    autoComplete="current-password"
                                    className="pr-11"
                                    onKeyDown={(e) => e.key === 'Enter' && masuk()}
                                />
                                <button
                                    type="button"
                                    onClick={() => setLihatSandi((v) => !v)}
                                    aria-label={lihatSandi ? 'Sembunyikan password' : 'Tampilkan password'}
                                    className="absolute top-1/2 right-3 -translate-y-1/2 text-ink-2 hover:text-ink"
                                    tabIndex={-1}
                                >
                                    {lihatSandi ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                                </button>
                            </div>
                        </div>

                        {error && (
                            <p className="flex items-start gap-2 border-l-4 border-honda bg-honda/8 px-3 py-2 text-sm text-honda sm:col-span-2">
                                <AlertTriangle className="mt-0.5 size-4 shrink-0" />
                                {error}
                            </p>
                        )}

                        <label className="flex cursor-pointer items-center gap-2 select-none sm:col-span-2">
                            <input
                                type="checkbox"
                                checked={ingatSaya}
                                onChange={(e) => setIngatSaya(e.target.checked)}
                                disabled={loading}
                                className="size-4 rounded-none border-2 border-rule accent-honda"
                            />
                            <span className="text-sm text-ink-2">Tetap masuk di HP ini</span>
                        </label>

                        <div className="sm:col-span-2">
                            <Button size="lg" className="w-full" disabled={loading} onClick={masuk}>
                                {loading ? (
                                    <>
                                        <Loader2 className="size-5 animate-spin" />
                                        Memproses
                                    </>
                                ) : (
                                    'Masuk'
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

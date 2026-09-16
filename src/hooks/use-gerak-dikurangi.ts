import { useEffect, useState } from 'react';

const KUERI = '(prefers-reduced-motion: reduce)';

export function useGerakDikurangi(): boolean {
    const [dikurangi, setDikurangi] = useState(
        () => typeof window !== 'undefined' && window.matchMedia(KUERI).matches,
    );

    useEffect(() => {
        const media = window.matchMedia(KUERI);
        const perbarui = (peristiwa: MediaQueryListEvent) => setDikurangi(peristiwa.matches);

        media.addEventListener('change', perbarui);
        return () => media.removeEventListener('change', perbarui);
    }, []);

    return dikurangi;
}

import { useEffect } from 'react';

/**
 * Keyboard HP menutup separuh layar — parah di posisi landscape yang tingginya
 * hanya ±393px. Kolom yang sedang diisi digulirkan ke tengah area yang masih
 * terlihat, setelah keyboard selesai muncul.
 */
const JEDA_KEYBOARD_MS = 280;

const KOLOM_ISIAN = 'input, textarea, select';

export function useGulirKeInput(): void {
    useEffect(() => {
        let jeda: number | undefined;

        const saatFokus = (peristiwa: FocusEvent) => {
            const target = peristiwa.target;

            if (!(target instanceof HTMLElement) || !target.matches(KOLOM_ISIAN)) {
                return;
            }

            window.clearTimeout(jeda);
            jeda = window.setTimeout(() => {
                target.scrollIntoView({ block: 'center', behavior: 'smooth' });
            }, JEDA_KEYBOARD_MS);
        };

        const saatViewportBerubah = () => {
            const aktif = document.activeElement;

            if (aktif instanceof HTMLElement && aktif.matches(KOLOM_ISIAN)) {
                aktif.scrollIntoView({ block: 'center', behavior: 'smooth' });
            }
        };

        document.addEventListener('focusin', saatFokus);
        window.visualViewport?.addEventListener('resize', saatViewportBerubah);

        return () => {
            document.removeEventListener('focusin', saatFokus);
            window.visualViewport?.removeEventListener('resize', saatViewportBerubah);
            window.clearTimeout(jeda);
        };
    }, []);
}

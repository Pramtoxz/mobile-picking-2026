import { useEffect } from 'react';

const PENANDA = 'layarTerkunci';

/**
 * Menahan operator keluar dari layar sebelum pekerjaannya tuntas — perilaku
 * aplikasi lama yang dipertahankan untuk Kartu Stok: barang sudah keluar dari
 * rak, jadi jumlahnya wajib tercatat.
 *
 * Caranya menaruh satu entri riwayat sebagai umpan. Tombol back HP memakan
 * entri itu, `popstate` menaruhnya kembali, sehingga posisinya tidak berubah.
 * Entri umpannya dibuang lagi saat layar ditutup secara wajar.
 */
export function useKunciLayar(aktif: boolean): void {
    useEffect(() => {
        if (!aktif) {
            return;
        }

        let sedangMembersihkan = false;

        window.history.pushState({ [PENANDA]: true }, '');

        const tahanKembali = () => {
            if (sedangMembersihkan) {
                return;
            }

            window.history.pushState({ [PENANDA]: true }, '');
        };

        const tahanTutup = (peristiwa: BeforeUnloadEvent) => {
            peristiwa.preventDefault();
            peristiwa.returnValue = '';
        };

        window.addEventListener('popstate', tahanKembali);
        window.addEventListener('beforeunload', tahanTutup);

        return () => {
            sedangMembersihkan = true;
            window.removeEventListener('popstate', tahanKembali);
            window.removeEventListener('beforeunload', tahanTutup);

            if (window.history.state?.[PENANDA]) {
                window.history.back();
            }
        };
    }, [aktif]);
}

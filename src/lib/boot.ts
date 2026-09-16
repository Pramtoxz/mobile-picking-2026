/**
 * Layar boot hanya untuk sekali buka aplikasi. Pemuatan berikutnya (segarkan,
 * ganti penyaring) memakai skeleton daftar supaya strukturnya tetap terlihat.
 */
let sudahBoot = false;

export const perluLayarBoot = (): boolean => !sudahBoot;

export const tandaiSudahBoot = (): void => {
    sudahBoot = true;
};

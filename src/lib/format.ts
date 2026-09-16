export function tanggalIndo(nilai: string | null | undefined): string {
    if (!nilai) {
        return '-';
    }

    const tanggal = new Date(nilai.replace(' ', 'T'));

    if (Number.isNaN(tanggal.getTime())) {
        return '-';
    }

    return tanggal.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function waktuIndo(nilai: string | null | undefined): string {
    if (!nilai) {
        return '-';
    }

    const tanggal = new Date(nilai.replace(' ', 'T'));

    if (Number.isNaN(tanggal.getTime())) {
        return '-';
    }

    return tanggal.toLocaleString('id-ID', {
        day: '2-digit',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
    });
}

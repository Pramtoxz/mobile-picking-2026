export interface MetaPaginasi {
    current_page: number;
    last_page: number;
    total: number;
}

export interface SaringDo {
    area: string | null;
    status: string | null;
    tgl_dari: string | null;
    tgl_sampai: string | null;
    cari: string | null;
}

export const STATUS_BAWAAN = 'default';

export const SEMUA_AREA = 'semua';

export const saringKosong = (): SaringDo => ({
    area: null,
    status: null,
    tgl_dari: null,
    tgl_sampai: null,
    cari: null,
});

export interface BarisDo {
    fk_do: string;
    tgl_picking_list_part: string | null;
    no_picking_list_part: string | null;
    nama_channel: string;
    fk_dealer: string | null;
    area: string | null;
    total_items: number;
    total_picking: number;
    done_parts: number;
    status_do: 'Waiting' | 'On Progress' | 'Done';
    is_bundling: boolean;
}

export interface BarisPart {
    id: number;
    fk_do: string;
    tgl_picking_list_part: string | null;
    fk_dealer: string | null;
    fk_part: string;
    nm_part?: string; // Nama part (deskripsi)
    lokasi_part: string;
    keterangan_picking: string;
    nama_channel: string;
    area: string;
    qty_part: number;
    qty_picking: number;
    status_picking_list: string;
    waktu_done: string | null;
}

export interface UserLapangan {
    id: number;
    email: string;
    nama: string;
    area_operator: string | null;
    adalah_admin_area: boolean;
}

export interface ItemKartuStok {
    fk_do: string;
    fk_dealer: string;
    fk_part: string;
    lokasi_part: string;
    qty_part: number;
    jumlah_input?: number;
}

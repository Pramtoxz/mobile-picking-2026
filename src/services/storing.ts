import api from '@/lib/api';
import type { BarisPartStoring, BarisStoring, DokumenStoringInfo, MetaPaginasi, SaringStoring } from '@/types';

export interface ResponsDaftarStoring {
    success: boolean;
    data: BarisStoring[];
    meta: MetaPaginasi;
    saring: SaringStoring;
    area_operator: string | null;
}

export interface ResponsDetailStoring {
    success: boolean;
    dokumen: DokumenStoringInfo;
    data: BarisPartStoring[];
}

export const storingService = {
    async daftar(params: { page: number } & SaringStoring): Promise<ResponsDaftarStoring> {
        const response = await api.get('/lapangan/storing', { params });
        return response.data;
    },

    async parts(noPenerimaan: string): Promise<ResponsDetailStoring> {
        const response = await api.get(`/lapangan/storing/${noPenerimaan}/parts`);
        return response.data;
    },


    async simpan(data: {
        fk_do: string;
        no_part: string;
        kode_rak: string;
        qty_masuk: number;
    }) {
        const response = await api.post('/lapangan/storing/simpan', data);
        return response.data;
    },

    async tandaiSemua(fk_do: string) {
        const response = await api.post('/lapangan/storing/tandai-semua', { fk_do });
        return response.data;
    },
};

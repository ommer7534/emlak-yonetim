export type IlanTipi = "satilik" | "kiralik";
export type MulkTipi = "daire" | "villa" | "arsa" | "isyeri" | "dukkan";
export type IlanDurumu = "aktif" | "pasif" | "satildi" | "kiralandi";

export interface Ilan {
  id: string;
  slug: string;
  baslik: string;
  aciklama: string;
  fiyat: number;
  para_birimi: "TRY" | "USD" | "EUR";
  ilan_tipi: IlanTipi;
  mulk_tipi: MulkTipi;
  durum: IlanDurumu;
  oda_sayisi: number | null;
  banyo_sayisi: number | null;
  brut_m2: number | null;
  net_m2: number | null;
  kat: number | null;
  toplam_kat: number | null;
  bina_yasi: number | null;
  isitma_tipi: string | null;
  adres: string;
  semt: string;
  ilce: string;
  il: string;
  lat: number | null;
  lng: number | null;
  gorseller: string[];
  ozellikler: string[];
  goruntulenme: number;
  created_at: string;
  updated_at: string;
}

export interface LeadForm {
  ad_soyad: string;
  telefon: string;
  email: string;
  mesaj: string;
  ilan_id: string;
}

export interface IlanFiltre {
  ilan_tipi?: IlanTipi;
  mulk_tipi?: MulkTipi;
  min_fiyat?: number;
  max_fiyat?: number;
  min_m2?: number;
  max_m2?: number;
  oda_sayisi?: number;
  semt?: string;
  ilce?: string;
}

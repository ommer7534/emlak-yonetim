export function formatFiyat(fiyat: number, paraBirimi = "TRY"): string {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: paraBirimi,
    maximumFractionDigits: 0,
  }).format(fiyat);
}

export function formatOda(oda: number | null): string {
  if (!oda) return "-";
  return `${oda}+1`;
}

export const ISITMA_TIPLERI = [
  "Kombi", "Merkezi", "Yerden Isıtma", "Soba", "Klima", "Yok"
];

export const OZELLIKLER = [
  "Balkon", "Teras", "Asansör", "Otopark", "Garaj", "Havuz", "Bahçe",
  "Güvenlik", "Kapalı Mutfak", "Açık Mutfak", "Ebeveyn Banyosu",
  "Amerikan Mutfak", "Akıllı Ev", "Isı Yalıtımı", "Ses Yalıtımı",
  "Mobilyalı", "Deniz Manzarası", "Site İçi"
];

export const ILCELER = [
  "Adalar", "Arnavutköy", "Ataşehir", "Avcılar", "Bağcılar", "Bahçelievler",
  "Bakırköy", "Başakşehir", "Bayrampaşa", "Beşiktaş", "Beykoz", "Beylikdüzü",
  "Beyoğlu", "Büyükçekmece", "Çatalca", "Çekmeköy", "Esenler", "Esenyurt",
  "Eyüpsultan", "Fatih", "Gaziosmanpaşa", "Güngören", "Kadıköy", "Kağıthane",
  "Kartal", "Küçükçekmece", "Maltepe", "Pendik", "Sancaktepe", "Sarıyer",
  "Silivri", "Sultanbeyli", "Sultangazi", "Şile", "Şişli", "Tuzla",
  "Ümraniye", "Üsküdar", "Zeytinburnu"
];

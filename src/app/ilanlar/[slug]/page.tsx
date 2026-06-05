import { notFound } from "next/navigation";
import { getIlan } from "@/lib/supabase";
import { formatFiyat } from "@/lib/format";
import FotoGalerisi from "@/components/listing/FotoGalerisi";
import LeadFormu from "@/components/listing/LeadFormu";
import MortgageHesaplayici from "@/components/listing/MortgageHesaplayici";
import PaylasButon from "@/components/listing/PaylasButon";
import IlanHarita from "@/components/map/IlanHarita";
import { MapPin, BedDouble, Bath, Maximize2, Building2, Calendar, Thermometer, Eye } from "lucide-react";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const ilan = await getIlan(slug);
  if (!ilan) return { title: "İlan Bulunamadı" };
  return {
    title: `${ilan.baslik} | Emlak Yönetim`,
    description: ilan.aciklama.slice(0, 160),
  };
}

export default async function IlanDetayPage({ params }: Props) {
  const { slug } = await params;
  const ilan = await getIlan(slug);

  if (!ilan) notFound();

  const detaylar = [
    { icon: BedDouble, label: "Oda", deger: ilan.oda_sayisi ? `${ilan.oda_sayisi}+1` : null },
    { icon: Bath, label: "Banyo", deger: ilan.banyo_sayisi?.toString() },
    { icon: Maximize2, label: "Net m²", deger: ilan.net_m2 ? `${ilan.net_m2} m²` : null },
    { icon: Maximize2, label: "Brüt m²", deger: ilan.brut_m2 ? `${ilan.brut_m2} m²` : null },
    { icon: Building2, label: "Kat", deger: ilan.kat && ilan.toplam_kat ? `${ilan.kat}/${ilan.toplam_kat}` : null },
    { icon: Calendar, label: "Bina Yaşı", deger: ilan.bina_yasi ? `${ilan.bina_yasi} yıl` : null },
    { icon: Thermometer, label: "Isıtma", deger: ilan.isitma_tipi },
    { icon: Eye, label: "Görüntülenme", deger: ilan.goruntulenme.toString() },
  ].filter((d) => d.deger);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sol: Ana içerik */}
        <div className="flex-1 min-w-0">
          <FotoGalerisi gorseller={ilan.gorseller} baslik={ilan.baslik} />

          {/* Başlık & fiyat */}
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                ilan.ilan_tipi === "satilik" ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700"
              }`}>
                {ilan.ilan_tipi === "satilik" ? "Satılık" : "Kiralık"}
              </span>
              <h1 className="text-2xl font-bold text-gray-900 mt-2">{ilan.baslik}</h1>
              <div className="flex items-center gap-1 text-gray-500 text-sm mt-1">
                <MapPin size={14} />
                <span>{ilan.adres}, {ilan.semt}, {ilan.ilce}</span>
              </div>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="text-3xl font-bold text-blue-600">{formatFiyat(ilan.fiyat, ilan.para_birimi)}</p>
              {ilan.ilan_tipi === "kiralik" && <p className="text-sm text-gray-400">/ay</p>}
            </div>
          </div>

          <PaylasButon baslik={ilan.baslik} />

          {/* Detaylar */}
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
            {detaylar.map(({ icon: Icon, label, deger }) => (
              <div key={label} className="bg-white rounded-xl border border-gray-200 p-4 text-center">
                <Icon size={20} className="mx-auto text-blue-500 mb-1" />
                <p className="text-xs text-gray-500">{label}</p>
                <p className="font-semibold text-gray-800">{deger}</p>
              </div>
            ))}
          </div>

          {/* Açıklama */}
          <div className="mt-6 bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="font-semibold text-gray-800 mb-3">İlan Açıklaması</h2>
            <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{ilan.aciklama}</p>
          </div>

          {/* Özellikler */}
          {ilan.ozellikler.length > 0 && (
            <div className="mt-4 bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="font-semibold text-gray-800 mb-3">Özellikler</h2>
              <div className="flex flex-wrap gap-2">
                {ilan.ozellikler.map((o) => (
                  <span key={o} className="bg-blue-50 text-blue-700 text-xs px-3 py-1.5 rounded-full">
                    {o}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Harita */}
          {ilan.lat && ilan.lng && (
            <div className="mt-4">
              <h2 className="font-semibold text-gray-800 mb-3">Konum</h2>
              <IlanHarita lat={ilan.lat} lng={ilan.lng} baslik={ilan.baslik} />
            </div>
          )}

          {/* Mortgage - sadece satılık */}
          {ilan.ilan_tipi === "satilik" && (
            <div className="mt-4">
              <MortgageHesaplayici fiyat={ilan.fiyat} />
            </div>
          )}
        </div>

        {/* Sağ: Lead formu */}
        <aside className="w-full lg:w-80 flex-shrink-0">
          <div className="sticky top-20">
            <LeadFormu ilanId={ilan.id} ilanBaslik={ilan.baslik} />
          </div>
        </aside>
      </div>
    </div>
  );
}

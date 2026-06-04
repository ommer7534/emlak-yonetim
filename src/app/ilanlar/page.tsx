import { Suspense } from "react";
import { getIlanlar } from "@/lib/supabase";
import IlanKarti from "@/components/listing/IlanKarti";
import IlanFiltresi from "@/components/listing/IlanFiltresi";
import type { IlanFiltre } from "@/types";

interface Props {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}

export const metadata = {
  title: "İlanlar | Emlak Yönetim",
};

async function IlanListesi({ filtre }: { filtre: IlanFiltre }) {
  const ilanlar = await getIlanlar(filtre);

  if (!ilanlar.length) {
    return (
      <div className="col-span-full py-16 text-center text-gray-400">
        <p className="text-lg">Filtreye uygun ilan bulunamadı.</p>
        <p className="text-sm mt-2">Filtreleri değiştirerek tekrar deneyin.</p>
      </div>
    );
  }

  return (
    <>
      {ilanlar.map((ilan) => (
        <IlanKarti key={ilan.id} ilan={ilan} />
      ))}
    </>
  );
}

export default async function IlanlarPage({ searchParams }: Props) {
  const sp = await searchParams;

  const filtre: IlanFiltre = {
    ilan_tipi: sp.ilan_tipi as IlanFiltre["ilan_tipi"],
    mulk_tipi: sp.mulk_tipi as IlanFiltre["mulk_tipi"],
    min_fiyat: sp.min_fiyat ? Number(sp.min_fiyat) : undefined,
    max_fiyat: sp.max_fiyat ? Number(sp.max_fiyat) : undefined,
    min_m2: sp.min_m2 ? Number(sp.min_m2) : undefined,
    max_m2: sp.max_m2 ? Number(sp.max_m2) : undefined,
    oda_sayisi: sp.oda_sayisi ? Number(sp.oda_sayisi) : undefined,
    ilce: sp.ilce,
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Emlak İlanları</h1>
      <div className="flex gap-6 items-start">
        {/* Filtre kenar çubuğu */}
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <Suspense>
            <IlanFiltresi />
          </Suspense>
        </aside>

        {/* İlan grid */}
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          <Suspense
            fallback={Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-72 rounded-xl bg-gray-200 animate-pulse" />
            ))}
          >
            <IlanListesi filtre={filtre} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

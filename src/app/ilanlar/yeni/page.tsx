"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createIlan } from "@/lib/supabase";
import { ISITMA_TIPLERI, OZELLIKLER, ILCELER } from "@/lib/format";
import type { Ilan } from "@/types";

type FormData = Omit<Ilan, "id" | "slug" | "goruntulenme" | "created_at" | "updated_at">;

const bos: FormData = {
  baslik: "", aciklama: "", fiyat: 0, para_birimi: "TRY",
  ilan_tipi: "satilik", mulk_tipi: "daire", durum: "aktif",
  oda_sayisi: null, banyo_sayisi: null, brut_m2: null, net_m2: null,
  kat: null, toplam_kat: null, bina_yasi: null, isitma_tipi: null,
  adres: "", semt: "", ilce: "Kadıköy", il: "İstanbul",
  lat: null, lng: null, gorseller: [], ozellikler: [],
};

export default function YeniIlanPage() {
  const [form, setForm] = useState<FormData>(bos);
  const [gorselUrl, setGorselUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const set = (key: keyof FormData, value: unknown) =>
    setForm((f) => ({ ...f, [key]: value }));

  const toggleOzellik = (o: string) =>
    set("ozellikler", form.ozellikler.includes(o)
      ? form.ozellikler.filter((x) => x !== o)
      : [...form.ozellikler, o]);

  const gorselEkle = () => {
    if (!gorselUrl.trim()) return;
    set("gorseller", [...form.gorseller, gorselUrl.trim()]);
    setGorselUrl("");
  };

  const gonder = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const ilan = await createIlan(form);
      router.push(`/ilanlar/${ilan.slug}`);
    } catch {
      alert("Bir hata oluştu. Supabase bağlantınızı kontrol edin.");
    } finally {
      setLoading(false);
    }
  };

  const input = "w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500";
  const label = "block text-sm font-medium text-gray-700 mb-1";

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Yeni İlan Ver</h1>

      <form onSubmit={gonder} className="space-y-6">
        {/* Temel bilgiler */}
        <section className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <h2 className="font-semibold text-gray-800">Temel Bilgiler</h2>

          <div>
            <label className={label}>Başlık *</label>
            <input required type="text" className={input} value={form.baslik}
              onChange={(e) => set("baslik", e.target.value)} placeholder="Örn: Kadıköy'de Satılık 3+1 Daire" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={label}>İlan Tipi</label>
              <select className={input} value={form.ilan_tipi} onChange={(e) => set("ilan_tipi", e.target.value)}>
                <option value="satilik">Satılık</option>
                <option value="kiralik">Kiralık</option>
              </select>
            </div>
            <div>
              <label className={label}>Mülk Tipi</label>
              <select className={input} value={form.mulk_tipi} onChange={(e) => set("mulk_tipi", e.target.value)}>
                <option value="daire">Daire</option>
                <option value="villa">Villa</option>
                <option value="arsa">Arsa</option>
                <option value="isyeri">İşyeri</option>
                <option value="dukkan">Dükkan</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={label}>Fiyat *</label>
              <input required type="number" min={0} className={input} value={form.fiyat || ""}
                onChange={(e) => set("fiyat", Number(e.target.value))} />
            </div>
            <div>
              <label className={label}>Para Birimi</label>
              <select className={input} value={form.para_birimi} onChange={(e) => set("para_birimi", e.target.value)}>
                <option value="TRY">₺ TRY</option>
                <option value="USD">$ USD</option>
                <option value="EUR">€ EUR</option>
              </select>
            </div>
          </div>

          <div>
            <label className={label}>Açıklama *</label>
            <textarea required rows={4} className={`${input} resize-none`} value={form.aciklama}
              onChange={(e) => set("aciklama", e.target.value)} />
          </div>
        </section>

        {/* Özellikler */}
        <section className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <h2 className="font-semibold text-gray-800">Fiziksel Özellikler</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {[
              { key: "oda_sayisi", label: "Oda Sayısı" },
              { key: "banyo_sayisi", label: "Banyo Sayısı" },
              { key: "net_m2", label: "Net m²" },
              { key: "brut_m2", label: "Brüt m²" },
              { key: "kat", label: "Bulunduğu Kat" },
              { key: "toplam_kat", label: "Toplam Kat" },
              { key: "bina_yasi", label: "Bina Yaşı" },
            ].map(({ key, label: l }) => (
              <div key={key}>
                <label className={label}>{l}</label>
                <input type="number" min={0} className={input}
                  value={(form[key as keyof FormData] as number) || ""}
                  onChange={(e) => set(key as keyof FormData, e.target.value ? Number(e.target.value) : null)} />
              </div>
            ))}
            <div>
              <label className={label}>Isıtma</label>
              <select className={input} value={form.isitma_tipi || ""}
                onChange={(e) => set("isitma_tipi", e.target.value || null)}>
                <option value="">Seçiniz</option>
                {ISITMA_TIPLERI.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className={label}>İç Özellikler</label>
            <div className="flex flex-wrap gap-2 mt-1">
              {OZELLIKLER.map((o) => (
                <button key={o} type="button" onClick={() => toggleOzellik(o)}
                  className={`px-3 py-1.5 text-xs rounded-full border transition-colors ${
                    form.ozellikler.includes(o) ? "bg-blue-600 text-white border-blue-600" : "border-gray-300 hover:border-blue-400"
                  }`}>
                  {o}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Konum */}
        <section className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <h2 className="font-semibold text-gray-800">Konum</h2>
          <div>
            <label className={label}>Adres *</label>
            <input required type="text" className={input} value={form.adres}
              onChange={(e) => set("adres", e.target.value)} placeholder="Cadde/sokak/no" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={label}>Semt *</label>
              <input required type="text" className={input} value={form.semt}
                onChange={(e) => set("semt", e.target.value)} />
            </div>
            <div>
              <label className={label}>İlçe *</label>
              <select required className={input} value={form.ilce} onChange={(e) => set("ilce", e.target.value)}>
                {ILCELER.map((i) => <option key={i} value={i}>{i}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={label}>Enlem (lat)</label>
              <input type="number" step="any" className={input} value={form.lat || ""}
                onChange={(e) => set("lat", e.target.value ? Number(e.target.value) : null)} placeholder="41.0082" />
            </div>
            <div>
              <label className={label}>Boylam (lng)</label>
              <input type="number" step="any" className={input} value={form.lng || ""}
                onChange={(e) => set("lng", e.target.value ? Number(e.target.value) : null)} placeholder="28.9784" />
            </div>
          </div>
        </section>

        {/* Görseller */}
        <section className="bg-white rounded-xl border border-gray-200 p-6 space-y-3">
          <h2 className="font-semibold text-gray-800">Görseller (URL)</h2>
          <div className="flex gap-2">
            <input type="url" className={input} value={gorselUrl}
              onChange={(e) => setGorselUrl(e.target.value)}
              placeholder="https://..." onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), gorselEkle())} />
            <button type="button" onClick={gorselEkle}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium">
              Ekle
            </button>
          </div>
          {form.gorseller.length > 0 && (
            <ul className="space-y-1">
              {form.gorseller.map((g, i) => (
                <li key={i} className="flex items-center justify-between text-xs bg-gray-50 rounded-lg px-3 py-2">
                  <span className="truncate text-gray-600">{g}</span>
                  <button type="button" onClick={() => set("gorseller", form.gorseller.filter((_, j) => j !== i))}
                    className="text-red-500 hover:text-red-700 ml-2">✕</button>
                </li>
              ))}
            </ul>
          )}
        </section>

        <button type="submit" disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3.5 rounded-xl transition-colors">
          {loading ? "Yayınlanıyor..." : "İlanı Yayınla"}
        </button>
      </form>
    </div>
  );
}

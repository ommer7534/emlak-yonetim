"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { createIlan, supabase } from "@/lib/supabase";
import { ISITMA_TIPLERI, OZELLIKLER, ILCELER } from "@/lib/format";
import { gorselUrl } from "@/lib/storage";
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

type YuklemeState = { dosya: string; durum: "yukleniyor" | "tamam" | "hata"; hata?: string };

export default function YeniIlanPage() {
  const [form, setForm] = useState<FormData>(bos);
  const [loading, setLoading] = useState(false);
  const [yuklenenler, setYuklenenler] = useState<YuklemeState[]>([]);
  const [surukle, setSurukle] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const set = (key: keyof FormData, value: unknown) =>
    setForm((f) => ({ ...f, [key]: value }));

  const toggleOzellik = (o: string) =>
    set("ozellikler", form.ozellikler.includes(o)
      ? form.ozellikler.filter((x) => x !== o)
      : [...form.ozellikler, o]);

  async function dosyalariYukle(dosyalar: FileList | File[]) {
    const liste = Array.from(dosyalar).filter((f) => f.type.startsWith("image/"));
    if (!liste.length) return;

    for (const dosya of liste) {
      const yol = `listings/${Date.now()}-${dosya.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
      setYuklenenler((prev) => [...prev, { dosya: yol, durum: "yukleniyor" }]);

      const { error } = await supabase.storage.from("images").upload(yol, dosya, {
        cacheControl: "3600",
        upsert: false,
      });

      if (error) {
        setYuklenenler((prev) =>
          prev.map((y) => y.dosya === yol ? { ...y, durum: "hata", hata: error.message } : y)
        );
      } else {
        setYuklenenler((prev) =>
          prev.map((y) => y.dosya === yol ? { ...y, durum: "tamam" } : y)
        );
        setForm((f) => ({ ...f, gorseller: [...f.gorseller, yol] }));
      }
    }
  }

  function gorselKaldir(yol: string) {
    setForm((f) => ({ ...f, gorseller: f.gorseller.filter((g) => g !== yol) }));
    setYuklenenler((prev) => prev.filter((y) => y.dosya !== yol));
  }

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
        <section className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <h2 className="font-semibold text-gray-800">Fotoğraflar</h2>

          {/* Yükleme butonu */}
          <div
            onDragOver={(e) => { e.preventDefault(); setSurukle(true); }}
            onDragLeave={() => setSurukle(false)}
            onDrop={(e) => { e.preventDefault(); setSurukle(false); dosyalariYukle(e.dataTransfer.files); }}
            className={`rounded-xl border-2 border-dashed p-4 transition-colors ${
              surukle ? "border-blue-400 bg-blue-50" : "border-gray-200"
            }`}
          >
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-medium py-3 px-4 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Fotoğraf Ekle
            </button>
            <p className="text-center text-xs text-gray-400 mt-2">
              JPG, PNG, WebP · Birden fazla seçilebilir · veya buraya sürükle
            </p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => e.target.files && dosyalariYukle(e.target.files)}
          />

          {/* Önizleme grid */}
          {form.gorseller.length > 0 && (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {form.gorseller.map((yol, i) => {
                const yukl = yuklenenler.find((y) => y.dosya === yol);
                return (
                  <div key={yol} className="relative group aspect-square rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                    <Image
                      src={gorselUrl(yol)}
                      alt={`Fotoğraf ${i + 1}`}
                      fill
                      className="object-cover"
                      sizes="120px"
                    />
                    {/* Yükleniyor spinner */}
                    {yukl?.durum === "yukleniyor" && (
                      <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
                        <svg className="w-6 h-6 text-blue-500 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                        </svg>
                      </div>
                    )}
                    {/* Hata */}
                    {yukl?.durum === "hata" && (
                      <div className="absolute inset-0 bg-red-500/80 flex items-center justify-center">
                        <span className="text-white text-xs text-center px-1">{yukl.hata ?? "Hata"}</span>
                      </div>
                    )}
                    {/* İlk fotoğraf rozeti */}
                    {i === 0 && (
                      <span className="absolute bottom-1 left-1 bg-blue-600 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                        Kapak
                      </span>
                    )}
                    {/* Sil butonu */}
                    <button
                      type="button"
                      onClick={() => gorselKaldir(yol)}
                      className="absolute top-1 right-1 w-6 h-6 bg-black/60 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs"
                      aria-label="Kaldır"
                    >
                      ✕
                    </button>
                  </div>
                );
              })}
            </div>
          )}
          {form.gorseller.length > 0 && (
            <p className="text-xs text-gray-400">{form.gorseller.length} fotoğraf · İlk fotoğraf kapak görseli olur</p>
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

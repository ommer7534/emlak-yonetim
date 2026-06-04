"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { ILCELER } from "@/lib/format";

export default function IlanFiltresi() {
  const router = useRouter();
  const params = useSearchParams();

  const guncelle = useCallback(
    (key: string, value: string) => {
      const next = new URLSearchParams(params.toString());
      if (value) next.set(key, value);
      else next.delete(key);
      next.delete("sayfa");
      router.push(`/ilanlar?${next.toString()}`);
    },
    [params, router]
  );

  const temizle = () => router.push("/ilanlar");

  const input =
    "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500";

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-gray-800">Filtreler</h2>
        <button onClick={temizle} className="text-xs text-blue-600 hover:underline">Temizle</button>
      </div>

      <div className="space-y-4">
        {/* İlan tipi */}
        <div>
          <label className="text-xs font-medium text-gray-600 mb-1 block">İlan Tipi</label>
          <div className="flex gap-2">
            {[["", "Tümü"], ["satilik", "Satılık"], ["kiralik", "Kiralık"]].map(([val, label]) => (
              <button
                key={val}
                onClick={() => guncelle("ilan_tipi", val)}
                className={`flex-1 py-1.5 text-xs rounded-lg border transition-colors ${
                  (params.get("ilan_tipi") || "") === val
                    ? "bg-blue-600 text-white border-blue-600"
                    : "border-gray-300 hover:border-blue-400"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Mülk tipi */}
        <div>
          <label className="text-xs font-medium text-gray-600 mb-1 block">Mülk Tipi</label>
          <select
            className={input}
            value={params.get("mulk_tipi") || ""}
            onChange={(e) => guncelle("mulk_tipi", e.target.value)}
          >
            <option value="">Tümü</option>
            <option value="daire">Daire</option>
            <option value="villa">Villa</option>
            <option value="arsa">Arsa</option>
            <option value="isyeri">İşyeri</option>
            <option value="dukkan">Dükkan</option>
          </select>
        </div>

        {/* Fiyat aralığı */}
        <div>
          <label className="text-xs font-medium text-gray-600 mb-1 block">Fiyat Aralığı (₺)</label>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Min"
              className={input}
              defaultValue={params.get("min_fiyat") || ""}
              onBlur={(e) => guncelle("min_fiyat", e.target.value)}
            />
            <input
              type="number"
              placeholder="Max"
              className={input}
              defaultValue={params.get("max_fiyat") || ""}
              onBlur={(e) => guncelle("max_fiyat", e.target.value)}
            />
          </div>
        </div>

        {/* m² aralığı */}
        <div>
          <label className="text-xs font-medium text-gray-600 mb-1 block">Net m²</label>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Min"
              className={input}
              defaultValue={params.get("min_m2") || ""}
              onBlur={(e) => guncelle("min_m2", e.target.value)}
            />
            <input
              type="number"
              placeholder="Max"
              className={input}
              defaultValue={params.get("max_m2") || ""}
              onBlur={(e) => guncelle("max_m2", e.target.value)}
            />
          </div>
        </div>

        {/* Oda sayısı */}
        <div>
          <label className="text-xs font-medium text-gray-600 mb-1 block">Oda Sayısı</label>
          <div className="flex gap-1 flex-wrap">
            {["", "1", "2", "3", "4"].map((val) => (
              <button
                key={val}
                onClick={() => guncelle("oda_sayisi", val)}
                className={`px-3 py-1.5 text-xs rounded-lg border transition-colors ${
                  (params.get("oda_sayisi") || "") === val
                    ? "bg-blue-600 text-white border-blue-600"
                    : "border-gray-300 hover:border-blue-400"
                }`}
              >
                {val ? `${val}+1` : "Tümü"}
              </button>
            ))}
          </div>
        </div>

        {/* İlçe */}
        <div>
          <label className="text-xs font-medium text-gray-600 mb-1 block">İlçe</label>
          <select
            className={input}
            value={params.get("ilce") || ""}
            onChange={(e) => guncelle("ilce", e.target.value)}
          >
            <option value="">Tümü</option>
            {ILCELER.map((ilce) => (
              <option key={ilce} value={ilce}>{ilce}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

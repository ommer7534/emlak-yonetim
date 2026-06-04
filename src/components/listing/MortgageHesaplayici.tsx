"use client";

import { useState, useMemo } from "react";
import { Calculator } from "lucide-react";
import { formatFiyat } from "@/lib/format";

interface Props {
  fiyat: number;
}

export default function MortgageHesaplayici({ fiyat }: Props) {
  const [pesin, setPesin] = useState(Math.round(fiyat * 0.2));
  const [faiz, setFaiz] = useState(3.5);
  const [vade, setVade] = useState(120);
  const [acik, setAcik] = useState(false);

  const sonuc = useMemo(() => {
    const anapara = fiyat - pesin;
    if (anapara <= 0) return { aylikTaksit: 0, toplamOdeme: 0, toplamFaiz: 0 };
    const aylikFaiz = faiz / 100 / 12;
    const aylikTaksit =
      (anapara * aylikFaiz * Math.pow(1 + aylikFaiz, vade)) /
      (Math.pow(1 + aylikFaiz, vade) - 1);
    const toplamOdeme = aylikTaksit * vade;
    return {
      aylikTaksit,
      toplamOdeme,
      toplamFaiz: toplamOdeme - anapara,
    };
  }, [fiyat, pesin, faiz, vade]);

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <button
        onClick={() => setAcik(!acik)}
        className="w-full flex items-center justify-between p-5 text-left"
      >
        <div className="flex items-center gap-2 font-semibold text-gray-800">
          <Calculator size={16} /> Konut Kredisi Hesaplayıcı
        </div>
        <span className="text-gray-400 text-sm">{acik ? "▲" : "▼"}</span>
      </button>

      {acik && (
        <div className="px-5 pb-5 border-t border-gray-100 pt-4 space-y-4">
          {/* Peşinat */}
          <div>
            <div className="flex justify-between text-xs text-gray-600 mb-1">
              <span>Peşinat</span>
              <span className="font-medium">{formatFiyat(pesin)}</span>
            </div>
            <input
              type="range"
              min={fiyat * 0.1}
              max={fiyat * 0.9}
              step={10000}
              value={pesin}
              onChange={(e) => setPesin(Number(e.target.value))}
              className="w-full accent-blue-600"
            />
            <div className="flex justify-between text-[10px] text-gray-400">
              <span>%10</span><span>%90</span>
            </div>
          </div>

          {/* Faiz oranı */}
          <div>
            <div className="flex justify-between text-xs text-gray-600 mb-1">
              <span>Aylık Faiz Oranı</span>
              <span className="font-medium">%{faiz.toFixed(2)}</span>
            </div>
            <input
              type="range" min={0.5} max={8} step={0.05}
              value={faiz}
              onChange={(e) => setFaiz(Number(e.target.value))}
              className="w-full accent-blue-600"
            />
          </div>

          {/* Vade */}
          <div>
            <div className="flex justify-between text-xs text-gray-600 mb-1">
              <span>Vade</span>
              <span className="font-medium">{vade} ay ({vade / 12} yıl)</span>
            </div>
            <input
              type="range" min={12} max={240} step={12}
              value={vade}
              onChange={(e) => setVade(Number(e.target.value))}
              className="w-full accent-blue-600"
            />
          </div>

          {/* Sonuçlar */}
          <div className="bg-blue-50 rounded-lg p-3 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Aylık Taksit</span>
              <span className="font-bold text-blue-700">{formatFiyat(sonuc.aylikTaksit)}</span>
            </div>
            <div className="flex justify-between text-xs text-gray-500">
              <span>Toplam Ödeme</span>
              <span>{formatFiyat(sonuc.toplamOdeme)}</span>
            </div>
            <div className="flex justify-between text-xs text-gray-500">
              <span>Toplam Faiz</span>
              <span>{formatFiyat(sonuc.toplamFaiz)}</span>
            </div>
          </div>

          <p className="text-[10px] text-gray-400">* Hesaplama bilgi amaçlıdır, banka koşulları farklılık gösterebilir.</p>
        </div>
      )}
    </div>
  );
}

"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { MapPin, Maximize2, BedDouble, Bath, Eye } from "lucide-react";
import { formatFiyat } from "@/lib/format";
import type { Ilan } from "@/types";

interface Props {
  ilan: Ilan;
}

export default function IlanKarti({ ilan }: Props) {
  const [imgIndex, setImgIndex] = useState(0);
  const gorsel = ilan.gorseller[imgIndex] || "/placeholder.jpg";

  return (
    <Link href={`/ilanlar/${ilan.slug}`} className="group block rounded-xl overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow bg-white">
      {/* Görsel */}
      <div className="relative h-52 bg-gray-100 overflow-hidden">
        <Image
          src={gorsel}
          alt={ilan.baslik}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {/* Tip badge */}
        <span className={`absolute top-3 left-3 px-2 py-1 text-xs font-semibold rounded-full ${
          ilan.ilan_tipi === "satilik" ? "bg-blue-600 text-white" : "bg-green-600 text-white"
        }`}>
          {ilan.ilan_tipi === "satilik" ? "Satılık" : "Kiralık"}
        </span>
        {/* Görsel sayısı */}
        {ilan.gorseller.length > 1 && (
          <span className="absolute top-3 right-3 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
            {ilan.gorseller.length} foto
          </span>
        )}
        {/* Thumbnail dots */}
        {ilan.gorseller.length > 1 && (
          <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
            {ilan.gorseller.slice(0, 5).map((_, i) => (
              <button
                key={i}
                onClick={(e) => { e.preventDefault(); setImgIndex(i); }}
                className={`w-1.5 h-1.5 rounded-full transition-colors ${i === imgIndex ? "bg-white" : "bg-white/50"}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* İçerik */}
      <div className="p-4">
        <p className="text-xl font-bold text-gray-900">{formatFiyat(ilan.fiyat, ilan.para_birimi)}</p>
        <h3 className="mt-1 text-sm font-medium text-gray-800 line-clamp-2">{ilan.baslik}</h3>

        <div className="mt-2 flex items-center gap-1 text-xs text-gray-500">
          <MapPin size={12} />
          <span>{ilan.semt}, {ilan.ilce}</span>
        </div>

        {/* Özellikler satırı */}
        <div className="mt-3 flex items-center gap-3 text-xs text-gray-600 border-t pt-3">
          {ilan.oda_sayisi && (
            <span className="flex items-center gap-1">
              <BedDouble size={13} /> {ilan.oda_sayisi}+1
            </span>
          )}
          {ilan.banyo_sayisi && (
            <span className="flex items-center gap-1">
              <Bath size={13} /> {ilan.banyo_sayisi}
            </span>
          )}
          {ilan.net_m2 && (
            <span className="flex items-center gap-1">
              <Maximize2 size={13} /> {ilan.net_m2} m²
            </span>
          )}
          <span className="ml-auto flex items-center gap-1 text-gray-400">
            <Eye size={12} /> {ilan.goruntulenme}
          </span>
        </div>

        {/* WhatsApp paylaş */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            const url = `${window.location.origin}/ilanlar/${ilan.slug}`;
            const metin = `🏠 ${ilan.baslik}\n💰 ${formatFiyat(ilan.fiyat, ilan.para_birimi)}\n🔗 ${url}`;
            window.open(`https://wa.me/?text=${encodeURIComponent(metin)}`, "_blank");
          }}
          className="mt-3 w-full flex items-center justify-center gap-2 py-2 rounded-lg border border-green-200 text-green-700 text-xs font-medium hover:bg-green-50 transition-colors"
        >
          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          WhatsApp'ta Paylaş
        </button>
      </div>
    </Link>
  );
}

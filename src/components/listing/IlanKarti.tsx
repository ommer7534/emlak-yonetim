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
      </div>
    </Link>
  );
}

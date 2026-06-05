"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";
import { gorselUrl, PLACEHOLDER } from "@/lib/storage";

interface Props {
  gorseller: string[];
  baslik: string;
}

function SafeImage({
  src, alt, ...props
}: React.ComponentProps<typeof Image> & { src: string }) {
  const [hata, setHata] = useState(false);
  return (
    <Image
      {...props}
      src={hata ? PLACEHOLDER : gorselUrl(src)}
      alt={alt}
      onError={() => setHata(true)}
    />
  );
}

export default function FotoGalerisi({ gorseller, baslik }: Props) {
  const [aktif, setAktif] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const thumbnailRef = useRef<HTMLDivElement>(null);

  const onceki = useCallback(() => {
    setAktif((i) => (i - 1 + gorseller.length) % gorseller.length);
  }, [gorseller.length]);

  const sonraki = useCallback(() => {
    setAktif((i) => (i + 1) % gorseller.length);
  }, [gorseller.length]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") onceki();
      if (e.key === "ArrowRight") sonraki();
      if (e.key === "Escape") setLightbox(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onceki, sonraki]);

  useEffect(() => {
    const container = thumbnailRef.current;
    if (!container) return;
    const thumb = container.children[aktif] as HTMLElement;
    if (thumb) thumb.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "nearest" });
  }, [aktif]);

  const touchStartX = useRef<number | null>(null);
  const handleTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.touches[0].clientX; };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) diff > 0 ? sonraki() : onceki();
    touchStartX.current = null;
  };

  if (!gorseller.length) {
    return (
      <div className="relative h-72 sm:h-[420px] rounded-xl overflow-hidden bg-gray-100 mb-6">
        <Image src={PLACEHOLDER} alt="Görsel yok" fill className="object-contain p-8" sizes="100vw" />
      </div>
    );
  }

  return (
    <>
      <div className="mb-6">
        {/* Ana görsel */}
        <div
          className="relative h-72 sm:h-[420px] rounded-xl overflow-hidden bg-gray-100 group cursor-pointer select-none"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onClick={() => setLightbox(true)}
        >
          <SafeImage
            key={aktif}
            src={gorseller[aktif]}
            alt={`${baslik} - ${aktif + 1}`}
            fill
            className="object-cover transition-opacity duration-200"
            priority={aktif === 0}
            sizes="(max-width: 1024px) 100vw, 66vw"
          />

          <div className="absolute top-3 left-3 bg-black/50 text-white text-xs px-2.5 py-1 rounded-full">
            {aktif + 1} / {gorseller.length}
          </div>

          <div className="absolute top-3 right-3 bg-black/50 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
            <ZoomIn size={14} />
          </div>

          {gorseller.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); onceki(); }}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/85 hover:bg-white flex items-center justify-center shadow-md transition-all sm:opacity-0 sm:group-hover:opacity-100 opacity-100"
                aria-label="Önceki fotoğraf"
              >
                <ChevronLeft size={20} className="text-gray-800" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); sonraki(); }}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/85 hover:bg-white flex items-center justify-center shadow-md transition-all sm:opacity-0 sm:group-hover:opacity-100 opacity-100"
                aria-label="Sonraki fotoğraf"
              >
                <ChevronRight size={20} className="text-gray-800" />
              </button>
            </>
          )}
        </div>

        {/* Thumbnail şeridi */}
        {gorseller.length > 1 && (
          <div
            ref={thumbnailRef}
            className="mt-2 flex gap-2 overflow-x-auto pb-1"
            style={{ scrollbarWidth: "none" }}
          >
            {gorseller.map((g, i) => (
              <button
                key={i}
                onClick={() => setAktif(i)}
                className={`relative flex-shrink-0 w-20 h-14 rounded-lg overflow-hidden border-2 transition-all duration-150 ${
                  i === aktif ? "border-blue-500 opacity-100" : "border-transparent opacity-55 hover:opacity-90"
                }`}
                aria-label={`Fotoğraf ${i + 1}`}
              >
                <SafeImage src={g} alt={`${baslik} - ${i + 1}`} fill className="object-cover" sizes="80px" loading="lazy" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-[200] bg-black/95 flex items-center justify-center"
          onClick={() => setLightbox(false)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <button
            onClick={() => setLightbox(false)}
            className="absolute top-4 right-4 text-white/70 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors z-10"
            aria-label="Kapat"
          >
            <X size={24} />
          </button>

          <div className="absolute top-5 left-1/2 -translate-x-1/2 text-white/70 text-sm">
            {aktif + 1} / {gorseller.length}
          </div>

          {gorseller.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); onceki(); }}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-white/70 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
                aria-label="Önceki"
              >
                <ChevronLeft size={32} />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); sonraki(); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
                aria-label="Sonraki"
              >
                <ChevronRight size={32} />
              </button>
            </>
          )}

          <div
            className="relative w-full h-full max-w-5xl max-h-[85vh] mx-14"
            onClick={(e) => e.stopPropagation()}
          >
            <SafeImage
              key={`lb-${aktif}`}
              src={gorseller[aktif]}
              alt={`${baslik} - ${aktif + 1}`}
              fill
              className="object-contain"
              sizes="100vw"
              priority
            />
          </div>

          {gorseller.length > 1 && (
            <div
              className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 max-w-[90vw] overflow-x-auto pb-1"
              style={{ scrollbarWidth: "none" }}
            >
              {gorseller.map((g, i) => (
                <button
                  key={i}
                  onClick={(e) => { e.stopPropagation(); setAktif(i); }}
                  className={`relative flex-shrink-0 w-14 h-10 rounded overflow-hidden border-2 transition-all ${
                    i === aktif ? "border-white opacity-100" : "border-transparent opacity-40 hover:opacity-70"
                  }`}
                >
                  <SafeImage src={g} alt="" fill className="object-cover" sizes="56px" loading="lazy" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}

"use client";

import { useState } from "react";
import { Share2, Check, Copy } from "lucide-react";

interface Props {
  baslik: string;
}

export default function PaylasButon({ baslik }: Props) {
  const [kopyalandi, setKopyalandi] = useState(false);
  const [acik, setAcik] = useState(false);

  const url = typeof window !== "undefined" ? window.location.href : "";

  const kopyala = async () => {
    await navigator.clipboard.writeText(url);
    setKopyalandi(true);
    setTimeout(() => setKopyalandi(false), 2000);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setAcik(!acik)}
        className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 text-sm text-gray-600 transition-colors"
      >
        <Share2 size={14} /> Paylaş
      </button>

      {acik && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setAcik(false)} />
          <div className="absolute right-0 top-full mt-2 bg-white rounded-xl border border-gray-200 shadow-lg z-20 w-52 p-2">
            <button
              onClick={kopyala}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 text-sm text-gray-700"
            >
              {kopyalandi ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
              {kopyalandi ? "Kopyalandı!" : "Linki Kopyala"}
            </button>
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 text-sm text-gray-700"
            >
              <span className="text-blue-600 text-sm font-bold">f</span> Facebook
            </a>
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(baslik)}&url=${encodeURIComponent(url)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 text-sm text-gray-700"
            >
              <span className="text-sky-500 text-sm font-bold">𝕏</span> Twitter / X
            </a>
          </div>
        </>
      )}
    </div>
  );
}

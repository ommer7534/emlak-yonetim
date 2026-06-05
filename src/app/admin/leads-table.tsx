"use client";

import { useRouter, usePathname } from "next/navigation";
import { useCallback, useState } from "react";

type IlanRef = { baslik: string; slug: string };

type Lead = {
  id: string;
  created_at: string;
  ad_soyad: string;
  telefon: string;
  email: string | null;
  mesaj: string | null;
  ilan_id: string | null;
  ilanlar: IlanRef | IlanRef[] | null;
};

export default function AdminLeadsTable({
  leadler,
  total,
  page,
  pageSize,
  q,
}: {
  leadler: Lead[];
  total: number;
  page: number;
  pageSize: number;
  q: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [expanded, setExpanded] = useState<string | null>(null);
  const totalPages = Math.ceil(total / pageSize);

  const navigate = useCallback(
    (params: { q?: string; page?: string }) => {
      const sp = new URLSearchParams();
      if (params.q) sp.set("q", params.q);
      if (params.page && params.page !== "1") sp.set("page", params.page);
      router.push(`${pathname}?${sp.toString()}`);
    },
    [router, pathname]
  );

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("tr-TR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function exportCSV() {
    if (!leadler.length) return;
    const bom = "﻿";
    const header = "Tarih,Ad Soyad,Telefon,E-posta,İlan,Mesaj";
    const rows = leadler.map((l) =>
      [
        formatDate(l.created_at),
        l.ad_soyad,
        l.telefon,
        l.email ?? "",
        (Array.isArray(l.ilanlar) ? l.ilanlar[0]?.baslik : l.ilanlar?.baslik) ?? "",
        (l.mesaj ?? "").replace(/\n/g, " "),
      ]
        .map((v) => `"${String(v).replace(/"/g, '""')}"`)
        .join(",")
    );
    const csv = bom + [header, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `talepler_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex gap-3 items-center justify-between">
        <div className="relative flex-1 max-w-xs">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            defaultValue={q}
            placeholder="Ad, telefon, e-posta ara..."
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                navigate({ q: (e.target as HTMLInputElement).value, page: "1" });
              }
            }}
            className="w-full bg-gray-900 border border-gray-700 rounded-lg pl-9 pr-3.5 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>
        <button
          onClick={exportCSV}
          disabled={!leadler.length}
          className="flex items-center gap-2 text-sm text-gray-400 hover:text-white border border-gray-700 hover:border-gray-500 rounded-lg px-3.5 py-2 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          CSV İndir
        </button>
      </div>

      {/* Table */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        {leadler.length === 0 ? (
          <div className="py-16 text-center">
            <svg className="w-10 h-10 text-gray-700 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <p className="text-gray-500 text-sm">
              {q ? "Sonuç bulunamadı" : "Henüz talep yok"}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-800">
                  {["#", "Tarih", "Ad Soyad", "Telefon", "E-posta", "İlan", "Mesaj"].map((h) => (
                    <th key={h} className="text-left text-gray-500 font-medium px-4 py-3 text-xs uppercase tracking-wide whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {leadler.map((lead, idx) => (
                  <>
                    <tr
                      key={lead.id}
                      className="border-b border-gray-800/50 hover:bg-gray-800/40 transition-colors cursor-pointer"
                      onClick={() => setExpanded(expanded === lead.id ? null : lead.id)}
                    >
                      <td className="px-4 py-3 text-gray-600 text-xs">
                        {(page - 1) * pageSize + idx + 1}
                      </td>
                      <td className="px-4 py-3 text-gray-400 whitespace-nowrap text-xs">
                        {formatDate(lead.created_at)}
                      </td>
                      <td className="px-4 py-3 text-white font-medium">
                        {lead.ad_soyad}
                      </td>
                      <td className="px-4 py-3">
                        <a
                          href={`tel:${lead.telefon}`}
                          className="text-blue-400 hover:text-blue-300 transition-colors"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {lead.telefon}
                        </a>
                      </td>
                      <td className="px-4 py-3">
                        {lead.email ? (
                          <a
                            href={`mailto:${lead.email}`}
                            className="text-blue-400 hover:text-blue-300 transition-colors"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {lead.email}
                          </a>
                        ) : (
                          <span className="text-gray-600">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 max-w-xs">
                        {lead.ilanlar ? (
                          (() => {
                            const ilan = Array.isArray(lead.ilanlar) ? lead.ilanlar[0] : lead.ilanlar;
                            return ilan ? (
                              <a
                                href={`/ilanlar/${ilan.slug}`}
                                target="_blank"
                                className="text-gray-300 hover:text-white truncate block transition-colors"
                                onClick={(e) => e.stopPropagation()}
                                title={ilan.baslik}
                              >
                                {ilan.baslik}
                              </a>
                            ) : <span className="text-gray-600">—</span>;
                          })()
                        ) : (
                          <span className="text-gray-600">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-gray-400 max-w-xs">
                        {lead.mesaj ? (
                          <span className="truncate block" title={lead.mesaj}>
                            {lead.mesaj.slice(0, 60)}{lead.mesaj.length > 60 ? "…" : ""}
                          </span>
                        ) : (
                          <span className="text-gray-600">—</span>
                        )}
                      </td>
                    </tr>
                    {expanded === lead.id && lead.mesaj && (
                      <tr key={`${lead.id}-expanded`} className="border-b border-gray-800/50 bg-gray-800/20">
                        <td />
                        <td colSpan={6} className="px-4 py-3">
                          <p className="text-gray-300 text-sm whitespace-pre-wrap">{lead.mesaj}</p>
                        </td>
                      </tr>
                    )}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">
            {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, total)} / {total} kayıt
          </span>
          <div className="flex gap-1">
            <button
              disabled={page <= 1}
              onClick={() => navigate({ q, page: String(page - 1) })}
              className="px-3 py-1.5 rounded-lg border border-gray-700 text-gray-400 hover:text-white hover:border-gray-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              ← Önceki
            </button>
            <button
              disabled={page >= totalPages}
              onClick={() => navigate({ q, page: String(page + 1) })}
              className="px-3 py-1.5 rounded-lg border border-gray-700 text-gray-400 hover:text-white hover:border-gray-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Sonraki →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

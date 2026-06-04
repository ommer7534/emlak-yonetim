"use client";

import { useState } from "react";
import { submitLead } from "@/lib/supabase";
import { Phone, Mail, User, MessageSquare, CheckCircle } from "lucide-react";

interface Props {
  ilanId: string;
  ilanBaslik: string;
}

export default function LeadFormu({ ilanId, ilanBaslik }: Props) {
  const [form, setForm] = useState({ ad_soyad: "", telefon: "", email: "", mesaj: "" });
  const [gonderildi, setGonderildi] = useState(false);
  const [loading, setLoading] = useState(false);

  const gonder = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await submitLead({ ...form, ilan_id: ilanId });
      setGonderildi(true);
    } catch {
      alert("Bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  };

  if (gonderildi) {
    return (
      <div className="text-center py-8">
        <CheckCircle className="mx-auto text-green-500 mb-3" size={48} />
        <h3 className="font-semibold text-gray-800">Talebiniz Alındı!</h3>
        <p className="text-sm text-gray-500 mt-1">En kısa sürede sizinle iletişime geçeceğiz.</p>
      </div>
    );
  }

  const inputClass = "w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm pl-9 focus:outline-none focus:ring-2 focus:ring-blue-500";

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <h3 className="font-semibold text-gray-800 mb-1">İletişime Geçin</h3>
      <p className="text-xs text-gray-500 mb-4 line-clamp-1">{ilanBaslik}</p>

      <form onSubmit={gonder} className="space-y-3">
        <div className="relative">
          <User size={14} className="absolute left-3 top-3 text-gray-400" />
          <input
            required
            type="text"
            placeholder="Ad Soyad *"
            className={inputClass}
            value={form.ad_soyad}
            onChange={(e) => setForm({ ...form, ad_soyad: e.target.value })}
          />
        </div>

        <div className="relative">
          <Phone size={14} className="absolute left-3 top-3 text-gray-400" />
          <input
            required
            type="tel"
            placeholder="Telefon *"
            className={inputClass}
            value={form.telefon}
            onChange={(e) => setForm({ ...form, telefon: e.target.value })}
          />
        </div>

        <div className="relative">
          <Mail size={14} className="absolute left-3 top-3 text-gray-400" />
          <input
            type="email"
            placeholder="E-posta"
            className={inputClass}
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>

        <div className="relative">
          <MessageSquare size={14} className="absolute left-3 top-3 text-gray-400" />
          <textarea
            placeholder="Mesajınız"
            rows={3}
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm pl-9 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            value={form.mesaj}
            onChange={(e) => setForm({ ...form, mesaj: e.target.value })}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2.5 rounded-lg text-sm transition-colors"
        >
          {loading ? "Gönderiliyor..." : "Bilgi Al"}
        </button>
      </form>
    </div>
  );
}

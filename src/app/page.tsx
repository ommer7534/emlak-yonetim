import Link from "next/link";
import { Home, Search, MapPin, TrendingUp } from "lucide-react";

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-700 to-blue-500 text-white py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">Hayalinizdeki Evi Bulun</h1>
          <p className="text-blue-100 text-lg mb-8">
            Binlerce satılık ve kiralık ilan arasından size en uygununu keşfedin.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/ilanlar?ilan_tipi=satilik"
              className="bg-white text-blue-700 font-semibold px-8 py-3 rounded-xl hover:bg-blue-50 transition-colors"
            >
              Satılık İlanlar
            </Link>
            <Link
              href="/ilanlar?ilan_tipi=kiralik"
              className="bg-blue-600 border border-white/30 text-white font-semibold px-8 py-3 rounded-xl hover:bg-blue-500 transition-colors"
            >
              Kiralık İlanlar
            </Link>
          </div>
        </div>
      </section>

      {/* Özellikler */}
      <section className="max-w-5xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: Search, baslik: "Gelişmiş Filtre", aciklama: "Fiyat, oda, m², semt ve daha fazlası" },
            { icon: MapPin, baslik: "Harita ile Ara", aciklama: "İstanbul haritasında konuma göre ilan bul" },
            { icon: Home, baslik: "Kolay İlan Ver", aciklama: "Fotoğraflı ilanınızı dakikalar içinde yayınlayın" },
            { icon: TrendingUp, baslik: "Kredi Hesapla", aciklama: "Anında mortgage hesaplayıcı ile plan yapın" },
          ].map(({ icon: Icon, baslik, aciklama }) => (
            <div key={baslik} className="bg-white rounded-xl border border-gray-200 p-6 text-center hover:shadow-md transition-shadow">
              <Icon className="mx-auto text-blue-600 mb-3" size={28} />
              <h3 className="font-semibold text-gray-800 mb-1">{baslik}</h3>
              <p className="text-sm text-gray-500">{aciklama}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-white border-t border-gray-200 py-12 text-center px-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">İlanınızı Ücretsiz Yayınlayın</h2>
        <p className="text-gray-500 mb-6">Binlerce alıcı ve kiracıya ulaşın.</p>
        <Link
          href="/ilanlar/yeni"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-10 py-3 rounded-xl transition-colors"
        >
          Hemen İlan Ver
        </Link>
      </section>
    </div>
  );
}

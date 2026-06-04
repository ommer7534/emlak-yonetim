-- Emlak Yönetim Sistemi - Supabase Şeması

create extension if not exists "uuid-ossp";

-- İlanlar tablosu
create table ilanlar (
  id uuid primary key default uuid_generate_v4(),
  slug text unique not null,
  baslik text not null,
  aciklama text not null,
  fiyat numeric(12,2) not null,
  para_birimi text not null default 'TRY' check (para_birimi in ('TRY','USD','EUR')),
  ilan_tipi text not null check (ilan_tipi in ('satilik','kiralik')),
  mulk_tipi text not null check (mulk_tipi in ('daire','villa','arsa','isyeri','dukkan')),
  durum text not null default 'aktif' check (durum in ('aktif','pasif','satildi','kiralandi')),
  oda_sayisi smallint,
  banyo_sayisi smallint,
  brut_m2 numeric(8,2),
  net_m2 numeric(8,2),
  kat smallint,
  toplam_kat smallint,
  bina_yasi smallint,
  isitma_tipi text,
  adres text not null,
  semt text not null,
  ilce text not null,
  il text not null default 'İstanbul',
  lat double precision,
  lng double precision,
  gorseller text[] not null default '{}',
  ozellikler text[] not null default '{}',
  goruntulenme integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Leadler tablosu
create table leadler (
  id uuid primary key default uuid_generate_v4(),
  ilan_id uuid references ilanlar(id) on delete set null,
  ad_soyad text not null,
  telefon text not null,
  email text,
  mesaj text,
  created_at timestamptz not null default now()
);

-- Updated_at otomatik güncelleme
create or replace function update_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger ilanlar_updated_at
  before update on ilanlar
  for each row execute function update_updated_at();

-- Görüntülenme sayacı artırma
create or replace function artir_goruntulenme(ilan_id uuid)
returns void language plpgsql security definer as $$
begin
  update ilanlar set goruntulenme = goruntulenme + 1 where id = ilan_id;
end;
$$;

-- İndeksler
create index idx_ilanlar_durum on ilanlar(durum);
create index idx_ilanlar_ilan_tipi on ilanlar(ilan_tipi);
create index idx_ilanlar_mulk_tipi on ilanlar(mulk_tipi);
create index idx_ilanlar_semt on ilanlar(semt);
create index idx_ilanlar_ilce on ilanlar(ilce);
create index idx_ilanlar_fiyat on ilanlar(fiyat);
create index idx_ilanlar_slug on ilanlar(slug);

-- RLS
alter table ilanlar enable row level security;
alter table leadler enable row level security;

-- Herkes aktif ilanları okuyabilir
create policy "ilanlar_select" on ilanlar for select using (durum = 'aktif');
-- Herkes lead bırakabilir
create policy "leadler_insert" on leadler for insert with check (true);

-- Örnek veriler
insert into ilanlar (slug, baslik, aciklama, fiyat, ilan_tipi, mulk_tipi, oda_sayisi, banyo_sayisi, brut_m2, net_m2, kat, toplam_kat, bina_yasi, isitma_tipi, adres, semt, ilce, il, lat, lng, gorseller, ozellikler)
values
  ('kadikoy-3-1-daire-satilik', 'Kadıköy''de Satılık 3+1 Daire', 'Metro''ya 5 dakika, bakımlı bina, geniş balkon.', 4500000, 'satilik', 'daire', 3, 1, 120, 110, 4, 8, 10, 'Kombi', 'Moda Cad. No:12', 'Moda', 'Kadıköy', 'İstanbul', 40.9899, 29.0260, ARRAY['/placeholder-1.jpg','/placeholder-2.jpg'], ARRAY['Balkon','Asansör','Otopark','Güvenlik']),
  ('besiktas-2-1-kiralik', 'Beşiktaş Merkez 2+1 Kiralık', 'Deniz manzaralı, mobilyalı, merkezi konumda.', 25000, 'kiralik', 'daire', 2, 1, 90, 80, 6, 10, 15, 'Merkezi', 'Çırağan Cad. No:5', 'Beşiktaş', 'Beşiktaş', 'İstanbul', 41.0440, 29.0063, ARRAY['/placeholder-1.jpg'], ARRAY['Mobilyalı','Deniz Manzarası','Asansör']),
  ('atasehir-villa-satilik', 'Ataşehir''de Müstakil Villa', 'Özel bahçeli, havuzlu, 5+2 müstakil villa.', 12000000, 'satilik', 'villa', 5, 3, 320, 290, 1, 3, 5, 'Yerden Isıtma', 'Bağdat Cad. Sitesi', 'Ataşehir', 'Ataşehir', 'İstanbul', 40.9850, 29.1200, ARRAY['/placeholder-1.jpg'], ARRAY['Havuz','Bahçe','Garaj','Akıllı Ev']);

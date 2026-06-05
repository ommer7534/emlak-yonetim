-- Supabase Dashboard > Storage > New bucket yerine SQL ile çalıştırabilirsiniz

-- images bucket'ını public olarak oluştur (veya mevcut bucket'ı public yap)
insert into storage.buckets (id, name, public)
values ('images', 'images', true)
on conflict (id) do update set public = true;

-- Herkes görselleri okuyabilir
create policy "images_public_read"
  on storage.objects for select
  using ( bucket_id = 'images' );

-- Herkes yükleyebilir (ileride authenticated yapılabilir)
create policy "images_public_insert"
  on storage.objects for insert
  with check ( bucket_id = 'images' );

-- Yükleme sonrası gorseller alanına kaydedilecek URL formatı:
-- SADECE dosya yolunu kaydedin, tam URL değil.
-- Örnek: "listings/kadikoy-daire/foto1.jpg"
--
-- Tam URL şöyle oluşur:
-- https://[proje-id].supabase.co/storage/v1/object/public/images/listings/kadikoy-daire/foto1.jpg

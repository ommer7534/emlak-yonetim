import { createClient } from "@supabase/supabase-js";
import type { Ilan, LeadForm, IlanFiltre } from "@/types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function getIlanlar(filtre?: IlanFiltre): Promise<Ilan[]> {
  let query = supabase
    .from("ilanlar")
    .select("*")
    .eq("durum", "aktif")
    .order("created_at", { ascending: false });

  if (filtre?.ilan_tipi) query = query.eq("ilan_tipi", filtre.ilan_tipi);
  if (filtre?.mulk_tipi) query = query.eq("mulk_tipi", filtre.mulk_tipi);
  if (filtre?.min_fiyat) query = query.gte("fiyat", filtre.min_fiyat);
  if (filtre?.max_fiyat) query = query.lte("fiyat", filtre.max_fiyat);
  if (filtre?.min_m2) query = query.gte("net_m2", filtre.min_m2);
  if (filtre?.max_m2) query = query.lte("net_m2", filtre.max_m2);
  if (filtre?.oda_sayisi) query = query.eq("oda_sayisi", filtre.oda_sayisi);
  if (filtre?.semt) query = query.ilike("semt", `%${filtre.semt}%`);
  if (filtre?.ilce) query = query.eq("ilce", filtre.ilce);

  const { data, error } = await query;
  if (error) throw error;
  return data as Ilan[];
}

export async function getIlan(slug: string): Promise<Ilan | null> {
  const { data, error } = await supabase
    .from("ilanlar")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) return null;

  await supabase.rpc("artir_goruntulenme", { ilan_id: data.id });
  return data as Ilan;
}

export async function submitLead(lead: LeadForm): Promise<void> {
  const { error } = await supabase.from("leadler").insert(lead);
  if (error) throw error;
}

export async function createIlan(
  ilan: Omit<Ilan, "id" | "slug" | "goruntulenme" | "created_at" | "updated_at">
): Promise<Ilan> {
  const slug = slugify(ilan.baslik) + "-" + Date.now();
  const { data, error } = await supabase
    .from("ilanlar")
    .insert({ ...ilan, slug })
    .select()
    .single();

  if (error) throw error;
  return data as Ilan;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/ğ/g, "g").replace(/ü/g, "u").replace(/ş/g, "s")
    .replace(/ı/g, "i").replace(/ö/g, "o").replace(/ç/g, "c")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);
}

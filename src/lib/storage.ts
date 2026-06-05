const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const BUCKET = "images";

/**
 * Supabase Storage yolunu tam public URL'e dönüştürür.
 * - Zaten http ile başlıyorsa olduğu gibi döner
 * - / ile başlıyorsa (local) olduğu gibi döner
 * - Diğer durumlarda Supabase Storage public URL ekler
 */
export function gorselUrl(path: string): string {
  if (!path) return "/gorsel-yok.svg";
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  if (path.startsWith("/")) return path;
  return `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${path}`;
}

export const PLACEHOLDER = "/gorsel-yok.svg";

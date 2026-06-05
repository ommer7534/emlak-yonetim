import { getSupabaseAdmin } from "@/lib/supabase-admin";
import AdminLeadsTable from "./leads-table";
import AdminLogoutButton from "./logout-button";

export const dynamic = "force-dynamic";

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const params = await searchParams;
  const q = params.q ?? "";
  const page = Math.max(1, parseInt(params.page ?? "1"));
  const pageSize = 25;

  let leadler: unknown[] = [];
  let count = 0;
  let errorMsg = "";

  try {
    const supabaseAdmin = getSupabaseAdmin();
    let query = supabaseAdmin
      .from("leadler")
      .select(
        `id, created_at, ad_soyad, telefon, email, mesaj, ilan_id, ilanlar ( baslik, slug )`,
        { count: "exact" }
      )
      .order("created_at", { ascending: false })
      .range((page - 1) * pageSize, page * pageSize - 1);

    if (q) {
      query = query.or(
        `ad_soyad.ilike.%${q}%,telefon.ilike.%${q}%,email.ilike.%${q}%`
      );
    }

    const { data, count: total, error } = await query;
    if (error) {
      errorMsg = error.message;
    } else {
      leadler = data ?? [];
      count = total ?? 0;
    }
  } catch (e: unknown) {
    errorMsg = e instanceof Error ? e.message : "Bilinmeyen hata";
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <header className="border-b border-gray-800 bg-gray-900 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-blue-400 font-bold">EmlakYönetim</span>
            <span className="text-gray-600">/</span>
            <span className="text-gray-300 text-sm">Admin</span>
          </div>
          <AdminLogoutButton />
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-xl font-bold text-white">Gelen Talepler</h1>
          <p className="text-gray-500 text-sm mt-0.5">{count} kayıt</p>
        </div>

        {errorMsg ? (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6">
            <p className="text-red-400 font-medium mb-2">Veriler yüklenemedi</p>
            <pre className="text-gray-400 text-xs bg-gray-800 rounded p-3 whitespace-pre-wrap break-all">
              {errorMsg}
            </pre>
          </div>
        ) : (
          <AdminLeadsTable
            leadler={leadler as Parameters<typeof AdminLeadsTable>[0]["leadler"]}
            total={count}
            page={page}
            pageSize={pageSize}
            q={q}
          />
        )}
      </main>
    </div>
  );
}

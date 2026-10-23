/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { FACULTY } from "@/lib/site";
import { getData, img, tgl, type PostList } from "@/lib/public";

export default async function NewsList({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const page = Math.max(1, Number((await searchParams).page) || 1);
  const res = await getData<PostList>(`/posts?page=${page}&limit=9${FACULTY ? `&faculty=${FACULTY}` : ""}`);
  const posts = res?.data ?? [];
  const totalPages = res?.meta.totalPages ?? 1;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-bold text-blue-900">Berita &amp; Pengumuman</h1>
      <div className="mt-6 grid gap-5 md:grid-cols-3">
        {posts.map((p) => (
          <Link key={p.id} href={`/berita/${p.slug}`} className="overflow-hidden rounded-xl bg-white shadow-sm hover:shadow-md transition">
            {img(p.thumbnail) && <img src={img(p.thumbnail)!} alt={p.title} className="h-40 w-full object-cover" />}
            <div className="p-4">
              <p className="text-xs text-slate-500">{p.category} · {tgl(p.publishedAt)}</p>
              <h2 className="mt-1 font-semibold text-blue-900">{p.title}</h2>
              <p className="mt-2 text-sm text-slate-600 line-clamp-2">{p.excerpt}</p>
            </div>
          </Link>
        ))}
        {posts.length === 0 && <p className="text-slate-500">Belum ada berita.</p>}
      </div>
      {totalPages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-4 text-sm">
          {page > 1 && <Link href={`/berita?page=${page - 1}`} className="text-blue-700 hover:underline">← Sebelumnya</Link>}
          <span>Halaman {page} dari {totalPages}</span>
          {page < totalPages && <Link href={`/berita?page=${page + 1}`} className="text-blue-700 hover:underline">Berikutnya →</Link>}
        </div>
      )}
    </div>
  );
}

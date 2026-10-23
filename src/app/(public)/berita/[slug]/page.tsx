/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { notFound } from "next/navigation";
import { getData, img, tgl, type Post } from "@/lib/public";

export default async function NewsDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = await getData<Post>(`/posts/${slug}`);
  if (!p) notFound();

  return (
    <article className="mx-auto max-w-3xl px-4 py-10">
      <Link href="/berita" className="text-sm text-blue-700 hover:underline">← Semua berita</Link>
      <p className="mt-4 text-xs text-slate-500">{p.category} · {tgl(p.publishedAt)}{p.author ? ` · ${p.author.name}` : ""}</p>
      <h1 className="mt-1 text-3xl font-bold text-blue-900">{p.title}</h1>
      {img(p.thumbnail) && <img src={img(p.thumbnail)!} alt={p.title} className="mt-6 w-full rounded-xl object-cover" />}
      {/* Isi berita berupa HTML dari editor admin */}
      <div className="mt-6 space-y-4 leading-relaxed" dangerouslySetInnerHTML={{ __html: p.content ?? "" }} />
    </article>
  );
}

/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { img, initials, lecturerKey, tgl, type CourseGroup, type Facility, type Lecturer, type Post, type Product } from "@/lib/public";

export const LEVELS = ["D3", "D4", "S1", "S2", "S3"];
export const card = "rounded-2xl border border-[#DCE6F5] bg-white p-6";
export const tag = "text-xs font-bold uppercase tracking-wide text-[#1559B8]";
export const hoverCard =
  "transition duration-300 hover:-translate-y-1 hover:border-[#1E6FD9]/40 hover:shadow-xl";

type Cta = { label: string; href: string; primary?: boolean };

export function Hero({
  kicker,
  title,
  sub,
  image,
  ctas,
}: {
  kicker: string;
  title: string;
  sub?: React.ReactNode;
  image?: string | null;
  ctas?: Cta[];
}) {
  const u = img(image);
  return (
    <section
      className="relative overflow-hidden py-24 text-white md:py-32"
      style={{ backgroundImage: "linear-gradient(120deg,#0A2A66 0%,#0B3D91 60%,#1E6FD9 100%)" }}
    >
      {u && (
        <img src={u} alt="" className="absolute inset-0 h-full w-full object-cover" style={{ opacity: 0.3 }} />
      )}

      {/* Dekorasi sisi kanan (hanya layar lebar) */}
      <div aria-hidden="true" className="pointer-events-none absolute -right-24 -top-24 hidden h-[420px] w-[420px] rounded-full border border-white/15 md:block" />
      <div aria-hidden="true" className="pointer-events-none absolute -right-8 top-16 hidden h-72 w-72 rounded-full bg-white/5 md:block" />
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-15 right-48 hidden h-44 w-44 rounded-full bg-[#1E6FD9]/40 blur-2xl md:block" />

      <div className="relative mx-auto max-w-6xl px-6">
        <p className="hero-in mb-4 text-xs font-bold uppercase tracking-[0.16em] text-[#BFD6FF]">{kicker}</p>
        <h1 className="hero-in-2 max-w-3xl text-4xl font-extrabold leading-[1.1] md:text-5xl">{title}</h1>
        {sub && <p className="hero-in-2 mt-4 text-lg text-[#E3EDFF]">{sub}</p>}

        {ctas && ctas.length > 0 && (
          <div className="hero-in-3 mt-8 flex flex-wrap gap-3">
            {ctas.map((c) => (
              <a
                key={c.label}
                href={c.href}
                className={
                  c.primary
                    ? "rounded-[10px] bg-white px-6 py-3 text-[15px] font-semibold text-[#0B3D91] shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl"
                    : "rounded-[10px] border-[1.5px] border-white/80 px-6 py-3 text-[15px] font-semibold transition hover:bg-white/10"
                }
              >
                {c.label}
              </a>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export function Sec({ id, tint, children }: { id?: string; tint?: boolean; children: React.ReactNode }) {
  return (
    <section id={id} className={`scroll-mt-24 py-16 ${tint ? "bg-[#F4F8FF]" : "bg-white"}`}>
      <div className="mx-auto max-w-6xl px-6">{children}</div>
    </section>
  );
}

export function Head({ eye, title, href }: { eye: string; title: string; href?: string }) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
      <div>
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.14em] text-[#1559B8]">{eye}</p>
        <h2 className="text-[34px] font-extrabold leading-tight text-[#0B2A5E]">{title}</h2>
      </div>
      {href && (
        <Link href={href} className="text-sm font-bold text-[#1559B8]">
          Lihat semua →
        </Link>
      )}
    </div>
  );
}

export function Down({ status }: { status: number }) {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-6xl px-6">
        <h1 className="text-3xl font-extrabold text-[#0B2A5E]">Data belum bisa dimuat</h1>
        <p className="mt-3 text-slate-600">
          Pastikan database dan backend menyala. (kode: {status || "tidak terhubung ke backend"})
        </p>
      </div>
    </section>
  );
}

export function Foto({ src, label, h = "h-40" }: { src?: string | null; label: string; h?: string }) {
  const u = img(src);
  return u ? (
    <img src={u} alt={label} className={`${h} w-full rounded-xl object-cover`} />
  ) : (
    <div
      className={`${h} flex w-full items-center justify-center rounded-xl px-3 text-center text-sm text-[#47608F]`}
      style={{ backgroundImage: "linear-gradient(135deg,#DCE6F5,#EAF2FF)" }}
    >
      {label}
    </div>
  );
}

export function Checks({ items }: { items: string[] }) {
  return (
    <ul className="grid gap-4 sm:grid-cols-2">
      {items.map((t, i) => (
        <li key={i} className={`${card} flex items-start gap-3 text-[15px] text-[#3A4D6E]`} style={{ padding: 16 }}>
          <svg style={{ flexShrink: 0, marginTop: 2 }} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1E6FD9" strokeWidth="2.2" aria-hidden="true">
            <path d="M5 12l5 5 9-10" />
          </svg>
          {t}
        </li>
      ))}
    </ul>
  );
}

export function VisiMisi({ vision, mission }: { vision?: string | null; mission: string[] }) {
  return (
    <div className="grid gap-5 md:grid-cols-3">
      {vision && (
        <div className="rounded-2xl bg-[#0B3D91] p-7 text-white">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.14em] text-[#BFD6FF]">Visi</p>
          <p className="text-lg font-semibold leading-relaxed">{vision}</p>
        </div>
      )}
      {mission.length > 0 && (
        <div className={card} style={{ gridColumn: vision ? "span 2 / span 2" : "1 / -1" }}>
          <p className={`${tag} mb-4`}>Misi</p>
          <ol className="space-y-3">
            {mission.map((m, i) => (
              <li key={i} className="flex items-start gap-3 text-[15px] text-[#3A4D6E]">
                <span
                  style={{ width: 28, height: 28, flexShrink: 0 }}
                  className="flex items-center justify-center rounded-full bg-[#EAF2FF] text-sm font-bold text-[#0B3D91]"
                >
                  {i + 1}
                </span>
                <span style={{ paddingTop: 3 }}>{m}</span>
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}

export function FokusBelajar({ groups }: { groups: CourseGroup[] }) {
  return (
    <div className="grid gap-5 md:grid-cols-3">
      {groups.map((g, i) => (
        <div key={g.title} className={card}>
          <div className="mb-3 text-3xl font-extrabold text-[#1E6FD9]">{String(i + 1).padStart(2, "0")}</div>
          <h3 className="mb-3 text-lg font-bold text-[#0B2A5E]">{g.title}</h3>
          <ul className="list-disc space-y-1 pl-5 text-[15px] text-[#3A4D6E]">
            {g.courses.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export function Produk({ items }: { items: Product[] }) {
  return (
    <div className="grid gap-5 md:grid-cols-3">
      {items.map((p) => (
        <div key={p.id} className={`${card} ${hoverCard}`}>
          <Foto src={p.image} label="Foto produk" />
          <h3 className="mt-4 text-lg font-bold text-[#0B2A5E]">{p.name}</h3>
          <p className="mt-2 line-clamp-3 text-[15px] text-[#3A4D6E]">{p.description}</p>
          {p.usedBy && <p className="mt-2 text-[13px] text-[#47608F]">{p.usedBy}</p>}
          {p.link && (
            <a
              href={p.link}
              target={p.link.startsWith("http") ? "_blank" : undefined}
              rel="noreferrer"
              className="mt-3 inline-block text-sm font-bold text-[#1559B8]"
            >
              Kunjungi →
            </a>
          )}
        </div>
      ))}
    </div>
  );
}

/** BARU: fasilitas fakultas (grid kartu foto, nama, deskripsi). */
export function Fasilitas({ items }: { items: Facility[] }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((f) => (
        <div key={f.id} className={`${card} ${hoverCard}`} style={{ padding: 12 }}>
          <Foto src={f.image} label={f.name} h="h-44" />
          <div style={{ padding: "12px 8px 8px" }}>
            <h3 className="text-lg font-bold text-[#0B2A5E]">{f.name}</h3>
            {f.description && <p className="mt-1 text-[15px] text-[#3A4D6E]">{f.description}</p>}
          </div>
        </div>
      ))}
    </div>
  );
}

/** Daftar dosen berbentuk grid. Setiap kartu menuju halaman profil /dosen/[slug]. */
export function Dosen({ items, showProgram }: { items: Lecturer[]; showProgram?: boolean }) {
  if (items.length === 0) return <p className="text-[15px] text-slate-500">Data dosen belum tersedia.</p>;
  return (
    <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
      {items.map((l) => {
        const u = img(l.photo);
        const box = { aspectRatio: "3 / 4" } as const;
        return (
          <Link key={l.id} href={`/dosen/${lecturerKey(l)}`} className={`${card} block ${hoverCard}`} style={{ padding: 12 }}>
            {u ? (
              <img src={u} alt={l.name} className="w-full rounded-xl object-cover" style={box} />
            ) : (
              <div
                className="flex w-full items-center justify-center rounded-xl bg-[#EAF2FF] text-3xl font-extrabold text-[#0B3D91]"
                style={box}
              >
                {initials(l.name)}
              </div>
            )}
            <p className="mt-3 font-bold text-[#0B2A5E]">{l.name}</p>
            <p className="text-[13px] text-[#47608F]">{l.position}</p>
            {showProgram && l.studyProgram && (
              <p className={`${tag} mt-2`}>
                {l.studyProgram.level} {l.studyProgram.name}
              </p>
            )}
          </Link>
        );
      })}
    </div>
  );
}

export function Kontak({ email, phone }: { email?: string | null; phone?: string | null }) {
  if (!email && !phone) return null;
  return (
    <section id="kontak" className="scroll-mt-24 bg-[#0B3D91] py-14">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 text-white md:flex-row md:items-center md:justify-between">
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.14em] text-[#BFD6FF]">Kontak</p>
          <h2 className="text-3xl font-extrabold">Hubungi Kami</h2>
          <p className="mt-2 max-w-md text-[15px] text-[#DCE6F5]">
            Ada pertanyaan seputar program studi atau pendaftaran? Tim kami siap membantu.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          {email && (
            <a
              href={`mailto:${email}`}
              className="rounded-[10px] bg-white px-6 py-3 text-[15px] font-semibold text-[#0B3D91] transition hover:-translate-y-0.5 hover:shadow-lg"
            >
              {email}
            </a>
          )}
          {phone && (
            <a
              href={`tel:${phone}`}
              className="rounded-[10px] border-[1.5px] border-white/80 px-6 py-3 text-[15px] font-semibold transition hover:bg-white/10"
            >
              {phone}
            </a>
          )}
        </div>
      </div>
    </section>
  );
}

const kat = (c: string) => c.charAt(0) + c.slice(1).toLowerCase();

export function PostGrid({ items }: { items: Post[] }) {
  return (
    <div className="grid gap-5 md:grid-cols-3">
      {items.map((p) => (
        <Link key={p.id} href={`/berita/${p.slug}`} className={`${card} block ${hoverCard}`}>
          <Foto src={p.thumbnail} label="Foto" />
          <p className={`${tag} mt-4`}>{[kat(p.category), tgl(p.publishedAt)].filter(Boolean).join(" · ")}</p>
          <h3 className="mt-1 text-lg font-bold text-[#0B2A5E]">{p.title}</h3>
          <p className="mt-2 line-clamp-2 text-[15px] text-[#3A4D6E]">{p.excerpt}</p>
        </Link>
      ))}
    </div>
  );
}

export function PostRows({ items }: { items: Post[] }) {
  return (
    <div className={`${card} divide-y divide-[#DCE6F5] py-2`}>
      {items.map((p) => (
        <Link key={p.id} href={`/berita/${p.slug}`} className="flex flex-col gap-2 py-5 sm:flex-row sm:gap-6">
          <div className="min-w-32">
            <p className={tag}>{kat(p.category)}</p>
            <p className="text-[13px] text-[#47608F]">{tgl(p.publishedAt)}</p>
          </div>
          <div>
            <h3 className="text-lg font-bold text-[#0B2A5E]">{p.title}</h3>
            <p className="mt-1 line-clamp-2 text-[15px] text-[#3A4D6E]">{p.excerpt}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}
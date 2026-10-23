/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { FACULTY } from "@/lib/site";
import FacultySite from "@/components/public/FacultySite";
import {
  getData, img, tgl, list, strengthsOf,
  type Faculty, type GalleryItem, type Lecturer, type Post, type PostList, type Product,
} from "@/lib/public";

// ===== Teks "Kehidupan Kampus", ubah langsung di sini =====
const KEHIDUPAN = [
  { judul: "Organisasi dan UKM", teks: "Wadah mengembangkan minat, bakat, dan kepemimpinan mahasiswa." },
  { judul: "Fasilitas Kampus", teks: "Sarana belajar dan penunjang kegiatan akademik." },
  { judul: "Kegiatan dan Acara", teks: "Seminar, lomba, dan kegiatan kemahasiswaan sepanjang tahun." },
  { judul: "Layanan Mahasiswa", teks: "Dukungan akademik dan kemahasiswaan selama masa studi." },
];

const kat = (c: string) => c.charAt(0) + c.slice(1).toLowerCase();

function Icon({ i }: { i: number }) {
  const n = i % 3;
  return (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#0B3D91" strokeWidth="1.6" aria-hidden="true">
      {n === 0 && (<><ellipse cx="12" cy="12" rx="10" ry="4" /><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)" /><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)" /></>)}
      {n === 1 && (<><rect x="3" y="7" width="18" height="13" rx="2" /><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M3 13h18" /></>)}
      {n === 2 && <path d="M2 9l10-5 10 5-10 5-10-5zM6 11v5c0 1.5 3 3 6 3s6-1.5 6-3v-5" />}
    </svg>
  );
}

function Sec({ id, tint, children }: { id?: string; tint?: boolean; children: React.ReactNode }) {
  return (
    <section id={id} className={`scroll-mt-4 py-16 ${tint ? "bg-[#F4F8FF]" : "bg-white"}`}>
      <div className="mx-auto max-w-6xl px-6">{children}</div>
    </section>
  );
}

function Head({ eye, title, href }: { eye: string; title: string; href?: string }) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
      <div>
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.14em] text-[#1559B8]">{eye}</p>
        <h2 className="text-[34px] font-extrabold leading-tight text-[#0B2A5E]">{title}</h2>
      </div>
      {href && <Link href={href} className="text-sm font-bold text-[#1559B8]">Lihat semua →</Link>}
    </div>
  );
}

function Foto({ src, label, h = "h-40" }: { src?: string | null; label: string; h?: string }) {
  const u = img(src);
  return u ? (
    <img src={u} alt={label} className={`${h} w-full rounded-xl object-cover`} />
  ) : (
    <div className={`${h} flex w-full items-center justify-center rounded-xl text-sm text-[#47608F]`} style={{ backgroundImage: "linear-gradient(135deg,#DCE6F5,#EAF2FF)" }}>{label}</div>
  );
}

const card = "rounded-2xl border border-[#DCE6F5] bg-white p-6";
const tag = "text-xs font-bold uppercase tracking-wide text-[#1559B8]";

function PostCard({ p }: { p: Post }) {
  return (
    <Link href={`/berita/${p.slug}`} className={`${card} block transition hover:shadow-md`}>
      <Foto src={p.thumbnail} label="Foto" />
      <p className={`${tag} mt-4`}>{[kat(p.category), tgl(p.publishedAt)].filter(Boolean).join(" · ")}</p>
      <h3 className="mt-1 text-lg font-bold text-[#0B2A5E]">{p.title}</h3>
      <p className="mt-2 line-clamp-2 text-[15px] text-[#3A4D6E]">{p.excerpt}</p>
    </Link>
  );
}

export default async function Home() {
  if (FACULTY) return <FacultySite slug={FACULTY} />; // mode website fakultas
  const [faculties, products, lecturers, galleries, prestasi, berita] = await Promise.all([
    getData<Faculty[]>("/faculties"),
    getData<Product[]>("/products"),
    getData<Lecturer[]>("/lecturers"),
    getData<{ data: GalleryItem[] }>("/galleries?limit=4"),
    getData<PostList>("/posts?category=PRESTASI&limit=3"),
    getData<PostList>("/posts?limit=5"),
  ]);

  const fak = faculties ?? [];
  const prod = products ?? [];
  const foto = galleries?.data ?? [];
  const namaFakultas = (id: number) => fak.find((f) => f.id === id)?.name ?? "";
  const keunggulan = fak.flatMap((f) => strengthsOf(f.strengths).map((s) => ({ ...s, fakultas: f.name }))).slice(0, 3);
  const visiMisi = fak.filter((f) => f.vision || list(f.mission).length > 0);
  const stats: [string, number][] = [
    ["Fakultas", fak.length],
    ["Program Studi", fak.reduce((n, f) => n + (f.programs?.length ?? 0), 0)],
    ["Dosen", lecturers?.length ?? 0],
    ["Produk", prod.length],
  ];
  const prestasiList = prestasi?.data ?? [];
  const beritaList = berita?.data ?? [];

  let n = 0;
  const tint = () => n++ % 2 === 1; // latar bagian berselang-seling

  return (
    <>
      <section className="py-24 text-white" style={{ backgroundImage: "linear-gradient(120deg,#0A2A66 0%,#0B3D91 60%,#1E6FD9 100%)" }}>
        <div className="mx-auto max-w-6xl px-6">
          <p className="mb-4 text-xs font-bold tracking-[0.16em] text-[#BFD6FF]">SELAMAT DATANG DI UNIVERSITAS PIGNATELLI TRIPUTRA</p>
          <h1 className="mb-5 max-w-xl text-5xl font-extrabold leading-[1.1]">Masa Depan Dimulai dari Sini</h1>
          <p className="mb-8 max-w-lg text-lg text-[#E3EDFF]">Bertumbuh melalui pendidikan yang bermakna, riset yang berdampak, dan komunitas yang menginspirasi.</p>
          <div className="flex flex-wrap gap-3">
            <a href="#fakultas" className="rounded-[10px] bg-[#1E6FD9] px-6 py-3 text-[15px] font-semibold">Jelajahi Program Studi</a>
            <a href="#visi-misi" className="rounded-[10px] border-[1.5px] border-white px-6 py-3 text-[15px] font-semibold">Tentang Kami</a>
          </div>
        </div>
      </section>

      <Sec id="fakultas">
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.14em] text-[#1559B8]">Jelajahi Pilihanmu</p>
        <h2 className="mb-8 text-[34px] font-extrabold leading-tight text-[#0B2A5E]">Temukan ruang untuk berkembang</h2>
        {faculties === null && <p className="text-slate-500">Data belum bisa dimuat. Pastikan backend menyala.</p>}
        <div className="grid gap-5 md:grid-cols-3">
          {fak.map((f, i) => (
            <Link key={f.id} href={`/fakultas/${f.slug}`} className="flex flex-col gap-3 rounded-2xl bg-[#EAF2FF] p-7 transition hover:shadow-md">
              <Icon i={i} />
              <h3 className="text-lg font-bold text-[#0B2A5E]">{f.name}</h3>
              <p className="line-clamp-3 text-[15px] text-[#3A4D6E]">{f.description}</p>
              <span className="text-sm font-bold text-[#1559B8]">Selengkapnya →</span>
            </Link>
          ))}
        </div>
      </Sec>

      {fak.length > 0 && (
        <section className="bg-[#0B3D91] py-14">
          <div className="mx-auto max-w-6xl px-6">
            <h2 className="mb-7 text-[28px] font-extrabold text-white">Fakta dan Angka</h2>
            <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
              {stats.map(([label, v]) => (
                <div key={label}><div className="text-5xl font-extrabold leading-none text-white">{v}</div><div className="mt-2 text-sm text-[#DCE6F5]">{label}</div></div>
              ))}
            </div>
          </div>
        </section>
      )}

      {keunggulan.length > 0 && (
        <Sec tint={tint()}>
          <Head eye="Keunggulan" title="Komitmen terhadap Mutu Pendidikan" />
          <div className="grid gap-5 md:grid-cols-3">
            {keunggulan.map((s, i) => (
              <div key={s.title} className={card}>
                <div className="mb-3 text-3xl font-extrabold text-[#1E6FD9]">{String(i + 1).padStart(2, "0")}</div>
                <h3 className="mb-2 text-lg font-bold text-[#0B2A5E]">{s.title}</h3>
                <p className="text-[15px] text-[#3A4D6E]">{s.description}</p>
                <p className={`${tag} mt-3`}>{s.fakultas}</p>
              </div>
            ))}
          </div>
        </Sec>
      )}

      {visiMisi.length > 0 && (
        <Sec id="visi-misi" tint={tint()}>
          <Head eye="Visi dan Misi" title="Arah dan tujuan setiap fakultas" />
          <div className="grid gap-5 md:grid-cols-3">
            {visiMisi.map((f) => (
              <div key={f.id} className={card}>
                <h3 className="mb-4 text-xl font-bold text-[#0B2A5E]">{f.name}</h3>
                {f.vision && (<><p className={tag}>Visi</p><p className="mb-4 mt-1 text-[15px] text-[#3A4D6E]">{f.vision}</p></>)}
                {list(f.mission).length > 0 && (<><p className={tag}>Misi</p>
                  <ul className="mt-1 list-disc space-y-1 pl-5 text-[15px] text-[#3A4D6E]">{list(f.mission).map((m, i) => <li key={i}>{m}</li>)}</ul></>)}
              </div>
            ))}
          </div>
        </Sec>
      )}

      {prod.length > 0 && (
        <Sec id="produk" tint={tint()}>
          <Head eye="Produk" title="Karya dan inovasi fakultas" />
          <div className="grid gap-5 md:grid-cols-3">
            {prod.map((p) => (
              <div key={p.id} className={card}>
                <Foto src={p.image} label="Foto produk" />
                <p className={`${tag} mt-4`}>{namaFakultas(p.facultyId)}</p>
                <h3 className="mt-1 text-lg font-bold text-[#0B2A5E]">{p.name}</h3>
                <p className="mt-2 line-clamp-3 text-[15px] text-[#3A4D6E]">{p.description}</p>
                {p.usedBy && <p className="mt-2 text-[13px] text-[#47608F]">{p.usedBy}</p>}
                {p.link && <a href={p.link} target={p.link.startsWith("http") ? "_blank" : undefined} rel="noreferrer" className="mt-3 inline-block text-sm font-bold text-[#1559B8]">Kunjungi →</a>}
              </div>
            ))}
          </div>
        </Sec>
      )}

      {prestasiList.length > 0 && (
        <Sec id="prestasi" tint={tint()}>
          <Head eye="Prestasi" title="Kebanggaan mahasiswa kami" />
          <div className="grid gap-5 md:grid-cols-3">{prestasiList.map((p) => <PostCard key={p.id} p={p} />)}</div>
        </Sec>
      )}

      <Sec id="kehidupan-kampus" tint={tint()}>
        <Head eye="Kehidupan Kampus" title="Lingkungan yang mendukung tumbuh kembang mahasiswa" />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {KEHIDUPAN.map((k, i) => (
            <div key={k.judul} className={card}>
              <Foto src={foto[i]?.imageUrl} label="Foto kegiatan" h="h-44" />
              <h3 className="mt-4 text-lg font-bold text-[#0B2A5E]">{k.judul}</h3>
              <p className="mt-2 text-[15px] text-[#3A4D6E]">{k.teks}</p>
            </div>
          ))}
        </div>
      </Sec>

      {beritaList.length > 0 && (
        <Sec tint={tint()}>
          <Head eye="Kabar Kampus" title="Berita, pengumuman, dan agenda" href="/berita" />
          <div className={`${card} divide-y divide-[#DCE6F5] py-2`}>
            {beritaList.map((p) => (
              <Link key={p.id} href={`/berita/${p.slug}`} className="flex flex-col gap-2 py-5 sm:flex-row sm:gap-6">
                <div className="min-w-32"><p className={tag}>{kat(p.category)}</p><p className="text-[13px] text-[#47608F]">{tgl(p.publishedAt)}</p></div>
                <div><h3 className="text-lg font-bold text-[#0B2A5E]">{p.title}</h3><p className="mt-1 line-clamp-2 text-[15px] text-[#3A4D6E]">{p.excerpt}</p></div>
              </Link>
            ))}
          </div>
        </Sec>
      )}
    </>
  );
}

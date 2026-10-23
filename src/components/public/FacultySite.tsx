/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getData, getDetail, img, list, strengthsOf,
  type Facility, type Faculty, type GalleryItem, type Lecturer, type PostList, type Product,
} from "@/lib/public";
import { DUMMY_FACILITIES, USE_DUMMY } from "@/lib/dummy";
import { card, Checks, Down, Fasilitas, Head, Hero, Kontak, LEVELS, PostGrid, PostRows, Produk, Sec, VisiMisi } from "./DetailParts";
import DosenTree from "./DosenTree";
import Reveal from "./Reveal";

// Gambar cadangan untuk "Sekilas Tentang Fakultas" kalau foto belum diisi di admin (Profil Fakultas).
// Taruh file di frontend\public\images\ lalu isi path-nya, contoh: "/images/tentang-fst.jpg". Kosongkan ("") kalau tidak ada.
const GAMBAR_TENTANG = "";

const hoverCard = "transition duration-300 hover:-translate-y-1 hover:border-[#1E6FD9]/40 hover:shadow-xl";

export default async function FacultySite({ slug }: { slug: string }) {
  const [{ data: f, status }, lecturers, products, prestasi, berita, galeri, fasilitasApi] = await Promise.all([
    getDetail<Faculty>(`/faculties/${slug}`),
    getData<Lecturer[]>("/lecturers"),
    getData<Product[]>(`/products?faculty=${slug}`),
    getData<PostList>(`/posts?faculty=${slug}&category=PRESTASI&limit=3`),
    getData<PostList>(`/posts?faculty=${slug}&limit=5`),
    getData<{ data: GalleryItem[] }>(`/galleries?faculty=${slug}&limit=8`),
    getData<Facility[]>(`/facilities?faculty=${slug}`), // endpoint baru (tahap 2), sementara null
  ]);
  if (status === 404) notFound();
  if (!f) return <Down status={status} />;

  const programs = f.programs ?? [];
  const slugs = new Set(programs.map((p) => p.slug));
  const dosen = (lecturers ?? []).filter((l) => l.studyProgram && slugs.has(l.studyProgram.slug));
  const careers = list(f.careerProspects);
  const mission = list(f.mission);
  const strengths = strengthsOf(f.strengths);
  const produk = products ?? [];
  const prestasiList = prestasi?.data ?? [];
  const beritaList = berita?.data ?? [];
  const fotoList = galeri?.data ?? [];
  const fasilitas = fasilitasApi && fasilitasApi.length > 0 ? fasilitasApi : USE_DUMMY ? DUMMY_FACILITIES : [];

  const tentangFoto = img(f.aboutImage) ?? (GAMBAR_TENTANG || null);
  const stats = ([
    ["Program Studi", programs.length],
    ["Dosen", dosen.length],
    ["Fasilitas", fasilitas.length],
    ["Produk", produk.length],
  ] as [string, number][]).filter(([, v]) => v > 0);

  let n = 0;
  const tint = () => n++ % 2 === 1; // latar bagian berselang-seling

  return (
    <>
      <Hero
        kicker={`Fakultas / ${f.name.replace(/^Fakultas\s+/i, "")}`}
        title={f.name}
        sub={f.englishName}
        image={f.heroImage}
        ctas={[
          { label: "Lihat Program Studi", href: "#prodi", primary: true },
          { label: "Hubungi Kami", href: "#kontak" },
        ]}
      />

      {stats.length > 0 && (
        <section className="border-b border-[#DCE6F5] bg-white">
          <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-6 py-8 md:grid-cols-4">
            {stats.map(([label, v]) => (
              <div key={label}>
                <div className="text-4xl font-extrabold leading-none text-[#0B3D91]">{v}</div>
                <div className="mt-2 text-sm text-[#47608F]">{label}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      <Sec id="tentang" tint={tint()}>
        <div className={tentangFoto ? "grid items-center gap-10 md:grid-cols-2" : ""}>
          <Reveal>
            <Head eye="Pengenalan" title="Sekilas Tentang Fakultas" />
            <p className="max-w-3xl whitespace-pre-line text-[15px] leading-relaxed text-[#3A4D6E]">{f.description}</p>
          </Reveal>
          {tentangFoto && (
            <Reveal delay={150}>
              <div className="overflow-hidden rounded-2xl shadow-lg">
                <img src={tentangFoto} alt={f.name} className="aspect-[4/3] w-full object-cover transition duration-500 hover:scale-105" />
              </div>
            </Reveal>
          )}
        </div>
        {strengths.length > 0 && (
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {strengths.map((s, i) => (
              <Reveal key={s.title} delay={i * 120}>
                <div className={`${card} h-full ${hoverCard}`}>
                  <div className="mb-3 text-3xl font-extrabold text-[#1E6FD9]">{String(i + 1).padStart(2, "0")}</div>
                  <h3 className="mb-2 text-lg font-bold text-[#0B2A5E]">{s.title}</h3>
                  <p className="text-[15px] text-[#3A4D6E]">{s.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        )}
      </Sec>

      {programs.length > 0 && (
        <Sec id="prodi" tint={tint()}>
          <Reveal><Head eye="Akademik" title="Program Studi" /></Reveal>
          {LEVELS.filter((l) => programs.some((p) => p.level === l)).map((l) => (
            <div key={l} className="mb-8">
              <Reveal>
                <p className="mb-3 text-xs font-bold uppercase tracking-[0.14em] text-[#1559B8]">Jenjang {l}</p>
              </Reveal>
              <div className="grid gap-5 md:grid-cols-3">
                {programs.filter((p) => p.level === l).map((p, i) => (
                  <Reveal key={p.id} delay={i * 100}>
                    <Link href={`/prodi/${p.slug}`} className={`${card} group flex h-full items-center justify-between font-bold text-[#0B2A5E] ${hoverCard}`}>
                      <span>{p.name}</span>
                      <span className="text-[#1559B8] transition-transform duration-300 group-hover:translate-x-1">→</span>
                    </Link>
                  </Reveal>
                ))}
              </div>
            </div>
          ))}
        </Sec>
      )}

      {fasilitas.length > 0 && (
        <Sec id="fasilitas" tint={tint()}>
          <Reveal><Head eye="Fasilitas" title="Sarana Penunjang Belajar" /></Reveal>
          <Reveal delay={100}><Fasilitas items={fasilitas} /></Reveal>
        </Sec>
      )}

      {careers.length > 0 && <Sec tint={tint()}><Reveal><Head eye="Setelah Lulus" title="Prospek Karir" /><Checks items={careers} /></Reveal></Sec>}
      {(f.vision || mission.length > 0) && <Sec tint={tint()}><Reveal><Head eye="Arah dan Tujuan" title="Visi dan Misi" /><VisiMisi vision={f.vision} mission={mission} /></Reveal></Sec>}
      {produk.length > 0 && <Sec id="produk" tint={tint()}><Reveal><Head eye="Produk" title="Karya dan Inovasi Fakultas" /></Reveal><Reveal delay={100}><Produk items={produk} /></Reveal></Sec>}
      {prestasiList.length > 0 && <Sec id="prestasi" tint={tint()}><Reveal><Head eye="Prestasi" title="Kebanggaan Mahasiswa Kami" /></Reveal><Reveal delay={100}><PostGrid items={prestasiList} /></Reveal></Sec>}
      {beritaList.length > 0 && <Sec id="berita" tint={tint()}><Reveal><Head eye="Kabar Fakultas" title="Berita, Pengumuman, dan Agenda" href="/berita" /></Reveal><Reveal delay={100}><PostRows items={beritaList} /></Reveal></Sec>}

      {fotoList.length > 0 && (
        <Sec id="galeri" tint={tint()}>
          <Reveal><Head eye="Dokumentasi" title="Galeri Fakultas" /></Reveal>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {fotoList.map((g, i) => {
              const u = img(g.imageUrl);
              return u ? (
                <Reveal key={g.id} delay={(i % 4) * 100}>
                  <div className="group overflow-hidden rounded-2xl shadow-sm">
                    <img src={u} alt={g.title || "Galeri fakultas"} className="aspect-square w-full object-cover transition duration-500 group-hover:scale-110" />
                  </div>
                </Reveal>
              ) : null;
            })}
          </div>
        </Sec>
      )}

      <Sec id="dosen" tint={tint()}>
        <Reveal><Head eye="Pengajar" title="Struktur dan Dosen" /></Reveal>
        <Reveal delay={100}><DosenTree items={dosen} programs={programs} /></Reveal>
      </Sec>

      <Kontak email={f.email} phone={f.phone} />
    </>
  );
}
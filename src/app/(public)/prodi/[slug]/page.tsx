import Link from "next/link";
import { notFound } from "next/navigation";
import { FACULTY } from "@/lib/site";
import { getData, getDetail, groupsOf, img, list, roadmapOf, type Faculty, type Product, type Program } from "@/lib/public";
import { card, Checks, Dosen, Down, FokusBelajar, Head, Hero, Kontak, Produk, Sec, VisiMisi } from "@/components/public/DetailParts";
import Reveal from "@/components/public/Reveal";
import Roadmap from "@/components/public/Roadmap";
import ImmersionDocs, { docsOf } from "@/components/public/ImmersionDocs";

const hoverCard = "transition duration-300 hover:-translate-y-1 hover:border-[#1E6FD9]/40 hover:shadow-xl";

export default async function ProgramPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { data: p, status } = await getDetail<Program>(`/programs/${slug}`);
  if (status === 404) notFound();
  if (!p) return <Down status={status} />;
  if (FACULTY && p.faculty?.slug !== FACULTY) notFound(); // hanya prodi milik fakultas ini

  const [fac, products] = await Promise.all([
    p.faculty?.slug ? getData<Faculty>(`/faculties/${p.faculty.slug}`) : null,
    p.faculty?.slug ? getData<Product[]>(`/products?faculty=${p.faculty.slug}`) : null,
  ]);

  const careers = list(p.careerProspects);
  const mission = list(p.mission);
  const groups = groupsOf(p.courseGroups);
  const roadmap = roadmapOf(p.roadmap); // dari database (diisi lewat admin)
  const immersion = docsOf(p.immersionDocs); // BARU: dokumen kebutuhan immersion
  const produk = products ?? [];
  const info = [["Jenjang", p.level], ["Akreditasi", p.accreditation], ["Total SKS", p.totalSks], ["Lama Studi", p.studyDuration], ["Kurikulum", p.curriculumYear]].filter(([, v]) => v);
  const kurikulum = img(p.curriculumFile);

  let n = 0;
  const tint = () => n++ % 2 === 1;

  return (
    <>
      <Hero
        kicker={`Program Studi / ${p.level}`}
        title={p.name}
        sub={p.faculty && <Link href={FACULTY ? "/" : `/fakultas/${p.faculty.slug}`} className="underline">{p.faculty.name}</Link>}
        image={p.heroImage}
      />

      <Sec tint={tint()}>
        <Reveal>
          <Head eye="Pengenalan" title="Deskripsi Program Studi" />
          <p className="max-w-3xl whitespace-pre-line text-[15px] leading-relaxed text-[#3A4D6E]">{p.profile}</p>
        </Reveal>
        {info.length > 0 && (
          <dl className="mt-8 grid grid-cols-2 gap-5 md:grid-cols-4">
            {info.map(([k, v], i) => (
              <Reveal key={String(k)} delay={i * 100}>
                <div className={`${card} h-full ${hoverCard}`} style={{ padding: 16 }}>
                  <dt className="text-xs text-[#47608F]">{k}</dt>
                  <dd className="mt-1 font-bold text-[#0B2A5E]">{String(v)}</dd>
                </div>
              </Reveal>
            ))}
          </dl>
        )}
        {kurikulum && (
          <Reveal delay={200}>
            <a href={kurikulum} target="_blank" rel="noreferrer" className="mt-6 inline-block rounded-[10px] bg-[#1E6FD9] px-6 py-3 text-[15px] font-semibold text-white transition duration-300 hover:-translate-y-0.5 hover:bg-[#1559B8] hover:shadow-lg">Unduh Kurikulum (PDF)</a>
          </Reveal>
        )}
      </Sec>

      {/* Roadmap studi, hanya tampil kalau sudah diisi di admin */}
      {roadmap.length > 0 && (
        <Sec id="roadmap" tint={tint()}>
          <Reveal><Head eye="Perjalanan Studi" title="Roadmap Studi Semester 1-8" /></Reveal>
          <Roadmap data={roadmap} />
        </Sec>
      )}

      {/* BARU: dokumen kebutuhan immersion, hanya tampil kalau sudah diunggah di admin */}
      {immersion.length > 0 && (
        <Sec id="immersion" tint={tint()}>
          <Reveal><Head eye="Immersion" title="Dokumen Kebutuhan Immersion" /></Reveal>
          <Reveal delay={100}><ImmersionDocs items={immersion} /></Reveal>
        </Sec>
      )}

      {groups.length > 0 && <Sec tint={tint()}><Reveal><Head eye="Kurikulum" title="Fokus Pembelajaran" /></Reveal><Reveal delay={100}><FokusBelajar groups={groups} /></Reveal></Sec>}
      {produk.length > 0 && <Sec tint={tint()}><Reveal><Head eye="Produk" title="Produk yang Dihasilkan" /></Reveal><Reveal delay={100}><Produk items={produk} /></Reveal></Sec>}
      {careers.length > 0 && <Sec tint={tint()}><Reveal><Head eye="Setelah Lulus" title="Prospek Karir" /><Checks items={careers} /></Reveal></Sec>}
      {(p.vision || mission.length > 0) && <Sec tint={tint()}><Reveal><Head eye="Arah dan Tujuan" title="Visi dan Misi" /><VisiMisi vision={p.vision} mission={mission} /></Reveal></Sec>}
      <Sec tint={tint()}><Reveal><Head eye="Pengajar" title="Dosen Program Studi" /></Reveal><Reveal delay={100}><Dosen items={p.lecturers ?? []} /></Reveal></Sec>
      <Kontak email={p.email ?? fac?.email} phone={fac?.phone} />
    </>
  );
}
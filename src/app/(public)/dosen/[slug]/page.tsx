/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { notFound } from "next/navigation";
import { FACULTY } from "@/lib/site";
import { withDummy } from "@/lib/dummy";
import {
    educationOf, getData, getDetail, img, initials, lecturerKey, list, researchOf,
    type Faculty, type Lecturer,
} from "@/lib/public";
import { card, Down, Hero, Sec, tag } from "@/components/public/DetailParts";

export default async function LecturerPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;

    // Sementara dicari dari daftar dosen. Setelah backend punya GET /lecturers/:slug, ganti ke getDetail(`/lecturers/${slug}`).
    const { data, status } = await getDetail<Lecturer[]>("/lecturers");
    if (!data) return <Down status={status} />;

    const found = data.find((l) => lecturerKey(l) === decodeURIComponent(slug));
    if (!found) notFound();

    // Website fakultas hanya boleh menampilkan dosen dari program studinya sendiri
    if (FACULTY) {
        const fac = await getData<Faculty>(`/faculties/${FACULTY}`);
        if (!fac?.programs?.some((p) => p.slug === found.studyProgram?.slug)) notFound();
    }

    const l = withDummy(found);
    const photo = img(l.photo);
    const education = educationOf(l.education);
    const expertise = list(l.expertise);
    const research = researchOf(l.research);
    const prodi = l.studyProgram ? `${l.studyProgram.level} ${l.studyProgram.name}` : "";

    const info: [string, string][] = [
        ["NIDN", l.nidn ?? ""],
        ["Program Studi", prodi],
        ["Email", l.email ?? ""],
    ];

    return (
        <>
            <Hero kicker="Profil Dosen" title={l.name} sub={[l.position, prodi].filter(Boolean).join(" · ")} />

            <Sec>
                <Link href="/#dosen" className="mb-8 inline-block text-sm font-bold text-[#1559B8]">← Kembali ke daftar dosen</Link>

                <div className="grid gap-8 md:grid-cols-[280px_1fr]">
                    <aside className="space-y-5">
                        <div className={card} style={{ padding: 12 }}>
                            {photo ? (
                                <img src={photo} alt={l.name} className="w-full rounded-xl object-cover" style={{ aspectRatio: "3 / 4" }} />
                            ) : (
                                <div className="flex w-full items-center justify-center rounded-xl bg-[#EAF2FF] text-5xl font-extrabold text-[#0B3D91]" style={{ aspectRatio: "3 / 4" }}>
                                    {initials(l.name)}
                                </div>
                            )}
                        </div>

                        <dl className={`${card} space-y-4`}>
                            {info.filter(([, v]) => v).map(([k, v]) => (
                                <div key={k}>
                                    <dt className="text-xs text-[#47608F]">{k}</dt>
                                    <dd className="mt-1 break-words font-bold text-[#0B2A5E]">{v}</dd>
                                </div>
                            ))}
                        </dl>

                        {l.scholarUrl && (
                            <a href={l.scholarUrl} target="_blank" rel="noreferrer" className="block rounded-[10px] bg-[#1E6FD9] px-6 py-3 text-center text-[15px] font-semibold text-white transition hover:bg-[#1559B8]">
                                Lihat Profil Sinta / Scholar
                            </a>
                        )}
                    </aside>

                    <div className="space-y-10">
                        {l.bio && (
                            <div>
                                <p className={`${tag} mb-3`}>Tentang</p>
                                <p className="max-w-2xl whitespace-pre-line text-[15px] leading-relaxed text-[#3A4D6E]">{l.bio}</p>
                            </div>
                        )}

                        {education.length > 0 && (
                            <div>
                                <p className={`${tag} mb-4`}>Riwayat Studi</p>
                                <ol className="space-y-4 border-l-2 border-[#DCE6F5] pl-6">
                                    {education.map((e, i) => (
                                        <li key={i} className="relative">
                                            <span className="absolute -left-[31px] top-1.5 h-3 w-3 rounded-full bg-[#1E6FD9]" />
                                            <p className="font-bold text-[#0B2A5E]">{e.degree} · {e.institution}</p>
                                            {e.year && <p className="text-[13px] text-[#47608F]">Lulus {e.year}</p>}
                                        </li>
                                    ))}
                                </ol>
                            </div>
                        )}

                        {expertise.length > 0 && (
                            <div>
                                <p className={`${tag} mb-3`}>Bidang Keahlian</p>
                                <div className="flex flex-wrap gap-2">
                                    {expertise.map((x) => (
                                        <span key={x} className="rounded-full bg-[#EAF2FF] px-4 py-1.5 text-sm font-semibold text-[#0B3D91]">{x}</span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {research.length > 0 && (
                            <div>
                                <p className={`${tag} mb-3`}>Hasil Penelitian</p>
                                <ul className={`${card} divide-y divide-[#DCE6F5] py-2`}>
                                    {research.map((r, i) => (
                                        <li key={i} className="flex gap-4 py-4">
                                            <span className="w-12 shrink-0 text-sm font-bold text-[#1559B8]">{r.year ?? "-"}</span>
                                            <div>
                                                <p className="text-[15px] font-semibold text-[#0B2A5E]">{r.title}</p>
                                                {r.link && <a href={r.link} target="_blank" rel="noreferrer" className="text-sm font-bold text-[#1559B8]">Lihat publikasi →</a>}
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            </Sec>
        </>
    );
}
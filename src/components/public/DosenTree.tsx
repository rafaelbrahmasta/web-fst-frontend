/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { img, initials, lecturerKey, roleOf, type Lecturer, type Prog } from "@/lib/public";
import { hoverCard, tag } from "./DetailParts";

const LINE = "bg-[#BFD0EE]";

type Tone = "root" | "lead" | "base";

/** Satu kotak dosen di bagan. Klik menuju /dosen/[slug]. */
function Node({ l, tone = "base" }: { l: Lecturer; tone?: Tone }) {
    const u = img(l.photo);
    const skin =
        tone === "root"
            ? "border-[#0B3D91] bg-[#0B3D91] text-white"
            : tone === "lead"
                ? "border-[#1E6FD9]/40 bg-[#EAF2FF] text-[#0B2A5E]"
                : "border-[#DCE6F5] bg-white text-[#0B2A5E]";
    const sub = tone === "root" ? "text-[#BFD6FF]" : "text-[#47608F]";
    return (
        <Link href={`/dosen/${lecturerKey(l)}`} className={`flex w-56 items-center gap-3 rounded-2xl border p-3 text-left ${skin} ${hoverCard}`}>
            {u ? (
                <img src={u} alt={l.name} className="h-12 w-12 shrink-0 rounded-full object-cover" />
            ) : (
                <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-sm font-extrabold ${tone === "root" ? "bg-white/15 text-white" : "bg-[#DCE6F5] text-[#0B3D91]"}`}>
                    {initials(l.name)}
                </span>
            )}
            <span className="min-w-0">
                <span className="line-clamp-2 block text-sm font-bold leading-snug">{l.name}</span>
                <span className={`block text-xs ${sub}`}>{l.position}</span>
            </span>
        </Link>
    );
}

/** Garis tegak dari induk ke percabangan. */
const Stem = () => <div className={`mx-auto h-6 w-px ${LINE}`} />;

/** Baris anak dengan garis cabang mendatar dan garis turun ke tiap anak. */
function Fork({ children }: { children: React.ReactNode[] }) {
    const n = children.length;
    return (
        <div className="flex justify-center">
            {children.map((c, i) => (
                <div key={i} className="relative px-3 pt-8">
                    <span className={`absolute left-1/2 top-0 h-8 w-px ${LINE}`} />
                    {n > 1 && (
                        <span className={`absolute top-0 h-px ${LINE} ${i === 0 ? "left-1/2 right-0" : i === n - 1 ? "left-0 right-1/2" : "left-0 right-0"}`} />
                    )}
                    {c}
                </div>
            ))}
        </div>
    );
}

/**
 * Bagan struktural: Dekan, Wakil Dekan, lalu cabang per program studi (Kaprodi dan dosen).
 * Posisi ditentukan dari teks jabatan dosen (lihat roleOf di lib/public.ts).
 */
export default function DosenTree({ items, programs }: { items: Lecturer[]; programs: Prog[] }) {
    if (items.length === 0) return <p className="text-[15px] text-slate-500">Data dosen belum tersedia.</p>;

    const dekan = items.filter((l) => roleOf(l.position) === "dekan");
    const wakil = items.filter((l) => roleOf(l.position) === "wakil");
    const rest = items.filter((l) => !["dekan", "wakil"].includes(roleOf(l.position)));

    const branches = programs
        .map((p) => {
            const mine = rest.filter((l) => l.studyProgram?.slug === p.slug);
            return {
                p,
                kaprodi: mine.filter((l) => roleOf(l.position) === "kaprodi"),
                dosen: mine.filter((l) => roleOf(l.position) === "dosen"),
            };
        })
        .filter((b) => b.kaprodi.length + b.dosen.length > 0);

    const prodiNodes = branches.map((b) => (
        <div key={b.p.id} className="flex w-56 flex-col items-center gap-3">
            <p className={`${tag} text-center`}>{b.p.level} {b.p.name}</p>
            {b.kaprodi.map((l) => <Node key={l.id} l={l} tone="lead" />)}
            {b.dosen.length > 0 && (
                <div className="flex flex-col gap-2 rounded-2xl bg-[#F4F8FF] p-2">
                    {b.dosen.map((l) => <Node key={l.id} l={l} />)}
                </div>
            )}
        </div>
    ));

    return (
        <div className="overflow-x-auto pb-4">
            <div className="mx-auto flex w-max min-w-full flex-col items-center">
                {dekan.length > 0 && (
                    <div className="flex flex-wrap justify-center gap-3">
                        {dekan.map((l) => <Node key={l.id} l={l} tone="root" />)}
                    </div>
                )}

                {wakil.length > 0 && (
                    <>
                        {dekan.length > 0 && <Stem />}
                        <Fork>{wakil.map((l) => <Node key={l.id} l={l} tone="lead" />)}</Fork>
                    </>
                )}

                {prodiNodes.length > 0 && (
                    <>
                        {(dekan.length > 0 || wakil.length > 0) && <Stem />}
                        {dekan.length > 0 || wakil.length > 0 ? <Fork>{prodiNodes}</Fork> : <div className="flex flex-wrap justify-center gap-6">{prodiNodes}</div>}
                    </>
                )}
            </div>
        </div>
    );
}
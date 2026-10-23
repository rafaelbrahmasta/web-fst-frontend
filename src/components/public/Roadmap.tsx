import { card } from "./DetailParts";
import Reveal from "./Reveal";
import type { SemesterPlan } from "@/lib/roadmap";

export default function Roadmap({ data }: { data: SemesterPlan[] }) {
    const tahun = [1, 2, 3, 4].map((t) => ({
        t,
        items: data.filter((s) => s.semester === t * 2 - 1 || s.semester === t * 2),
    })).filter((y) => y.items.length > 0);

    return (
        <div className="relative space-y-10">
            <div className="absolute bottom-0 left-[15px] top-2 hidden w-px bg-[#DCE6F5] md:block" />
            {tahun.map((y, yi) => (
                <Reveal key={y.t} delay={yi * 80}>
                    <div className="relative md:pl-12">
                        <span className="absolute left-0 top-0 hidden h-8 w-8 items-center justify-center rounded-full bg-[#1E6FD9] text-sm font-extrabold text-white shadow md:flex">{y.t}</span>
                        <p className="mb-4 text-xs font-bold uppercase tracking-[0.14em] text-[#1559B8]">Tahun {y.t}</p>
                        <div className="grid gap-5 md:grid-cols-2">
                            {y.items.map((s) => (
                                <div key={s.semester} className={`${card} h-full transition duration-300 hover:-translate-y-1 hover:border-[#1E6FD9]/40 hover:shadow-xl`}>
                                    <div className="mb-3 flex items-center gap-3">
                                        <span className="rounded-full bg-[#EAF2FF] px-3 py-1 text-xs font-bold text-[#0B3D91]">Semester {s.semester}</span>
                                        <span className="text-xs text-[#47608F]">{s.courses.length} mata kuliah</span>
                                    </div>
                                    <ul className="space-y-2">
                                        {s.courses.map((c) => (
                                            <li key={c} className="flex items-start gap-2 text-[15px] text-[#3A4D6E]">
                                                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#1E6FD9]" />
                                                <span>{c}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>
                </Reveal>
            ))}
        </div>
    );
}
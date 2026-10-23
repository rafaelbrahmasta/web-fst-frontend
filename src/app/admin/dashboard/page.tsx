"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

type Counts = { fakultas: number; prodi: number; dosen: number; berita: number; produk: number };

export default function DashboardPage() {
    const [counts, setCounts] = useState<Counts | null>(null);

    useEffect(() => {
        Promise.all([
            api<unknown[]>("/faculties"),
            api<unknown[]>("/programs"),
            api<unknown[]>("/lecturers"),
            api<{ meta: { total: number } }>("/posts/admin/list?limit=1"),
            api<unknown[]>("/products"),
        ]).then(([f, p, d, b, pr]) =>
            setCounts({ fakultas: f.length, prodi: p.length, dosen: d.length, berita: b.meta.total, produk: pr.length })
        );
    }, []);

    const cards = [
        { label: "Fakultas", value: counts?.fakultas },
        { label: "Program Studi", value: counts?.prodi },
        { label: "Dosen", value: counts?.dosen },
        { label: "Berita", value: counts?.berita },
        { label: "Produk", value: counts?.produk },
    ];

    return (
        <div>
            <h1 className="mb-6 text-2xl font-bold text-[#0B3D91]">Dashboard</h1>
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
                {cards.map((c) => (
                    <div key={c.label} className="rounded-xl bg-white p-5 shadow-sm">
                        <p className="text-sm text-gray-500">{c.label}</p>
                        <p className="mt-1 text-3xl font-bold text-[#1E6FD9]">{c.value ?? "..."}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
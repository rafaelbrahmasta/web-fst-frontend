"use client";

import CrudPage, { type CrudConfig } from "@/components/admin/CrudPage";
import { API_URL } from "@/lib/api";

const cfg: CrudConfig = {
    title: "Fasilitas",
    singular: "Fasilitas",
    basePath: "/facilities",
    columns: [
        {
            key: "image",
            label: "Foto",
            render: (r) =>
                r.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={`${API_URL}${r.image}`} alt="" className="h-10 w-16 rounded object-cover" />
                ) : (
                    "-"
                ),
        },
        { key: "name", label: "Nama" },
        { key: "description", label: "Deskripsi", render: (r) => <span className="line-clamp-1">{r.description ?? "-"}</span> },
    ],
    fields: [
        { name: "name", label: "Nama Fasilitas", type: "text", required: true, placeholder: "Contoh: Laboratorium Komputer" },
        { name: "description", label: "Deskripsi Singkat", type: "textarea", nullable: true, rows: 3 },
        { name: "image", label: "Foto", type: "image", nullable: true },
        { name: "sortOrder", label: "Urutan Tampil", type: "number", help: "Angka kecil tampil lebih dulu. Kosongkan untuk 0." },
        { name: "facultyId", label: "Fakultas", type: "select", required: true, optionsFrom: { path: "/faculties", label: (r) => r.name } },
    ],
};

export default function Page() {
    return <CrudPage cfg={cfg} />;
}
"use client";

import CrudPage, { type CrudConfig } from "@/components/admin/CrudPage";
import { FACULTY } from "@/lib/site";

const cfg: CrudConfig = {
    title: FACULTY ? "Profil Fakultas" : "Fakultas",
    singular: "Fakultas",
    basePath: "/faculties",
    // Di website satu fakultas, profil fakultas hanya diubah (tidak ditambah/dihapus)
    allowCreate: !FACULTY,
    allowDelete: !FACULTY,
    columns: [
        { key: "name", label: "Nama" },
        { key: "slug", label: "Slug" },
        { key: "programs", label: "Prodi", render: (r) => (Array.isArray(r.programs) ? r.programs.length : 0) },
    ],
    fields: [
        { name: "name", label: "Nama Fakultas", type: "text", required: true },
        { name: "englishName", label: "Nama Inggris", type: "text" },
        { name: "slug", label: "Slug", type: "text", help: "Kosongkan agar dibuat otomatis dari nama." },
        { name: "description", label: "Deskripsi", type: "textarea", required: true },
        { name: "vision", label: "Visi", type: "textarea" },
        { name: "mission", label: "Misi", type: "lines", help: "Satu misi per baris." },
        { name: "careerProspects", label: "Prospek Karir", type: "lines", help: "Satu prospek per baris." },
        { name: "heroImage", label: "Gambar Utama", type: "image" },
        {
            name: "aboutImage",
            label: "Foto Sekilas Tentang",
            type: "image",
            help: "Tampil di samping teks Sekilas Tentang Fakultas. Disarankan rasio 4:3 (contoh 1200x900 px).",
        },
        { name: "email", label: "Email", type: "text" },
        { name: "phone", label: "Telepon", type: "text" },
        { name: "instagram", label: "Instagram", type: "text" },
        { name: "youtube", label: "YouTube", type: "text" },
        {
            name: "strengths",
            label: "Keunggulan (JSON)",
            type: "json",
            help: 'Contoh: [{"title":"Akreditasi Unggul","description":"Penjelasan singkat"}]',
        },
    ],
};

export default function Page() {
    return <CrudPage cfg={cfg} />;
}
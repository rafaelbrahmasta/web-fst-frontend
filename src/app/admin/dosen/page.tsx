"use client";

import CrudPage, { type CrudConfig } from "@/components/admin/CrudPage";

const cfg: CrudConfig = {
    title: "Dosen",
    singular: "Dosen",
    basePath: "/lecturers",
    columns: [
        { key: "name", label: "Nama" },
        { key: "position", label: "Jabatan" },
        { key: "studyProgram", label: "Program Studi", render: (r) => r.studyProgram?.name ?? "-" },
    ],
    filters: [
        {
            key: "studyProgramId",
            label: "Program Studi",
            get: (r) => String(r.studyProgram?.id ?? ""),
            optionsFrom: { path: "/programs", label: (r) => `${r.level} ${r.name}` },
        },
    ],
    sort: (a, b) => String(a.studyProgram?.name ?? "").localeCompare(String(b.studyProgram?.name ?? "")) || String(a.name).localeCompare(String(b.name)),
    groupBy: (r) => (r.studyProgram ? `${r.studyProgram.level} ${r.studyProgram.name}` : "Tanpa program studi"),
    fields: [
        {
            name: "studyProgramId",
            label: "Program Studi",
            type: "select",
            required: true,
            optionsFrom: { path: "/programs", label: (r) => `${r.level} ${r.name}` },
        },
        { name: "name", label: "Nama", type: "text", required: true },
        {
            name: "position",
            label: "Jabatan",
            type: "text",
            required: true,
            help: 'Untuk muncul di bagan struktural, tulis persis "Dekan", "Wakil Dekan", atau "Kaprodi". Selain itu dianggap dosen biasa.',
        },
        { name: "nidn", label: "NIDN", type: "text", nullable: true },
        {
            name: "slug",
            label: "Slug (alamat halaman profil)",
            type: "text",
            nullable: true,
            help: "Contoh: budi-santoso. Huruf kecil, tanpa spasi. Kosongkan kalau belum perlu, alamat memakai nomor id.",
        },
        { name: "photo", label: "Foto", type: "image", nullable: true },
        { name: "email", label: "Email", type: "text", nullable: true },
        { name: "bio", label: "Profil Singkat", type: "textarea", nullable: true },
        { name: "scholarUrl", label: "Tautan Sinta / Google Scholar", type: "text", nullable: true, placeholder: "https://..." },
        { name: "expertise", label: "Bidang Keahlian", type: "lines", nullable: true, help: "Satu keahlian per baris" },
        {
            name: "education",
            label: "Riwayat Studi (JSON)",
            type: "json",
            nullable: true,
            rows: 6,
            placeholder: '[{"degree":"S2","institution":"Nama Kampus","year":"2014"}]',
            help: "Urutkan dari jenjang tertinggi. Kosongkan kalau belum ada.",
        },
        {
            name: "research",
            label: "Hasil Penelitian (JSON)",
            type: "json",
            nullable: true,
            rows: 6,
            placeholder: '[{"title":"Judul penelitian","year":"2024","link":"https://..."}]',
            help: "link boleh dihapus kalau tidak ada. Kosongkan kalau belum ada.",
        },
    ],
};

export default function Page() {
    return <CrudPage cfg={cfg} />;
}
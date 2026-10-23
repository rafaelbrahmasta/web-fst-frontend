"use client";

import CrudPage, { type CrudConfig, type Row } from "@/components/admin/CrudPage";

import { api } from "@/lib/api";

const cfg: CrudConfig = {
    title: "Program Studi",
    singular: "Program Studi",
    basePath: "/programs",
    // Daftar hanya berisi sebagian kolom, jadi data lengkap diambil saat tombol Ubah ditekan
    loadItem: (row) => api<Row>(`/programs/${row.slug}`),
    columns: [
        { key: "name", label: "Nama" },
        { key: "facultyId", label: "Fakultas", render: (r, c) => c.remote.facultyId?.find((o) => o.value === String(r.facultyId))?.label ?? "-" },
        { key: "level", label: "Jenjang" },
        { key: "accreditation", label: "Akreditasi" },
    ],
    filters: [
        { key: "facultyId", label: "Fakultas", optionsFrom: { path: "/faculties", label: (r) => r.name } },
        { key: "level", label: "Jenjang", options: ["D3", "D4", "S1", "S2", "S3"].map((v) => ({ value: v, label: v })) },
    ],
    // Urut per fakultas, lalu jenjang, lalu nama; tiap fakultas diberi judul kelompok
    sort: (a, b, c) => {
        const fak = (r: Row) => c.remote.facultyId?.find((o) => o.value === String(r.facultyId))?.label ?? "";
        return fak(a).localeCompare(fak(b)) || String(a.level).localeCompare(String(b.level)) || String(a.name).localeCompare(String(b.name));
    },
    groupBy: (r, c) => c.remote.facultyId?.find((o) => o.value === String(r.facultyId))?.label,
    fields: [
        {
            name: "facultyId",
            label: "Fakultas",
            type: "select",
            required: true,
            optionsFrom: { path: "/faculties", label: (r) => r.name },
        },
        { name: "name", label: "Nama Program Studi", type: "text", required: true },
        { name: "slug", label: "Slug", type: "text", help: "Kosongkan agar dibuat otomatis." },
        {
            name: "level",
            label: "Jenjang",
            type: "select",
            required: true,
            options: ["D3", "D4", "S1", "S2", "S3"].map((v) => ({ value: v, label: v })),
        },
        { name: "accreditation", label: "Akreditasi", type: "text" },
        { name: "profile", label: "Profil", type: "textarea", required: true },
        { name: "vision", label: "Visi", type: "textarea" },
        { name: "mission", label: "Misi", type: "lines", help: "Satu misi per baris." },
        { name: "totalSks", label: "Total SKS", type: "number" },
        { name: "studyDuration", label: "Lama Studi", type: "text", placeholder: "8 Semester" },
        { name: "curriculumYear", label: "Tahun Kurikulum", type: "text" },
        { name: "curriculumFile", label: "File Kurikulum (PDF)", type: "file" },
        { name: "careerProspects", label: "Prospek Karir", type: "lines", help: "Satu prospek per baris." },
        { name: "heroImage", label: "Gambar Utama", type: "image" },
        { name: "email", label: "Email", type: "text" },
        {
            name: "courseGroups",
            label: "Fokus Pembelajaran / Kelompok Mata Kuliah (JSON)",
            type: "json",
            help: 'Contoh: [{"title":"Pemrograman","courses":["Algoritma","Basis Data"]}]',
        },
        // BARU: roadmap studi per semester

        {
            name: "roadmap",
            label: "Roadmap Studi (Semester 1-8)",
            type: "semesters",
            help: "Satu mata kuliah per baris. Semester yang dikosongkan tidak ditampilkan di website.",
        },
        {
            name: "immersionDocs",
            label: "Dokumen Kebutuhan Immersion",
            type: "files",
            help: "Bisa unggah banyak file sekaligus (PDF, Word, Excel, PowerPoint, ZIP, gambar; maks. 20 MB per file).",
        },
        {
            name: "facilities",
            label: "Fasilitas (JSON)",
            type: "json",
            help: 'Contoh: [{"name":"Lab Komputer"}]',
        },
    ],
};

export default function Page() {
    return <CrudPage cfg={cfg} />;
}   
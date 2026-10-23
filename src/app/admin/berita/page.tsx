"use client";

import CrudPage, { type CrudConfig, type Row } from "@/components/admin/CrudPage";

import { api } from "@/lib/api";

const cfg: CrudConfig = {
    title: "Berita",
    singular: "Berita",
    basePath: "/posts",
    listPath: "/posts/admin/list",
    // Daftar admin tidak membawa isi berita. Berita terbit diambil lengkap; draft isinya dikosongkan.
    loadItem: async (row) => {
        try {
            return await api<Row>(`/posts/${row.slug}`);
        } catch {
            return { ...row, content: "" };
        }
    },
    columns: [
        { key: "title", label: "Judul" },
        { key: "category", label: "Kategori" },
        { key: "status", label: "Status" },
    ],
    fields: [
        { name: "title", label: "Judul", type: "text", required: true },
        { name: "slug", label: "Slug", type: "text", help: "Kosongkan agar dibuat otomatis." },
        {
            name: "category",
            label: "Kategori",
            type: "select",
            required: true,
            options: ["BERITA", "PENGUMUMAN", "AGENDA", "PRESTASI"].map((v) => ({ value: v, label: v })),
        },
        {
            name: "status",
            label: "Status",
            type: "select",
            required: true,
            options: [
                { value: "DRAFT", label: "DRAFT (disembunyikan)" },
                { value: "PUBLISHED", label: "PUBLISHED (tampil di website)" },
            ],
        },
        { name: "thumbnail", label: "Gambar", type: "image" },
        { name: "eventDate", label: "Tanggal Acara", type: "datetime", help: "Khusus kategori AGENDA." },
        {
            name: "content",
            label: "Isi",
            type: "textarea",
            rows: 10,
            help: "Wajib untuk berita baru. Boleh memakai tag HTML sederhana (<p>, <b>, <h2>). Saat mengubah draft, kosongkan jika isi tidak diganti.",
        },
        {
            name: "facultyId",
            label: "Fakultas",
            type: "select",
            nullable: true,
            optionsFrom: { path: "/faculties", label: (r) => r.name },
        },
        {
            name: "studyProgramId",
            label: "Program Studi",
            type: "select",
            nullable: true,
            optionsFrom: { path: "/programs", label: (r) => `${r.level} ${r.name}` },
        },
    ],
};

export default function Page() {
    return <CrudPage cfg={cfg} />;
}

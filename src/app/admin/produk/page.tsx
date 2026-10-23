"use client";

import CrudPage, { type CrudConfig, type Row } from "@/components/admin/CrudPage";

const cfg: CrudConfig = {
    title: "Produk",
    singular: "Produk",
    basePath: "/products",
    columns: [
        { key: "name", label: "Nama" },
        { key: "facultyId", label: "Fakultas", render: (r, c) => c.remote.facultyId?.find((o) => o.value === String(r.facultyId))?.label ?? "-" },
        { key: "usedBy", label: "Digunakan Oleh" },
        { key: "sortOrder", label: "Urutan" },
    ],
    filters: [{ key: "facultyId", label: "Fakultas", optionsFrom: { path: "/faculties", label: (r) => r.name } }],
    sort: (a, b, c) => {
        const fak = (r: Row) => c.remote.facultyId?.find((o) => o.value === String(r.facultyId))?.label ?? "";
        return fak(a).localeCompare(fak(b)) || Number(a.sortOrder) - Number(b.sortOrder) || String(a.name).localeCompare(String(b.name));
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
        { name: "name", label: "Nama Produk", type: "text", required: true },
        { name: "slug", label: "Slug", type: "text", help: "Kosongkan agar dibuat otomatis." },
        { name: "description", label: "Deskripsi", type: "textarea", required: true },
        { name: "image", label: "Gambar", type: "image" },
        { name: "usedBy", label: "Digunakan Oleh", type: "text", placeholder: "Digunakan oleh kampus" },
        { name: "link", label: "Tautan", type: "text", help: "Harus diawali http://, https://, atau /" },
        { name: "sortOrder", label: "Urutan Tampil", type: "number" },
    ],
};

export default function Page() {
    return <CrudPage cfg={cfg} />;
}

"use client";

import CrudPage, { type CrudConfig } from "@/components/admin/CrudPage";

const ROLE_LABEL: Record<string, string> = {
    SUPER_ADMIN: "Super Admin",
    ADMIN: "Admin"
};

const cfg: CrudConfig = {
    title: "Akun Admin",
    singular: "Akun",
    basePath: "/users",
    columns: [
        { key: "name", label: "Nama" },
        { key: "email", label: "Email / Username" },
        { key: "role", label: "Peran", render: (r) => ROLE_LABEL[r.role] ?? r.role },
    ],
    fields: [
        { name: "name", label: "Nama", type: "text", required: true },
        { name: "email", label: "Email / Username", type: "text", required: true, help: "Dipakai untuk login." },
        {
            name: "password",
            label: "Password",
            type: "text",
            help: "Minimal 8 karakter. Wajib saat menambah akun. Saat mengubah, kosongkan kalau password tidak diganti.",
        },
        {
            name: "role",
            label: "Peran",
            type: "select",
            required: true,
            options: [
                { value: "ADMIN", label: "Admin (Berita, Produk, Galeri, Fasilitas)" },
                { value: "SUPER_ADMIN", label: "Super Admin (semua menu)" },
            ],
        },
    ],
};

export default function Page() {
    return <CrudPage cfg={cfg} />;
}
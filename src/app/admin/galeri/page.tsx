"use client";

import CrudPage, { type CrudConfig } from "@/components/admin/CrudPage";
import { API_URL } from "@/lib/api";

const cfg: CrudConfig = {
    title: "Galeri",
    singular: "Foto",
    basePath: "/galleries",
    columns: [
        {
            key: "imageUrl",
            label: "Foto",
            render: (r) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={`${API_URL}${r.imageUrl}`} alt="" className="h-10 w-16 rounded object-cover" />
            ),
        },
        { key: "title", label: "Judul" },
    ],
    fields: [
        { name: "title", label: "Judul", type: "text", required: true },
        { name: "imageUrl", label: "Foto", type: "image", required: true },
    ],
};

export default function Page() {
    return <CrudPage cfg={cfg} />;
}
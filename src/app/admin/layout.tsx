"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { api, clearToken, getToken } from "@/lib/api";
import { FACULTY } from "@/lib/site";

type Me = { role?: string; user?: { role?: string } };

// superOnly = hanya SUPER_ADMIN. Backend tetap yang menjaga akses; menu ini hanya merapikan tampilan.
const menu: { href: string; label: string; superOnly?: boolean }[] = [
    { href: "/admin/dashboard", label: "Dashboard" },
    { href: "/admin/fakultas", label: FACULTY ? "Profil Fakultas" : "Fakultas", superOnly: true },
    { href: "/admin/prodi", label: "Program Studi", superOnly: true },
    { href: "/admin/dosen", label: "Dosen", superOnly: true },
    { href: "/admin/berita", label: "Berita" },
    { href: "/admin/produk", label: "Produk" },
    { href: "/admin/galeri", label: "Galeri" },
    { href: "/admin/fasilitas", label: "Fasilitas" },
    { href: "/admin/akun", label: "Akun Admin", superOnly: true },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const [ready, setReady] = useState(false);
    const [role, setRole] = useState("");
    const isLogin = pathname === "/admin/login";

    useEffect(() => {
        if (isLogin) {
            setReady(true);
            return;
        }
        if (!getToken()) {
            router.replace("/admin/login");
            return;
        }
        api<Me>("/auth/me")
            .then((me) => {
                setRole(me?.role ?? me?.user?.role ?? "");
                setReady(true);
            })
            .catch(() => {
                clearToken();
                router.replace("/admin/login");
            });
    }, [isLogin, router]);

    // Admin biasa yang membuka alamat menu khusus Super Admin diarahkan ke Dashboard
    useEffect(() => {
        if (!ready || !role || role === "SUPER_ADMIN") return;
        if (menu.some((m) => m.superOnly && pathname.startsWith(m.href))) router.replace("/admin/dashboard");
    }, [ready, role, pathname, router]);

    if (isLogin) return <>{children}</>;
    if (!ready) return <div className="p-8 text-gray-500">Memuat...</div>;

    // Kalau role tidak terbaca, tampilkan semua menu; backend tetap menolak aksi yang tidak diizinkan
    const items = menu.filter((m) => !m.superOnly || !role || role === "SUPER_ADMIN");

    return (
        <div className="flex min-h-screen bg-gray-50">
            <aside className="w-60 shrink-0 bg-[#0B3D91] p-4 text-white">
                <p className="px-2 text-lg font-bold">Admin Fakultas</p>
                {role ? (
                    <p className="mb-6 px-2 text-xs text-[#BFD6FF]">{role === "SUPER_ADMIN" ? "Super Admin" : "Admin"}</p>
                ) : (
                    <div className="mb-6" />
                )}
                <nav className="space-y-1">
                    {items.map((m) => (
                        <Link
                            key={m.href}
                            href={m.href}
                            className={`block rounded-lg px-3 py-2 text-sm ${pathname.startsWith(m.href) ? "bg-[#1E6FD9] font-semibold" : "hover:bg-white/10"
                                }`}
                        >
                            {m.label}
                        </Link>
                    ))}
                </nav>
                <button
                    onClick={() => {
                        clearToken();
                        router.replace("/admin/login");
                    }}
                    className="mt-6 w-full rounded-lg border border-white/30 px-3 py-2 text-left text-sm hover:bg-white/10"
                >
                    Keluar
                </button>
            </aside>
            <main className="flex-1 p-8">{children}</main>
        </div>
    );
}
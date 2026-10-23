import Link from "next/link";
import type { Metadata } from "next";
import localFont from "next/font/local";
import { FACULTY } from "@/lib/site";
import { getData, type Faculty } from "@/lib/public";
import StickyHeader from "@/components/public/StickyHeader";

const font = localFont({ src: "../../fonts/PlusJakartaSans.woff2", weight: "200 800", display: "swap" });

// ===== Ubah teks di bagian ini =====
const NAMA = "Universitas Pignatelli Triputra";
const SINGKATAN = "UPT";
const DAFTAR_URL = "#"; // ganti dengan alamat pendaftaran yang sebenarnya

type MenuItem = {
  label: string;
  href: string;
  children?: { label: string; href: string }[];
};

// Bar atas, hanya tampil di website universitas (saat slug fakultas kosong)
const TOP = [
  { label: "Berita Terkini", href: "/berita" },
  { label: "Fakultas", href: "/#fakultas" },
  { label: "Prestasi", href: "/#prestasi" },
  { label: "Kehidupan Kampus", href: "/#kehidupan-kampus" },
];

// Menu website universitas
const MENU: MenuItem[] = [
  { label: "Tentang", href: "/#visi-misi" },
  { label: "Akademik", href: "/#fakultas" },
  { label: "Produk", href: "/#produk" },
  { label: "Kehidupan Kampus", href: "/#kehidupan-kampus" },
];

// Menu website fakultas: dropdown Program Studi otomatis dari data API
const menuFakultas = (f: Faculty | null): MenuItem[] => [
  { label: "Tentang", href: "/#tentang" },
  {
    label: "Program Studi",
    href: "/#prodi",
    children: (f?.programs ?? []).map((p) => ({ label: p.name, href: `/prodi/${p.slug}` })),
  },
  { label: "Produk", href: "/#produk" },
  { label: "Prestasi", href: "/#prestasi" },
  { label: "Berita", href: "/#berita" },
  { label: "Galeri", href: "/#galeri" },
  { label: "Dosen", href: "/#dosen" },
];

const loadFaculty = () => (FACULTY ? getData<Faculty>(`/faculties/${FACULTY}`) : Promise.resolve(null));

export async function generateMetadata(): Promise<Metadata> {
  const f = await loadFaculty();
  return { title: f ? `${f.name} | ${NAMA}` : NAMA };
}

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const f = await loadFaculty();
  const judul = f?.name ?? NAMA;
  const menu = FACULTY ? menuFakultas(f) : MENU;

  return (
    <div className={`${font.className} flex min-h-screen flex-col bg-white text-[#1B2A44]`}>
      <StickyHeader>
        {!FACULTY && (
          <div className="bg-[#0A2A66] py-2">
            <div className="mx-auto flex max-w-6xl flex-wrap gap-x-5 px-6">
              {TOP.map((t) => (
                <Link key={t.label} href={t.href} className="text-xs font-semibold text-white">
                  {t.label}
                </Link>
              ))}
            </div>
          </div>
        )}
        <header className="border-b border-[#DCE6F5]">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-4">
            <Link href="/" className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-[#0B3D91] text-[13px] font-extrabold text-white">
                {SINGKATAN}
              </span>
              <span className="text-sm font-extrabold uppercase leading-tight text-[#0B2A5E]">{judul}</span>
            </Link>

            <nav className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm font-medium">
              {menu.map((m) =>
                m.children && m.children.length > 0 ? (
                  <div key={m.label} className="group relative">
                    <button
                      type="button"
                      className="flex items-center gap-1 font-medium transition-colors hover:text-[#1E6FD9] focus:outline-none"
                    >
                      {m.label}
                      <svg
                        className="h-3.5 w-3.5 transition-transform group-hover:rotate-180 group-focus-within:rotate-180"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.23 7.21a.75.75 0 011.06.02L10 11.17l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                    <div className="invisible absolute left-0 top-full z-50 pt-3 opacity-0 transition duration-150 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                      <ul className="min-w-64 rounded-xl border border-[#DCE6F5] bg-white p-2 shadow-lg">
                        {m.children.map((c) => (
                          <li key={c.label}>
                            <Link
                              href={c.href}
                              className="block rounded-lg px-4 py-2.5 text-sm font-medium text-[#1B2A44] transition-colors hover:bg-[#EEF4FD] hover:text-[#0B3D91]"
                            >
                              {c.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ) : (
                  <Link key={m.label} href={m.href} className="transition-colors hover:text-[#1E6FD9]">
                    {m.label}
                  </Link>
                )
              )}
            </nav>

            <a href={DAFTAR_URL} className="rounded-[10px] bg-[#1E6FD9] px-5 py-3 text-sm font-semibold text-white">
              Daftar Sekarang
            </a>
          </div>
        </header>
      </StickyHeader>

      <main className="flex-1">{children}</main>

      <footer className="bg-[#0A2A66] text-[#DCE6F5]">
        <div className="mx-auto max-w-6xl px-6 py-10">
          <p className="font-extrabold text-white">{judul}</p>
          {f && <p className="mt-1 text-sm">{NAMA}</p>}
          <p className="mt-6 text-[13px] text-[#9FB7E0]">
            © {new Date().getFullYear()} {NAMA}
          </p>
        </div>
      </footer>
    </div>
  );
}
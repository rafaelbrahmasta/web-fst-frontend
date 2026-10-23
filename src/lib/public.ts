export const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

/* ===================== Tipe data ===================== */

export type Prog = { id: number; name: string; slug: string; level: string };
export type Strength = { icon?: string; title: string; description: string };
export type Faculty = {
  id: number; name: string; englishName?: string | null; slug: string; description: string;
  vision?: string | null; mission?: unknown; careerProspects?: unknown; strengths?: unknown;
  heroImage?: string | null; aboutImage?: string | null;
  email?: string | null; phone?: string | null; programs?: Prog[];
};

export type Education = { degree: string; institution: string; year?: string };
export type Research = { title: string; year?: string; link?: string };

export type Lecturer = {
  id: number; name: string; position: string; photo?: string | null; email?: string | null;
  studyProgram?: { id: number; name: string; slug: string; level: string };
  // BARU: kolom ini diisi lewat admin (tahap 2). Sebelum itu, dilengkapi data contoh dari lib/dummy.ts
  slug?: string | null;
  nidn?: string | null;
  bio?: string | null;
  scholarUrl?: string | null;
  expertise?: unknown;   // string[]
  education?: unknown;   // Education[]
  research?: unknown;    // Research[]
};

export type Program = Prog & {
  accreditation?: string | null; profile: string; vision?: string | null; mission?: unknown;
  totalSks?: number | null; studyDuration?: string | null; curriculumYear?: string | null;
  curriculumFile?: string | null; careerProspects?: unknown; heroImage?: string | null;
  email?: string | null; courseGroups?: unknown; roadmap?: unknown; immersionDocs?: unknown;
  faculty?: { name: string; slug: string }; lecturers?: Lecturer[];
};
export type Post = {
  id: number; title: string; slug: string; excerpt?: string; content?: string; thumbnail?: string | null;
  category: string; publishedAt?: string | null; author?: { name: string }; faculty?: { name: string; slug: string } | null;
};
export type PostList = { data: Post[]; meta: { page: number; totalPages: number; total: number } };
export type Product = {
  id: number; name: string; slug: string; description: string; image?: string | null;
  usedBy?: string | null; link?: string | null; facultyId: number;
};
export type GalleryItem = { id: number; title: string; imageUrl: string };
// BARU: fasilitas fakultas
export type Facility = { id: number; name: string; description?: string | null; image?: string | null };

/* ===================== Ambil data ===================== */

/** Ambil data dari backend. Mengembalikan null kalau gagal / tidak ditemukan. */
export async function getData<T>(path: string): Promise<T | null> {
  try {
    const r = await fetch(`${API}/api${path}`, { cache: "no-store" });
    return r.ok ? ((await r.json()) as T) : null;
  } catch {
    return null;
  }
}

/** Seperti getData, tapi membawa kode status agar 404 asli bisa dibedakan dari error server. */
export async function getDetail<T>(path: string): Promise<{ data: T | null; status: number }> {
  try {
    const r = await fetch(`${API}/api${path}`, { cache: "no-store" });
    return { data: r.ok ? ((await r.json()) as T) : null, status: r.status };
  } catch {
    return { data: null, status: 0 };
  }
}

/* ===================== Helper umum ===================== */

/** Ubah path upload (/uploads/...) menjadi URL lengkap. */
export const img = (p?: string | null) => (!p ? null : p.startsWith("http") ? p : `${API}${p}`);
export const tgl = (d?: string | null) => (d ? new Date(d).toLocaleDateString("id-ID", { dateStyle: "long" }) : "");
/** Pastikan field JSON (misi, prospek karir) berupa array teks. */
export const list = (x: unknown): string[] => (Array.isArray(x) ? x.filter((i) => typeof i === "string") : []);
/** Pastikan field keunggulan berupa array {title, description}. */
export const strengthsOf = (x: unknown): Strength[] =>
  Array.isArray(x) ? x.filter((i) => i && typeof i.title === "string" && typeof i.description === "string") : [];

export type CourseGroup = { title: string; courses: string[] };
/** Pastikan field kelompok mata kuliah berupa array {title, courses[]}. */
export const groupsOf = (x: unknown): CourseGroup[] =>
  Array.isArray(x)
    ? x.filter((g) => g && typeof g.title === "string").map((g) => ({
      title: g.title as string,
      courses: Array.isArray(g.courses) ? (g.courses as unknown[]).filter((c): c is string => typeof c === "string") : [],
    }))
    : [];

export type SemesterPlan = { semester: number; courses: string[] };
/** Pastikan field roadmap berupa array {semester, courses[]}, urut semester, semester kosong dibuang. */
export const roadmapOf = (x: unknown): SemesterPlan[] => {
  let data: unknown = x;
  // Beberapa database mengembalikan kolom JSON sebagai teks, jadi di-parse dulu
  if (typeof x === "string") {
    try {
      data = JSON.parse(x);
    } catch {
      return [];
    }
  }
  return Array.isArray(data)
    ? data
      .filter((s) => s && s.semester != null)
      .map((s) => ({
        semester: Number(s.semester),
        courses: Array.isArray(s.courses) ? (s.courses as unknown[]).filter((c): c is string => typeof c === "string") : [],
      }))
      .filter((s) => !isNaN(s.semester) && s.courses.length > 0)
      .sort((a, b) => a.semester - b.semester)
    : [];
};

/* ===================== Helper dosen ===================== */

/** Pastikan riwayat pendidikan berupa array {degree, institution, year?}. */
export const educationOf = (x: unknown): Education[] =>
  Array.isArray(x)
    ? x
      .filter((e) => e && typeof e.degree === "string" && typeof e.institution === "string")
      .map((e) => ({ degree: e.degree as string, institution: e.institution as string, year: e.year != null ? String(e.year) : undefined }))
    : [];

/** Pastikan hasil penelitian berupa array {title, year?, link?}. */
export const researchOf = (x: unknown): Research[] =>
  Array.isArray(x)
    ? x
      .filter((r) => r && typeof r.title === "string")
      .map((r) => ({
        title: r.title as string,
        year: r.year != null ? String(r.year) : undefined,
        link: typeof r.link === "string" && r.link ? r.link : undefined,
      }))
    : [];

/** Kunci URL dosen: pakai slug kalau ada, kalau belum pakai id. */
export const lecturerKey = (l: Pick<Lecturer, "id" | "slug">) => l.slug || String(l.id);

/** Dua huruf awal nama, untuk foto pengganti. */
export const initials = (name: string) =>
  name.split(" ").filter(Boolean).slice(0, 2).map((w) => w[0]).join("").toUpperCase();

export type Role = "dekan" | "wakil" | "kaprodi" | "dosen";
/** Tentukan posisi di bagan dari teks jabatan yang diisi admin. */
export const roleOf = (position?: string | null): Role => {
  const p = (position ?? "").toLowerCase();
  if (/wakil|wadek/.test(p)) return "wakil";
  if (/kaprodi|ketua program|kepala program/.test(p)) return "kaprodi";
  if (/dekan/.test(p)) return "dekan";
  return "dosen";
};
import { educationOf, list, researchOf, type Facility, type Lecturer } from "@/lib/public";

/**
 * DATA CONTOH SEMENTARA, hanya untuk melihat tampilan sebelum admin dan backend siap.
 * Matikan dengan USE_DUMMY = false setelah data asli diisi lewat admin (tahap 2).
 */
export const USE_DUMMY = true;

export const DUMMY_FACILITIES: Facility[] = [
    { id: 1, name: "Laboratorium Komputer", description: "Komputer dan jaringan untuk praktikum pemrograman, basis data, dan jaringan." },
    { id: 2, name: "Perpustakaan", description: "Koleksi buku, jurnal, dan ruang baca yang nyaman untuk belajar." },
    { id: 3, name: "Ruang Kelas Modern", description: "Ruang kuliah dengan proyektor dan pendingin ruangan." },
    { id: 4, name: "Area Wi-Fi Kampus", description: "Akses internet di seluruh area kampus untuk kuliah dan riset." },
    { id: 5, name: "Ruang Diskusi Mahasiswa", description: "Tempat belajar kelompok dan mengerjakan proyek bersama." },
    { id: 6, name: "Laboratorium Riset", description: "Fasilitas penelitian untuk dosen dan mahasiswa tingkat akhir." },
];

const DUMMY_PROFILE = {
    nidn: "0000000000",
    bio: "Dosen yang aktif mengajar dan meneliti. Teks ini contoh dan akan diganti dengan profil singkat yang diisi admin.",
    education: [
        { degree: "S3", institution: "Nama Universitas", year: "2022" },
        { degree: "S2", institution: "Nama Universitas", year: "2014" },
        { degree: "S1", institution: "Nama Universitas", year: "2011" },
    ],
    expertise: ["Rekayasa Perangkat Lunak", "Basis Data", "Kecerdasan Buatan"],
    research: [
        { title: "Judul penelitian contoh pertama", year: "2024" },
        { title: "Judul penelitian contoh kedua", year: "2023" },
    ],
};

/** Lengkapi field dosen yang masih kosong dengan data contoh (hanya kalau USE_DUMMY aktif). */
export function withDummy(l: Lecturer): Lecturer {
    if (!USE_DUMMY) return l;
    return {
        ...l,
        nidn: l.nidn || DUMMY_PROFILE.nidn,
        bio: l.bio || DUMMY_PROFILE.bio,
        education: educationOf(l.education).length ? l.education : DUMMY_PROFILE.education,
        expertise: list(l.expertise).length ? l.expertise : DUMMY_PROFILE.expertise,
        research: researchOf(l.research).length ? l.research : DUMMY_PROFILE.research,
    };
}
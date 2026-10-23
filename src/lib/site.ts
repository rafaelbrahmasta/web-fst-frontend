/**
 * Slug fakultas untuk website ini. Kosong = website universitas (semua fakultas).
 * Diisi lewat NEXT_PUBLIC_FACULTY_SLUG (terbaca juga oleh dashboard admin), atau FACULTY_SLUG.
 */
export const FACULTY = (
  process.env.NEXT_PUBLIC_FACULTY_SLUG ||
  process.env.FACULTY_SLUG ||
  "fst"
).trim();

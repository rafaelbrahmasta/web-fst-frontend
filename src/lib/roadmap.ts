export type SemesterPlan = { semester: number; courses: string[] };

// GANTI isi tiap semester dengan mata kuliah asli dari kurikulum.
const contoh = (): SemesterPlan[] =>
    Array.from({ length: 8 }, (_, i) => ({
        semester: i + 1,
        courses: ["Mata kuliah 1 (ganti)", "Mata kuliah 2 (ganti)", "Mata kuliah 3 (ganti)", "Mata kuliah 4 (ganti)", "Mata kuliah 5 (ganti)"],
    }));

export const ROADMAP: Record<string, SemesterPlan[]> = {
    "s1-informatika": contoh(),
    "s1-rekayasa-perangkat-lunak": contoh(),
    "s1-sistem-informasi": contoh(),
};
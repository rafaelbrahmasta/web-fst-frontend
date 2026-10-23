"use client";

import { Fragment, useCallback, useEffect, useState } from "react";
import { api, API_URL, ApiError } from "@/lib/api";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Row = Record<string, any>;

export type Field = {
    name: string;
    label: string;
    // "semesters" = roadmap per semester, "files" = banyak dokumen (immersion)
    type: "text" | "textarea" | "number" | "select" | "image" | "file" | "lines" | "json" | "datetime" | "semesters" | "files";
    required?: boolean;
    nullable?: boolean;
    rows?: number;
    help?: string;
    placeholder?: string;
    options?: { value: string; label: string }[];
    optionsFrom?: { path: string; label: (row: Row) => string };
};

export type Ctx = { remote: Record<string, Option[]> };

export type Column = { key: string; label: string; render?: (row: Row, ctx: Ctx) => React.ReactNode };

/** Filter dropdown di atas tabel. Nilai dibandingkan dengan row[key], atau hasil get(row) bila diisi. */
export type Filter = {
    key: string;
    label: string;
    options?: Option[];
    optionsFrom?: { path: string; label: (row: Row) => string };
    get?: (row: Row) => string;
};

export type CrudConfig = {
    title: string;
    singular: string;
    basePath: string;
    listPath?: string;
    columns: Column[];
    fields: Field[];
    loadItem?: (row: Row) => Promise<Row>;
    filters?: Filter[];
    sort?: (a: Row, b: Row, ctx: Ctx) => number;
    /** Mengembalikan nama kelompok; baris dengan kelompok sama diberi judul. undefined = tanpa kelompok. */
    groupBy?: (row: Row, ctx: Ctx) => string | undefined;
    /** false = sembunyikan tombol Tambah / Hapus (bawaan: tampil). */
    allowCreate?: boolean;
    allowDelete?: boolean;
};

type Option = { value: string; label: string };

type Doc = { title: string; url: string; fileName?: string; size?: number };

const inputCls =
    "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#1E6FD9]";

function toArray(res: unknown): Row[] {
    if (Array.isArray(res)) return res as Row[];
    if (res && typeof res === "object" && "data" in res) {
        const d = (res as { data: unknown }).data;
        if (Array.isArray(d)) return d as Row[];
    }
    return [];
}

function toLocalInput(v: unknown) {
    if (!v) return "";
    const d = new Date(String(v));
    if (isNaN(d.getTime())) return "";
    const p = (n: number) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`;
}

function toForm(fields: Field[], item: Row | null) {
    const v: Record<string, string> = {};
    for (const f of fields) {
        const raw = item?.[f.name];
        if (f.type === "lines") v[f.name] = Array.isArray(raw) ? raw.join("\n") : "";
        else if (f.type === "json") v[f.name] = raw == null ? "" : JSON.stringify(raw, null, 2);
        else if (f.type === "datetime") v[f.name] = toLocalInput(raw);
        // roadmap -> 8 kotak, disimpan sementara sebagai JSON array berisi 8 teks
        else if (f.type === "semesters") {
            const arr = Array.from({ length: 8 }, (_, i) => {
                const s = Array.isArray(raw) ? raw.find((x: { semester: number }) => x.semester === i + 1) : null;
                return Array.isArray(s?.courses) ? s.courses.join("\n") : "";
            });
            v[f.name] = JSON.stringify(arr);
        }
        // dokumen -> disimpan sementara sebagai JSON array berisi { title, url, fileName, size }
        else if (f.type === "files") v[f.name] = JSON.stringify(Array.isArray(raw) ? raw : []);
        else v[f.name] = raw == null ? "" : String(raw);
    }
    return v;
}

function buildPayload(fields: Field[], values: Record<string, string>) {
    const out: Record<string, unknown> = {};
    for (const f of fields) {
        const raw = (values[f.name] ?? "").trim();
        if (!raw) {
            if (f.required) throw new Error(`${f.label} wajib diisi`);
            if (f.nullable) out[f.name] = null;
            continue;
        }
        switch (f.type) {
            case "number":
                out[f.name] = Number(raw);
                break;
            case "select":
                out[f.name] = f.optionsFrom ? Number(raw) : raw;
                break;
            case "lines":
                out[f.name] = raw.split("\n").map((s) => s.trim()).filter(Boolean);
                break;
            case "json":
                try {
                    out[f.name] = JSON.parse(raw);
                } catch {
                    throw new Error(`${f.label}: format JSON tidak valid`);
                }
                break;
            case "datetime":
                out[f.name] = new Date(raw).toISOString();
                break;
            // kirim sebagai [{ semester, courses }], semester kosong dibuang
            case "semesters": {
                let arr: string[] = [];
                try {
                    arr = JSON.parse(raw);
                } catch {
                    arr = [];
                }
                out[f.name] = arr
                    .map((t, i) => ({
                        semester: i + 1,
                        courses: String(t).split("\n").map((s) => s.trim()).filter(Boolean),
                    }))
                    .filter((s) => s.courses.length > 0);
                break;
            }
            // kirim daftar dokumen; array kosong = semua dokumen dihapus
            case "files": {
                let docs: Doc[] = [];
                try {
                    docs = JSON.parse(raw);
                } catch {
                    docs = [];
                }
                out[f.name] = Array.isArray(docs) ? docs : [];
                break;
            }
            default:
                out[f.name] = raw;
        }
    }
    return out;
}

function describeError(e: unknown) {
    if (e instanceof ApiError) {
        const d = e.details;
        if (Array.isArray(d) && d.length) {
            return d
                .map((i: { path?: unknown[]; message?: string }) => `${(i.path ?? []).join(".")}: ${i.message}`)
                .join("; ");
        }
        return e.message;
    }
    return e instanceof Error ? e.message : "Terjadi kesalahan";
}

export default function CrudPage({ cfg }: { cfg: CrudConfig }) {
    const [rows, setRows] = useState<Row[]>([]);
    const [meta, setMeta] = useState<{ page: number; totalPages: number } | null>(null);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [mode, setMode] = useState<null | "new" | "edit">(null);
    const [current, setCurrent] = useState<Row | null>(null);
    const [values, setValues] = useState<Record<string, string>>({});
    const [formError, setFormError] = useState("");
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState("");
    const [remote, setRemote] = useState<Record<string, Option[]>>({});
    const [filterVals, setFilterVals] = useState<Record<string, string>>({});

    const load = useCallback(async () => {
        setLoading(true);
        setError("");
        try {
            const path = cfg.listPath ?? cfg.basePath;
            const sep = path.includes("?") ? "&" : "?";
            const res = await api<unknown>(`${path}${sep}page=${page}&limit=20`);
            setRows(toArray(res));
            const m = res && typeof res === "object" && "meta" in res ? (res as { meta: { page: number; totalPages: number } }).meta : null;
            setMeta(m);
        } catch (e) {
            setError(describeError(e));
        } finally {
            setLoading(false);
        }
    }, [cfg, page]);

    useEffect(() => {
        void load();
    }, [load]);

    useEffect(() => {
        const jobs = [
            ...cfg.fields.filter((f) => f.optionsFrom).map((f) => ({ key: f.name, from: f.optionsFrom! })),
            ...(cfg.filters ?? []).filter((f) => f.optionsFrom).map((f) => ({ key: `filter:${f.key}`, from: f.optionsFrom! })),
        ];
        jobs.forEach(async ({ key, from }) => {
            try {
                const res = await api<unknown>(from.path);
                const opts = toArray(res).map((r) => ({ value: String(r.id), label: from.label(r) }));
                setRemote((prev) => ({ ...prev, [key]: opts }));
            } catch {
                /* pilihan kosong */
            }
        });
    }, [cfg]);

    const ctx: Ctx = { remote };
    const shown = rows
        .filter((r) =>
            (cfg.filters ?? []).every((f) => {
                const want = filterVals[f.key];
                if (!want) return true;
                return (f.get ? f.get(r) : String(r[f.key] ?? "")) === want;
            }),
        )
        .sort((a, b) => (cfg.sort ? cfg.sort(a, b, ctx) : 0));

    function openNew() {
        setFormError("");
        setCurrent(null);
        const init = toForm(cfg.fields, null);
        // Pilihan yang hanya punya satu opsi (mis. satu-satunya fakultas) langsung dipilihkan
        cfg.fields.forEach((f) => {
            const opts = remote[f.name];
            if (f.type === "select" && f.optionsFrom && !init[f.name] && opts?.length === 1) init[f.name] = opts[0].value;
        });
        setValues(init);
        setMode("new");
    }

    async function openEdit(row: Row) {
        setFormError("");
        setError("");
        try {
            const full = cfg.loadItem ? await cfg.loadItem(row) : row;
            setCurrent(full);
            setValues(toForm(cfg.fields, full));
            setMode("edit");
        } catch (e) {
            setError(describeError(e));
        }
    }

    async function upload(f: Field, file: File) {
        setUploading(f.name);
        setFormError("");
        try {
            const fd = new FormData();
            fd.append("file", file);
            const res = await api<{ url: string }>(f.type === "file" ? "/uploads/document" : "/uploads/image", {
                method: "POST",
                body: fd,
            });
            setValues((v) => ({ ...v, [f.name]: res.url }));
        } catch (e) {
            setFormError(describeError(e));
        } finally {
            setUploading("");
        }
    }

    // Upload banyak dokumen sekaligus (jumlah file tidak dibatasi)
    async function uploadMany(f: Field, files: FileList) {
        setUploading(f.name);
        setFormError("");
        try {
            const fd = new FormData();
            Array.from(files).forEach((file) => fd.append("files", file));
            const res = await api<Doc[]>("/immersion/upload", {
                method: "POST",
                body: fd,
            });
            setValues((v) => {
                let cur: Doc[] = [];
                try {
                    cur = JSON.parse(v[f.name] || "[]");
                } catch {
                    cur = [];
                }
                return { ...v, [f.name]: JSON.stringify([...cur, ...res]) };
            });
        } catch (e) {
            setFormError(describeError(e));
        } finally {
            setUploading("");
        }
    }

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        setFormError("");
        setSaving(true);
        try {
            const payload = buildPayload(cfg.fields, values);
            const isEdit = mode === "edit";
            await api(isEdit ? `${cfg.basePath}/${current!.id}` : cfg.basePath, {
                method: isEdit ? "PUT" : "POST",
                body: JSON.stringify(payload),
            });
            setMode(null);
            await load();
        } catch (err) {
            setFormError(describeError(err));
        } finally {
            setSaving(false);
        }
    }

    async function onDelete(row: Row) {
        if (!window.confirm(`Hapus ${cfg.singular.toLowerCase()} ini? Tindakan ini tidak dapat dibatalkan.`)) return;
        try {
            await api(`${cfg.basePath}/${row.id}`, { method: "DELETE" });
            await load();
        } catch (e) {
            setError(describeError(e));
        }
    }

    function renderField(f: Field) {
        const val = values[f.name] ?? "";
        const set = (v: string) => setValues((prev) => ({ ...prev, [f.name]: v }));
        let input: React.ReactNode;

        switch (f.type) {
            case "textarea":
            case "lines":
            case "json":
                input = (
                    <textarea
                        value={val}
                        onChange={(e) => set(e.target.value)}
                        rows={f.rows ?? (f.type === "json" ? 6 : f.type === "lines" ? 4 : 4)}
                        placeholder={f.placeholder}
                        className={`${inputCls} ${f.type === "json" ? "font-mono text-xs" : ""}`}
                    />
                );
                break;
            case "select": {
                const opts = f.options ?? remote[f.name] ?? [];
                input = (
                    <select value={val} onChange={(e) => set(e.target.value)} className={inputCls}>
                        <option value="">{f.required ? "Pilih..." : "- Tidak ada -"}</option>
                        {opts.map((o) => (
                            <option key={o.value} value={o.value}>
                                {o.label}
                            </option>
                        ))}
                    </select>
                );
                break;
            }
            case "image":
            case "file":
                input = (
                    <div>
                        {val && f.type === "image" && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={`${API_URL}${val}`} alt="" className="mb-2 h-24 rounded-lg object-cover" />
                        )}
                        {val && f.type === "file" && (
                            <a href={`${API_URL}${val}`} target="_blank" rel="noreferrer" className="mb-2 block text-sm text-[#1E6FD9] underline">
                                Lihat file saat ini
                            </a>
                        )}
                        <input
                            type="file"
                            accept={f.type === "image" ? "image/jpeg,image/png,image/webp" : "application/pdf"}
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) void upload(f, file);
                            }}
                            className="text-sm"
                        />
                        {uploading === f.name && <p className="mt-1 text-xs text-gray-500">Mengunggah...</p>}
                    </div>
                );
                break;
            // delapan kotak Semester 1-8
            case "semesters": {
                let arr: string[] = [];
                try {
                    arr = JSON.parse(val || "[]");
                } catch {
                    arr = [];
                }
                while (arr.length < 8) arr.push("");
                input = (
                    <div className="grid gap-3 sm:grid-cols-2">
                        {arr.slice(0, 8).map((t, i) => (
                            <div key={i}>
                                <p className="mb-1 text-xs font-semibold text-[#0B3D91]">Semester {i + 1}</p>
                                <textarea
                                    value={t}
                                    rows={5}
                                    placeholder="Satu mata kuliah per baris"
                                    onChange={(e) => {
                                        const next = [...arr];
                                        next[i] = e.target.value;
                                        set(JSON.stringify(next));
                                    }}
                                    className={inputCls}
                                />
                            </div>
                        ))}
                    </div>
                );
                break;
            }
            // daftar dokumen: judul bisa diedit, bisa dilihat dan dihapus, bisa tambah banyak file
            case "files": {
                let docs: Doc[] = [];
                try {
                    docs = JSON.parse(val || "[]");
                } catch {
                    docs = [];
                }
                const save = (next: Doc[]) => set(JSON.stringify(next));
                input = (
                    <div className="space-y-2">
                        {docs.map((d, i) => (
                            <div key={`${d.url}-${i}`} className="flex items-center gap-2 rounded-lg border border-gray-200 p-2">
                                <input
                                    value={d.title}
                                    placeholder="Judul dokumen"
                                    onChange={(e) => save(docs.map((x, j) => (j === i ? { ...x, title: e.target.value } : x)))}
                                    className={inputCls}
                                />
                                <a
                                    href={`${API_URL}${d.url}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="whitespace-nowrap text-sm text-[#1E6FD9] underline"
                                >
                                    Lihat
                                </a>
                                <button
                                    type="button"
                                    onClick={() => save(docs.filter((_, j) => j !== i))}
                                    className="text-sm text-red-600 hover:underline"
                                >
                                    Hapus
                                </button>
                            </div>
                        ))}
                        <input
                            type="file"
                            multiple
                            accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.zip,.jpg,.jpeg,.png"
                            onChange={(e) => {
                                const files = e.target.files;
                                if (files && files.length > 0) void uploadMany(f, files);
                                e.target.value = "";
                            }}
                            className="text-sm"
                        />
                        {uploading === f.name && <p className="text-xs text-gray-500">Mengunggah...</p>}
                    </div>
                );
                break;
            }
            case "datetime":
                input = <input type="datetime-local" value={val} onChange={(e) => set(e.target.value)} className={inputCls} />;
                break;
            case "number":
                input = <input type="number" value={val} onChange={(e) => set(e.target.value)} className={inputCls} />;
                break;
            default:
                input = (
                    <input value={val} onChange={(e) => set(e.target.value)} placeholder={f.placeholder} className={inputCls} />
                );
        }

        return (
            <div key={f.name} className="mb-4">
                <label className="mb-1 block text-sm font-medium text-gray-700">
                    {f.label}
                    {f.required && <span className="text-red-500"> *</span>}
                </label>
                {input}
                {f.help && <p className="mt-1 text-xs text-gray-500">{f.help}</p>}
            </div>
        );
    }

    return (
        <div>
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-2xl font-bold text-[#0B3D91]">{cfg.title}</h1>
                {cfg.allowCreate !== false && (
                    <button
                        onClick={openNew}
                        className="rounded-lg bg-[#1E6FD9] px-4 py-2 text-sm font-semibold text-white hover:bg-[#0B3D91]"
                    >
                        + Tambah {cfg.singular}
                    </button>
                )}
            </div>

            {error && <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}

            {cfg.filters && cfg.filters.length > 0 && (
                <div className="mb-4 flex flex-wrap items-end gap-3">
                    {cfg.filters.map((f) => (
                        <label key={f.key} className="w-56 text-sm">
                            <span className="mb-1 block font-medium text-gray-700">{f.label}</span>
                            <select
                                value={filterVals[f.key] ?? ""}
                                onChange={(e) => setFilterVals((p) => ({ ...p, [f.key]: e.target.value }))}
                                className={inputCls}
                            >
                                <option value="">Semua</option>
                                {(f.options ?? remote[`filter:${f.key}`] ?? []).map((o) => (
                                    <option key={o.value} value={o.value}>
                                        {o.label}
                                    </option>
                                ))}
                            </select>
                        </label>
                    ))}
                    {Object.values(filterVals).some(Boolean) && (
                        <button type="button" onClick={() => setFilterVals({})} className="rounded-lg border border-gray-300 px-3 py-2 text-sm hover:bg-gray-50">
                            Reset
                        </button>
                    )}
                    <p className="ml-auto text-sm text-gray-500">
                        Menampilkan {shown.length} dari {rows.length}
                    </p>
                </div>
            )}

            <div className="overflow-x-auto rounded-xl bg-white shadow-sm">
                <table className="w-full text-left text-sm">
                    <thead className="bg-[#EAF2FF] text-[#0B3D91]">
                        <tr>
                            {cfg.columns.map((c) => (
                                <th key={c.key} className="px-4 py-3 font-semibold">
                                    {c.label}
                                </th>
                            ))}
                            <th className="px-4 py-3 text-right font-semibold">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={cfg.columns.length + 1} className="px-4 py-6 text-gray-500">
                                    Memuat...
                                </td>
                            </tr>
                        ) : rows.length === 0 ? (
                            <tr>
                                <td colSpan={cfg.columns.length + 1} className="px-4 py-6 text-gray-500">
                                    Belum ada data.
                                </td>
                            </tr>
                        ) : shown.length === 0 ? (
                            <tr>
                                <td colSpan={cfg.columns.length + 1} className="px-4 py-6 text-gray-500">
                                    Tidak ada data yang cocok dengan filter.
                                </td>
                            </tr>
                        ) : (
                            shown.map((row, i) => {
                                const g = cfg.groupBy?.(row, ctx);
                                const newGroup = g !== undefined && (i === 0 || cfg.groupBy!(shown[i - 1], ctx) !== g);
                                return (
                                    <Fragment key={row.id}>
                                        {newGroup && (
                                            <tr className="bg-[#F4F8FF]">
                                                <td colSpan={cfg.columns.length + 1} className="px-4 py-2 text-xs font-bold uppercase tracking-wide text-[#0B3D91]">
                                                    {g} · {shown.filter((r) => cfg.groupBy!(r, ctx) === g).length} data
                                                </td>
                                            </tr>
                                        )}
                                        <tr className="border-t border-gray-100">
                                            {cfg.columns.map((c) => (
                                                <td key={c.key} className="px-4 py-3 text-gray-800">
                                                    {c.render ? c.render(row, ctx) : String(row[c.key] ?? "-")}
                                                </td>
                                            ))}
                                            <td className="whitespace-nowrap px-4 py-3 text-right">
                                                <button onClick={() => void openEdit(row)} className="mr-3 text-[#1E6FD9] hover:underline">
                                                    Ubah
                                                </button>
                                                {cfg.allowDelete !== false && (
                                                    <button onClick={() => void onDelete(row)} className="text-red-600 hover:underline">
                                                        Hapus
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    </Fragment>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>

            {meta && meta.totalPages > 1 && (
                <div className="mt-4 flex items-center justify-end gap-3 text-sm">
                    <button
                        disabled={page <= 1}
                        onClick={() => setPage((p) => p - 1)}
                        className="rounded-lg border px-3 py-1.5 disabled:opacity-40"
                    >
                        Sebelumnya
                    </button>
                    <span>
                        Halaman {meta.page} dari {meta.totalPages}
                    </span>
                    <button
                        disabled={page >= meta.totalPages}
                        onClick={() => setPage((p) => p + 1)}
                        className="rounded-lg border px-3 py-1.5 disabled:opacity-40"
                    >
                        Berikutnya
                    </button>
                </div>
            )}

            {mode && (
                <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 p-4">
                    <form onSubmit={onSubmit} className="my-8 w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl">
                        <h2 className="mb-5 text-xl font-bold text-[#0B3D91]">
                            {mode === "new" ? "Tambah" : "Ubah"} {cfg.singular}
                        </h2>
                        {cfg.fields.map(renderField)}
                        {formError && <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{formError}</p>}
                        <div className="flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => setMode(null)}
                                className="rounded-lg border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50"
                            >
                                Batal
                            </button>
                            <button
                                disabled={saving || !!uploading}
                                className="rounded-lg bg-[#1E6FD9] px-5 py-2 text-sm font-semibold text-white hover:bg-[#0B3D91] disabled:opacity-60"
                            >
                                {saving ? "Menyimpan..." : "Simpan"}
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}
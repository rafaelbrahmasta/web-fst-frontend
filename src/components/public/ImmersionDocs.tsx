import { img } from "@/lib/public";

export type Doc = { title?: string; url: string; fileName?: string; size?: number };

/** Pastikan field dokumen immersion berupa array {title, url, fileName?, size?}. */
export function docsOf(x: unknown): Doc[] {
  let data: unknown = x;
  if (typeof x === "string") {
    try {
      data = JSON.parse(x);
    } catch {
      return [];
    }
  }
  return Array.isArray(data) ? data.filter((d) => d && typeof d.url === "string") : [];
}

function sizeText(bytes?: number) {
  if (!bytes) return "";
  return bytes < 1024 * 1024 ? `${Math.round(bytes / 1024)} KB` : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function ImmersionDocs({ items }: { items: Doc[] }) {
  return (
    <ul className="space-y-3">
      {items.map((d, i) => (
        <li key={`${d.url}-${i}`}>
          <a
            href={img(d.url) ?? "#"}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-between gap-4 rounded-[10px] border border-[#D6E4FF] bg-white p-4 transition duration-300 hover:-translate-y-0.5 hover:border-[#1E6FD9]/40 hover:shadow-lg"
          >
            <span className="font-semibold text-[#0B2A5E]">{d.title || d.fileName || "Dokumen"}</span>
            <span className="whitespace-nowrap text-sm text-[#1E6FD9]">{sizeText(d.size)} Unduh</span>
          </a>
        </li>
      ))}
    </ul>
  );
}
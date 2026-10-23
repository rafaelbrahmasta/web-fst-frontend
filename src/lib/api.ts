export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

export function getToken() {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("token");
}
export function setToken(token: string) {
    localStorage.setItem("token", token);
}
export function clearToken() {
    localStorage.removeItem("token");
}

export class ApiError extends Error {
    status: number;
    details: unknown;
    constructor(message: string, status: number, details?: unknown) {
        super(message);
        this.status = status;
        this.details = details;
    }
}

export async function api<T>(path: string, options: RequestInit = {}): Promise<T> {
    const headers = new Headers(options.headers);
    if (options.body && !(options.body instanceof FormData) && !headers.has("Content-Type")) {
        headers.set("Content-Type", "application/json");
    }
    const token = getToken();
    if (token) headers.set("Authorization", `Bearer ${token}`);

    const res = await fetch(`${API_URL}/api${path}`, { ...options, headers, cache: "no-store" });
    const data = await res.json().catch(() => null);
    if (!res.ok) throw new ApiError(data?.message ?? "Terjadi kesalahan", res.status, data?.errors);
    return data as T;
}
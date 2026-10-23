"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api, setToken } from "@/lib/api";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            const res = await api<{ token: string }>("/auth/login", {
                method: "POST",
                body: JSON.stringify({ email, password }),
            });
            setToken(res.token);
            router.push("/admin/dashboard");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Gagal login");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-[#EAF2FF] p-4">
            <form onSubmit={onSubmit} className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-lg">
                <h1 className="text-2xl font-bold text-[#0B3D91]">Login Admin</h1>
                <p className="mb-6 text-sm text-gray-500">Website Fakultas</p>

                <label className="mb-1 block text-sm font-medium text-gray-700">Username</label>
                <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mb-4 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-[#1E6FD9]"
                    autoComplete="username"
                    required
                />

                <label className="mb-1 block text-sm font-medium text-gray-700">Password</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mb-4 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-[#1E6FD9]"
                    autoComplete="current-password"
                    required
                />

                {error && <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}

                <button
                    disabled={loading}
                    className="w-full rounded-lg bg-[#1E6FD9] py-2.5 font-semibold text-white hover:bg-[#0B3D91] disabled:opacity-60"
                >
                    {loading ? "Memproses..." : "Masuk"}
                </button>
            </form>
        </div>
    );
}
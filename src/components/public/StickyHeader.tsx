"use client";

import { useEffect, useRef, useState } from "react";

export default function StickyHeader({ children }: { children: React.ReactNode }) {
    const [scrolled, setScrolled] = useState(false);
    const [height, setHeight] = useState(0);
    const ref = useRef<HTMLDivElement>(null);

    // Deteksi gulir: tambahkan bayangan setelah halaman digulir
    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 10);
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    // Ukur tinggi navbar agar konten di bawahnya tidak tertutup
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const update = () => setHeight(el.offsetHeight);
        update();
        const ro = new ResizeObserver(update);
        ro.observe(el);
        return () => ro.disconnect();
    }, []);

    return (
        <>
            {/* Pengganti ruang navbar, karena navbar bersifat fixed */}
            <div aria-hidden="true" style={{ height }} />
            <div
                ref={ref}
                className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ease-out ${scrolled
                        ? "bg-white/90 shadow-lg shadow-[#0B3D91]/10 backdrop-blur-md"
                        : "bg-white shadow-none"
                    }`}
            >
                {children}
            </div>
        </>
    );
}
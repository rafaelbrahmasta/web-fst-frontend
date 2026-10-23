import { notFound } from "next/navigation";
import { FACULTY } from "@/lib/site";
import FacultySite from "@/components/public/FacultySite";

export default async function FacultyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (FACULTY && slug !== FACULTY) notFound(); // website fakultas hanya menampilkan fakultasnya sendiri
  return <FacultySite slug={slug} />;
}

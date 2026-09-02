import type { Metadata } from "next";
import { NoteList } from "@/components/note-list";
import { getNotes } from "@/content/load-notes";

export const metadata: Metadata = {
  title: { absolute: "hpcnotes.eu" },
  description:
    "Short notes on high-performance computing: Slurm, MPI, GPUs, I/O, and the habits that transfer between clusters.",
};

export default function HomePage() {
  return <NoteList notes={getNotes()} grouped />;
}

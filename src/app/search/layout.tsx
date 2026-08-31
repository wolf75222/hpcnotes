import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Search",
  description: "Search HPC Wiki articles, blog posts, and section landings.",
};

export default function SearchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

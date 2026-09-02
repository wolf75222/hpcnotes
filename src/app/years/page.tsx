import type { Metadata } from "next";
import { VStack } from "@astryxdesign/core/Stack";
import { PageHeading } from "@/components/page-heading";
import { LeaderRow } from "@/components/leader-row";
import { getYears } from "@/content/catalog";

export const metadata: Metadata = {
  title: "Years",
  description: "Browse hpcnotes.eu by year.",
};

export default function YearsPage() {
  const years = getYears();

  return (
    <VStack gap={8}>
      <PageHeading
        title="Years"
        summary="The same notes, cut by calendar instead of by tag."
        trail={[
          { href: "/", label: "notes" },
          { label: "years", current: true },
        ]}
      />
      <VStack gap={4}>
        {years.map(({ year, count }) => (
          <LeaderRow
            key={year}
            href={`/years/${year}`}
            label={year}
            meta={count === 1 ? "1 note" : `${count} notes`}
          />
        ))}
      </VStack>
    </VStack>
  );
}

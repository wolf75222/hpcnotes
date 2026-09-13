import { Link } from "@astryxdesign/core/Link";
import { JsonLd } from "@/components/json-ld";
import { LegalDoc, LegalP, LegalSection } from "@/components/legal-doc";
import { webPageJsonLd } from "@/lib/json-ld";
import {
  LEGAL_UPDATED_ISO,
  TERMS_DESCRIPTION,
  TERMS_TITLE,
} from "@/lib/legal";
import { pageMetadata } from "@/lib/page-metadata";

export const metadata = pageMetadata({
  title: TERMS_TITLE,
  description: TERMS_DESCRIPTION,
  path: "/terms",
});

export default function TermsPage() {
  return (
    <>
      <JsonLd
        data={webPageJsonLd({
          name: TERMS_TITLE,
          description: TERMS_DESCRIPTION,
          path: "/terms",
          dateModified: LEGAL_UPDATED_ISO,
        })}
      />
      <LegalDoc title={TERMS_TITLE}>
        <LegalSection title="The notes">
          <LegalP>
            hpcnotes.eu publishes personal notes on high-performance computing.
            They are a private record that happens to be public, not the
            documentation of a computing centre, a vendor, or a scheduler.
            Commands, job scripts, and numbers are examples. They are not a
            promise that the same command is safe on your machine.
          </LegalP>
        </LegalSection>
        <LegalSection title="No warranty">
          <LegalP>
            The site is offered as-is. The operator does not warrant that a note
            is complete, current, or fit for a production cluster. Hardware,
            modules, and queue policy change. Check the system you actually have.
          </LegalP>
        </LegalSection>
        <LegalSection title="Your cluster, your risk">
          <LegalP>
            Running a command from a note is your decision. Do not treat the
            login node as a workstation. Do not start a long job, a GPU kernel,
            or a write-heavy workflow because a paragraph on this site looks
            familiar. If a job fills a disk, overruns walltime, or bothers
            other users, that is between you and the centre, not this site.
          </LegalP>
        </LegalSection>
        <LegalSection title="Intellectual property">
          <LegalP>
            The operator retains copyright in the notes, the design, and the
            generated share images. You may quote a short passage with a link
            to the page. You may not copy the site as a whole, republish a note
            as your own, or present the text as official documentation. Third
            party marks (Slurm, MPI, and the rest) belong to their owners.
          </LegalP>
        </LegalSection>
        <LegalSection title="Acceptable use">
          <LegalP>
            Do not use the site to break the law, to attack the host, or to
            overload the origin. Automated readers are welcome when they follow{" "}
            <Link href="/robots.txt" color="secondary" hasUnderline>
              robots.txt
            </Link>{" "}
            and prefer the Markdown copies. Do not scrape in a way that crowds
            out people.
          </LegalP>
        </LegalSection>
        <LegalSection title="Advertising">
          <LegalP>
            Advertisements may appear when the operator has enabled them. They
            are labeled. The{" "}
            <Link href="/privacy" color="secondary" hasUnderline>
              privacy policy
            </Link>{" "}
            describes cookies in that case. The operator does not endorse an
            advertiser&apos;s product.
          </LegalP>
        </LegalSection>
        <LegalSection title="Liability">
          <LegalP>
            To the extent the law allows, the operator is not liable for loss of
            data, wasted allocation, or any other damage that follows from
            reading or relying on a note. Some jurisdictions do not allow certain
            exclusions; in those places the remaining terms still apply.
          </LegalP>
        </LegalSection>
        <LegalSection title="Changes">
          <LegalP>
            The operator may change these terms. The date at the top of the
            page is the date of the current text. Continued use after a change is
            acceptance of the new text.
          </LegalP>
        </LegalSection>
        <LegalSection title="Governing law">
          <LegalP>
            These terms are governed by the laws of France, without regard to
            conflict-of-law rules. If a court finds a clause unenforceable, the
            rest remains in force.
          </LegalP>
        </LegalSection>
      </LegalDoc>
    </>
  );
}

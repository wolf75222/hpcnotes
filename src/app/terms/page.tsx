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
        <LegalSection title="Everything you see is open">
          <LegalP>
            Everything you see here is open. Nothing on this site belongs to
            me. The notes are not reserved, not a product, not a company
            property. Quote them, copy them, reuse them. Names like Slurm or
            MPI still belong to their owners.
          </LegalP>
        </LegalSection>
        <LegalSection title="Not a centre handbook">
          <LegalP>
            They are personal notes, not official documentation. A command or a
            number is an example. It is not a promise that the same line is safe
            on your machine.
          </LegalP>
        </LegalSection>
        <LegalSection title="Your cluster, your risk">
          <LegalP>
            As-is. Running a command from a note is your decision. Do not treat
            the login node as a workstation. A full disk or a blown walltime is
            between you and the centre.
          </LegalP>
        </LegalSection>
        <LegalSection title="The host">
          <LegalP>
            Do not knock the origin over. Readers and crawlers are welcome.
            Prefer the Markdown copies. See the{" "}
            <Link href="/privacy" color="secondary" hasUnderline>
              privacy policy
            </Link>{" "}
            for logs and ads.
          </LegalP>
        </LegalSection>
      </LegalDoc>
    </>
  );
}

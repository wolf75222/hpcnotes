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
        <LegalSection title="The notes are open">
          <LegalP>
            Everything you see here is open. The notes are not reserved. They
            do not belong to a company, and they are not claimed as exclusive
            property. Quote them, copy them, reuse them. Third-party names
            (Slurm, MPI, and the rest) still belong to their owners.
          </LegalP>
        </LegalSection>
        <LegalSection title="Not a centre handbook">
          <LegalP>
            They are personal notes, not the documentation of a computing centre,
            a vendor, or a scheduler. A command, a script, or a number is an
            example, not a promise that the same line is safe on your machine.
          </LegalP>
        </LegalSection>
        <LegalSection title="Your cluster, your risk">
          <LegalP>
            The site is offered as-is. Running a command from a note is your
            decision. Do not treat the login node as a workstation. If a job
            fills a disk, overruns walltime, or bothers other users, that is
            between you and the centre.
          </LegalP>
        </LegalSection>
        <LegalSection title="The host">
          <LegalP>
            Do not use the site to break the law or to knock the origin over.
            Automated readers are welcome when they follow{" "}
            <Link href="/robots.txt" color="secondary" hasUnderline>
              robots.txt
            </Link>{" "}
            and prefer the Markdown copies.
          </LegalP>
        </LegalSection>
        <LegalSection title="Advertising">
          <LegalP>
            Ads may appear if they are turned on. They are labeled. The{" "}
            <Link href="/privacy" color="secondary" hasUnderline>
              privacy policy
            </Link>{" "}
            is the rest of that story. An advertiser is not an endorsement.
          </LegalP>
        </LegalSection>
      </LegalDoc>
    </>
  );
}

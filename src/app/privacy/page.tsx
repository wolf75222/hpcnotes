import { Link } from "@astryxdesign/core/Link";
import { JsonLd } from "@/components/json-ld";
import { LegalDoc, LegalP, LegalSection } from "@/components/legal-doc";
import { getAdSenseConfig } from "@/lib/ads";
import { webPageJsonLd } from "@/lib/json-ld";
import {
  LEGAL_UPDATED_ISO,
  PRIVACY_DESCRIPTION,
  PRIVACY_TITLE,
} from "@/lib/legal";
import { pageMetadata } from "@/lib/page-metadata";

export const metadata = pageMetadata({
  title: PRIVACY_TITLE,
  description: PRIVACY_DESCRIPTION,
  path: "/privacy",
});

export default function PrivacyPage() {
  const ads = getAdSenseConfig();

  return (
    <>
      <JsonLd
        data={webPageJsonLd({
          name: PRIVACY_TITLE,
          description: PRIVACY_DESCRIPTION,
          path: "/privacy",
          dateModified: LEGAL_UPDATED_ISO,
        })}
      />
      <LegalDoc title={PRIVACY_TITLE}>
        <LegalSection title="Everything is public">
          <LegalP>
            Everything you see on hpcnotes.eu is public. The notes, the
            Markdown copies, the feed. There is no account, no login, and no
            private corner. Nothing here is held back.
          </LegalP>
        </LegalSection>
        <LegalSection title="Nothing on you">
          <LegalP>
            The site does not keep a file on you. A host may log a request
            (time, path, a coarse location from the IP, a user agent) to serve
            the pages and to stop abuse. That is not sold and it is not a
            profile.
          </LegalP>
        </LegalSection>
        <LegalSection title="Cookies">
          <LegalP>
            The notes do not need cookies. The host may set one for security.
            There is no analytics product.
          </LegalP>
        </LegalSection>
        <LegalSection title="Advertising">
          {ads.isConfigured ? (
            <LegalP>
              Google AdSense is on. Google may set cookies and collect data to
              show ads. Their policies cover that. Ads are labeled.
            </LegalP>
          ) : (
            <LegalP>
              No advertisements and no advertising cookies right now. If that
              changes, this page will say so.
            </LegalP>
          )}
        </LegalSection>
        <LegalSection title="The notes">
          <LegalP>
            The{" "}
            <Link href="/terms" color="secondary" hasUnderline>
              terms
            </Link>{" "}
            are the rest: everything you see is open, and nothing here belongs
            to me.
          </LegalP>
        </LegalSection>
      </LegalDoc>
    </>
  );
}

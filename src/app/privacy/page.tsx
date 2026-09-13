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
        <LegalSection title="Open notes">
          <LegalP>
            Everything on hpcnotes.eu is public on purpose: the notes, the
            Markdown copies, the feed, the sitemap. There is no account, no
            login, and no private area. The site does not keep a file on you.
          </LegalP>
        </LegalSection>
        <LegalSection title="What the host may see">
          <LegalP>
            A host and a content network serve the pages. They may log the
            time, the path, a coarse location from the IP address, and a user
            agent, to run the site and to stop abuse. That log is not sold and
            it is not used to build a profile.
          </LegalP>
        </LegalSection>
        <LegalSection title="Cookies">
          <LegalP>
            The notes do not need cookies. The host may set a strictly necessary
            cookie for security. There is no separate analytics product.
          </LegalP>
        </LegalSection>
        <LegalSection title="Advertising">
          {ads.isConfigured ? (
            <LegalP>
              Google AdSense is enabled. Google may set cookies and collect data
              in order to show advertisements. Google&apos;s policies describe
              that processing. Ads on the page are labeled.
            </LegalP>
          ) : (
            <LegalP>
              There are no advertisements and no advertising cookies right now.
              If AdSense is turned on later, this page will say so.
            </LegalP>
          )}
        </LegalSection>
        <LegalSection title="Figures from elsewhere">
          <LegalP>
            A note may load a local file under /media/ or a remote image on
            HTTPS. A remote host has its own logs.
          </LegalP>
        </LegalSection>
        <LegalSection title="Changes">
          <LegalP>
            The date at the top is the date of this text. The{" "}
            <Link href="/terms" color="secondary" hasUnderline>
              terms
            </Link>{" "}
            say how the notes may be used: they are open.
          </LegalP>
        </LegalSection>
      </LegalDoc>
    </>
  );
}

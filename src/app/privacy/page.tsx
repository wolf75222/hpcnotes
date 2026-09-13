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
        <LegalSection title="Who this covers">
          <LegalP>
            hpcnotes.eu is a personal notes site. It publishes short notes on
            high-performance computing. There is no company, no account, no
            login, and no comment form. This policy describes what happens when
            you read those notes in a browser or fetch them as Markdown.
          </LegalP>
        </LegalSection>
        <LegalSection title="What the site publishes">
          <LegalP>
            The notes, tags, dates, RSS feed, sitemap, and Markdown copies are
            written by the operator and are public on purpose. They are not
            personal data about you.
          </LegalP>
        </LegalSection>
        <LegalSection title="Logs and hosting">
          <LegalP>
            The site is served through a host and a content delivery network.
            Those services may keep ordinary request logs: the time, the path,
            a coarse location derived from the IP address, and a user agent.
            Logs are used to run the site, to debug failures, and to stop
            abuse. They are not sold, and they are not used to build a profile
            of you.
          </LegalP>
        </LegalSection>
        <LegalSection title="Cookies">
          <LegalP>
            The notes themselves do not need cookies. The host may set a
            strictly necessary cookie for security or traffic control. The
            site does not use a separate analytics product.
          </LegalP>
        </LegalSection>
        <LegalSection title="Advertising">
          {ads.isConfigured ? (
            <LegalP>
              Google AdSense is enabled. Google may set cookies and collect
              data about visits in order to show advertisements, including
              personalized ones where the law allows. Google&apos;s own
              policies describe that processing. You can use Google&apos;s ad
              settings or your browser controls to limit it. Advertisements are
              labeled on the page.
            </LegalP>
          ) : (
            <LegalP>
              This site does not currently show advertisements or set advertising
              cookies. If the operator turns Google AdSense on later, Google
              may then set cookies and collect data as described in Google&apos;s
              policies, and this page will say so.
            </LegalP>
          )}
        </LegalSection>
        <LegalSection title="Embedded figures">
          <LegalP>
            A note may include a local file under /media/ or a remote image on
            HTTPS. Remote files are requested from their host. That host has
            its own logs and policies.
          </LegalP>
        </LegalSection>
        <LegalSection title="Language-model copies">
          <LegalP>
            Public Markdown copies exist so that people and crawlers can quote
            a note without scraping the HTML. Fetching /llms.txt, a note with
            .md appended, or sending Accept: text/markdown does not collect extra
            personal data beyond ordinary request logs.
          </LegalP>
        </LegalSection>
        <LegalSection title="Children">
          <LegalP>
            The site is written for people who work with clusters. It is not
            directed at children, and it does not try to collect data from
            them.
          </LegalP>
        </LegalSection>
        <LegalSection title="Changes">
          <LegalP>
            The operator may change this policy. The date at the top of the
            page is the date of the current text.
          </LegalP>
        </LegalSection>
        <LegalSection title="Contact">
          <LegalP>
            Questions about this policy go to the operator of hpcnotes.eu.
            There is no support desk. The{" "}
            <Link href="/terms" color="secondary" hasUnderline>
              terms
            </Link>{" "}
            describe how the notes may be used.
          </LegalP>
        </LegalSection>
      </LegalDoc>
    </>
  );
}

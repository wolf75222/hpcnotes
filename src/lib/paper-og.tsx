import { ImageResponse } from "next/og";

export const ogSize = {
  width: 1200,
  height: 630,
};

export const ogContentType = "image/png";

export function paperOgImage({
  kicker = "hpcnotes",
  title,
  meta,
}: {
  kicker?: string;
  title: string;
  meta?: string;
}) {
  const titleSize = title.length > 80 ? 44 : title.length > 42 ? 52 : 64;

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          width: "100%",
          height: "100%",
          backgroundColor: "#ffffff",
          padding: "72px 80px",
        }}
      >
        <div
          style={{
            display: "flex",
            color: "#737373",
            fontSize: 28,
            letterSpacing: "-0.02em",
          }}
        >
          {kicker}
        </div>
        <div
          style={{
            display: "flex",
            color: "#171717",
            fontSize: titleSize,
            lineHeight: 1.15,
            letterSpacing: "-0.03em",
            maxWidth: 1040,
          }}
        >
          {title}
        </div>
        <div
          style={{
            display: "flex",
            color: "#737373",
            fontSize: 28,
            letterSpacing: "-0.02em",
          }}
        >
          {meta ?? "hpcnotes.eu"}
        </div>
      </div>
    ),
    { ...ogSize },
  );
}

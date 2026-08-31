import { Layout, LayoutContent } from "@astryxdesign/core/Layout";

export function PageFrame({ children }: { children: React.ReactNode }) {
  return (
    <Layout
      height="auto"
      contentWidth={960}
      padding={6}
      content={<LayoutContent>{children}</LayoutContent>}
    />
  );
}

import { Breadcrumbs, BreadcrumbItem } from "@astryxdesign/core/Breadcrumbs";

export function PageTrail({
  items,
}: {
  items: { href?: string; label: string; current?: boolean }[];
}) {
  return (
    <Breadcrumbs variant="supporting" label="Trail">
      {items.map((item) => (
        <BreadcrumbItem
          key={`${item.href ?? ""}:${item.label}`}
          href={item.current ? undefined : item.href}
          isCurrent={item.current}
        >
          {item.label}
        </BreadcrumbItem>
      ))}
    </Breadcrumbs>
  );
}

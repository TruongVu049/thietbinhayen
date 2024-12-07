import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { link } from "fs";
import { Fragment } from "react";
export default function BreadcrumbCustom({
  links,
}: {
  links: { id: number; title: string; path?: string }[];
}) {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {link.length
          ? links.map((item, index) => {
              return (
                <Fragment key={item.id}>
                  <BreadcrumbItem>
                    {index !== link.length - 1 ? (
                      <BreadcrumbLink href={item.path}>
                        {item.title}
                      </BreadcrumbLink>
                    ) : (
                      <BreadcrumbLink>{item.title}</BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                  {index !== link.length - 1 && <BreadcrumbSeparator />}
                </Fragment>
              );
            })
          : null}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

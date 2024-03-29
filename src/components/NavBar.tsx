import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useLocation } from "react-router-dom";

import ThemeToggle from "@/components/ThemeToggle";

export default function NavBar() {
  const { pathname, search } = useLocation();

  const routeBreadcrumbs = pathname.slice(1).split("/");

  if (routeBreadcrumbs.length === 1 && routeBreadcrumbs[0] === "")
    routeBreadcrumbs.splice(0, 1);

  const breadcrumbs =
    routeBreadcrumbs.length === 0
      ? [
          <BreadcrumbItem key="breadcrumb-home-route">
            <BreadcrumbPage>home</BreadcrumbPage>
          </BreadcrumbItem>,
        ]
      : [
          <BreadcrumbItem key="breadcrumb-home-route">
            <BreadcrumbLink href="/">home</BreadcrumbLink>
          </BreadcrumbItem>,
        ];

  if (routeBreadcrumbs.length) {
    routeBreadcrumbs.forEach((route, i, arr) => {
      const currentURL = `/${routeBreadcrumbs.slice(0, i + 1).join("/")}`;

      breadcrumbs.push(
        <BreadcrumbSeparator key={`breadcrumb-separator-${i}`} />
      );

      const key = `breadcrumb-${currentURL}-${i}`;

      if (i === arr.length - 1) {
        breadcrumbs.push(
          <BreadcrumbItem key={key}>
            <BreadcrumbPage>{route}</BreadcrumbPage>
          </BreadcrumbItem>
        );
      } else {
        breadcrumbs.push(
          <BreadcrumbItem key={key}>
            <BreadcrumbLink href={`${currentURL}${search}`}>
              {route}
            </BreadcrumbLink>
          </BreadcrumbItem>
        );
      }
    });
  }

  return (
    <header className="flex justify-between align-items-center gap-4 w-full px-3 py-2">
      <div className="flex align-items-center">
        <Breadcrumb className="flex align-items-center">
          <BreadcrumbList>{breadcrumbs}</BreadcrumbList>
        </Breadcrumb>
      </div>
      <div>
        <ThemeToggle />
      </div>
    </header>
  );
}

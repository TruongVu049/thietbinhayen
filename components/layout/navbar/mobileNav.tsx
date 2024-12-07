"use client";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { NavType } from "@/lib/constants";
import Link from "next/link";
import { Menu, Package2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ReactNode, useState } from "react";

export default function MobileNav({
  navLinks,
  children,
}: {
  navLinks: NavType[];
  children?: ReactNode;
}) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  // Hàm này được gọi khi người dùng nhấp vào link
  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="shrink-0 md:hidden"
          onClick={() => setIsOpen(true)} // Mở sheet khi nhấn vào nút
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle navigation menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="bg-white p-2">
        <nav className="grid gap-6 text-lg font-medium p-2">
          <Link
            href="#"
            className="flex items-center gap-2 text-lg font-semibold"
            onClick={handleLinkClick} // Đóng sheet khi nhấn vào link
          >
            <Package2 className="h-6 w-6" />
            <span className="sr-only">Acme Inc</span>
          </Link>
          {navLinks &&
            navLinks.map((item: NavType) => (
              <Link
                key={item.id}
                href={item.path}
                className="text-muted-foreground transition-colors hover:text-foreground"
                onClick={handleLinkClick} // Đóng sheet khi nhấn vào link
              >
                {item.title}
              </Link>
            ))}
          <Link
            prefetch={true}
            href={"/search?categories=1"}
            className="text-nowrap  items-center flex  relative z-20 text-muted-foreground transition-colors hover:text-foreground"
          >
            Amply nhà yến
            <svg
              className="w-6 h-6 text-yellow-500 mb-1"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              width={24}
              height={24}
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M18.045 3.007 12.31 3a1.965 1.965 0 0 0-1.4.585l-7.33 7.394a2 2 0 0 0 0 2.805l6.573 6.631a1.957 1.957 0 0 0 1.4.585 1.965 1.965 0 0 0 1.4-.585l7.409-7.477A2 2 0 0 0 21 11.479v-5.5a2.972 2.972 0 0 0-2.955-2.972Zm-2.452 6.438a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z" />
            </svg>
          </Link>
          <Link
            prefetch={true}
            href={"/search?categories=2"}
            className="text-nowrap flex items-center   relative z-20 text-muted-foreground transition-colors hover:text-foreground"
          >
            Loa nhà yến
            <svg
              className="w-6 h-6 text-yellow-500 mb-1"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              width={24}
              height={24}
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M18.045 3.007 12.31 3a1.965 1.965 0 0 0-1.4.585l-7.33 7.394a2 2 0 0 0 0 2.805l6.573 6.631a1.957 1.957 0 0 0 1.4.585 1.965 1.965 0 0 0 1.4-.585l7.409-7.477A2 2 0 0 0 21 11.479v-5.5a2.972 2.972 0 0 0-2.955-2.972Zm-2.452 6.438a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z" />
            </svg>
          </Link>

          <Link
            prefetch={true}
            href={"/blog"}
            className="text-nowrap flex items-center   relative z-20 text-muted-foreground transition-colors hover:text-foreground"
          >
            Tin tức
            <svg
              className="w-6 h-6 text-orange-500 mb-2"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              width={24}
              height={24}
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M8.597 3.2A1 1 0 0 0 7.04 4.289a3.49 3.49 0 0 1 .057 1.795 3.448 3.448 0 0 1-.84 1.575.999.999 0 0 0-.077.094c-.596.817-3.96 5.6-.941 10.762l.03.049a7.73 7.73 0 0 0 2.917 2.602 7.617 7.617 0 0 0 3.772.829 8.06 8.06 0 0 0 3.986-.975 8.185 8.185 0 0 0 3.04-2.864c1.301-2.2 1.184-4.556.588-6.441-.583-1.848-1.68-3.414-2.607-4.102a1 1 0 0 0-1.594.757c-.067 1.431-.363 2.551-.794 3.431-.222-2.407-1.127-4.196-2.224-5.524-1.147-1.39-2.564-2.3-3.323-2.788a8.487 8.487 0 0 1-.432-.287Z" />
            </svg>
          </Link>
          <Link
            prefetch={true}
            href={"/contact"}
            className="text-nowrap text-muted-foreground transition-colors hover:text-foreground"
          >
            Liên hệ
          </Link>
          {children}
        </nav>
      </SheetContent>
    </Sheet>
  );
}

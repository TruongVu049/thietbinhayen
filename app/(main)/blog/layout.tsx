import Footer from "@/components/layout/footer";
import BreadcrumbCustom from "@/components/breadcrumbCustom";
const link = [
  {
    id: 1,
    title: "Trang chủ",
    path: "/",
  },
];
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <section className="max-w-screen-xl block mx-auto relative">
        <div className="px-4 md:px-6 md:py-4 py-3 md:text-lg text-base">
          <BreadcrumbCustom
            links={[
              ...link,
              {
                id: 2,
                title: "Tin tức",
              },
            ]}
          />
        </div>
        {children}
      </section>
      <div className="mt-4">
        <Footer />
      </div>
    </>
  );
}

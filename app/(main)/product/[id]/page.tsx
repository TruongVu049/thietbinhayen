import "react-quill/dist/quill.bubble.css";
import "./style.css";
import BreadcrumbCustom from "@/components/breadcrumbCustom";
import Grid from "@/components/grid";
import ProductGridItems from "@/components/product/productGridItems";
import ProductOverview from "@/components/product/productOverview";
import ProductReview from "@/components/product/productReview";
import ReadMore from "@/components/readMore";
import { getProduct, getProductsByCategory } from "@/lib/db";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Row } from "@/lib/types";
import { isValidJSON } from "@/helpers/utils";
import ViewedProducts from "@/components/product/ViewedProducts";
import { Metadata } from "next";
const link = [
  {
    id: 1,
    title: "Trang chủ",
    path: "/",
  },
  {
    id: 2,
    title: "Sản phẩm",
    path: "/product",
  },
];

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const product = await getProduct(params.id);
  if (!product) return { title: "Sản phẩm không tồn tại" };

  return {
    title: `${product.ten} | Thiết Bị Nhà Yến - Hayen`,
    description:
      product.mota?.replace(/<[^>]+>/g, "").slice(0, 150) ||
      `Mua ${product.ten} chất lượng tại Hayen. Giao hàng toàn quốc.`,
    openGraph: {
      title: `${product.ten} | Hayen`,
      description:
        product.mota?.replace(/<[^>]+>/g, "").slice(0, 150) ||
        `Mua ${product.ten} tại Hayen`,
      images: product.hinhanh ? [product.hinhanh] : [],
    },
  };
}

export default async function Page({ params }: { params: { id: string } }) {
  const product = await getProduct(params.id);

  if (!product) return notFound();
  return (
    <div className="max-w-screen-xl block mx-auto">
      <div className="px-4 md:px-6 md:py-4 py-3 md:text-lg text-base">
        <BreadcrumbCustom
          links={[
            ...link,
            {
              id: 3,
              title: params.id,
              path: `/product/${params.id}`,
            },
          ]}
        />
      </div>
      <Suspense>
        <ProductOverview product={product} />
      </Suspense>
      <div className="grid md:grid-cols-3 grid-cols-1 items-start gap-4">
        <div className="px-4 md:px-6 mt-4 md:col-span-2">
          <hr className="block py-2" />
          <h3 className=" border-l-4 border-rose-500 p-2 text-gray-900 md:text-md text-base font-semibold">
            MÔ TẢ SẢN PHẨM
          </h3>
        </div>
        <div className="col-span-1 px-4 md:px-6 mt-4 md:block hidden">
          <hr className="block py-2" />
          <h3 className=" border-l-4 border-rose-500 p-2 text-gray-900 md:text-md text-base font-semibold">
            Thông số kỹ thuật
          </h3>
        </div>
      </div>
      <ReadMore>
        <div className="grid md:grid-cols-3 grid-cols-1 items-start gap-4">
          <div className="px-4 md:px-6 mb-4 md:col-span-2">
            <Suspense fallback={null}>
              <div
                className="content view ql-editor "
                dangerouslySetInnerHTML={{ __html: product?.mota }}
              />
            </Suspense>
          </div>
          <div className="col-span-1 px-4 md:px-6 mb-4 ">
            <div className=" md:hidden block">
              <hr className="block py-2" />
              <h3 className=" border-l-4 border-rose-500 p-2 text-gray-900 md:text-md text-base font-semibold">
                Thông số kỹ thuật
              </h3>
            </div>
            <div className="flex flex-col">
              <div className="">
                <div className="min-w-full inline-block align-middle ">
                  <div className="border-2 mt-3 rounded-lg overflow-hidden">
                    <table className="min-w-full divide-x divide-y divide-gray-200  ">
                      <thead></thead>
                      <tbody>
                        {product?.thongsokythuat &&
                        isValidJSON(product.thongsokythuat)
                          ? JSON.parse(product?.thongsokythuat).map(
                              (item: Row) => (
                                <tr
                                  key={item.id}
                                  className="odd:bg-white even:bg-gray-100"
                                >
                                  <th
                                    scope="col"
                                    className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500"
                                  >
                                    {item.ten}
                                  </th>
                                  <td
                                    scope="col"
                                    className="border-l px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500"
                                  >
                                    {item.thongso}
                                  </td>
                                </tr>
                              )
                            )
                          : null}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ReadMore>

      <div className="px-4 md:px-6 my-4">
        <hr />
        <h4 className="border-l-4 border-rose-500 p-2 text-gray-900 md:text-md text-base font-semibold">
          ĐÁNH GIÁ
        </h4>
        <Suspense>
          <ProductReview
            productId={product.id ?? 0}
            star={product.avgDanhGia ?? 0}
          />
        </Suspense>
      </div>
      <div className="px-4 md:px-6 my-4">
        <hr />
        <h4 className="md:text-xl text-lg text-zinc-900 font-bold mt-8">
          SẢN PHẨM LIÊN QUAN
        </h4>
        <Suspense>
          <RelatedProducts
            id={product.id ?? 0}
            category_id={product?.danhmuc_id?.toString() ?? "0"}
          />
        </Suspense>
      </div>

      <div className="px-4 md:px-6 my-4">
        <hr />
        <h4 className="md:text-xl text-lg text-zinc-900 font-bold mt-8">
          SẢN PHẨM ĐÃ XEM
        </h4>
        <Suspense>
          <ViewedProducts productId={product.id ?? 0} />
        </Suspense>
      </div>
    </div>
  );
}

async function RelatedProducts({
  id,
  category_id,
}: {
  id: number;
  category_id: string;
}) {
  let relatedProducts = await getProductsByCategory(category_id);

  if (relatedProducts.length == 0) return null;
  else {
    relatedProducts = relatedProducts.filter((item) => item.id !== id);
  }

  return (
    <Grid className="grid-cols-1 sm:grid-cols-3 md:grid-cols-4  lg:grid-cols-5 mt-4">
      <ProductGridItems products={relatedProducts} isHiddenBG={true} />
    </Grid>
  );
}

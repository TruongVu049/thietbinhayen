import { Package2 } from "lucide-react";
import Link from "next/link";
export default function Footer() {
  return (
    <footer className="bg-gray-100 w-full">
      <div className="max-w-screen-xl mx-auto">
        <div className="mx-auto w-full max-w-screen-xl p-4 py-6 lg:py-8 border-t border-gray-200">
          <div className="md:flex md:justify-between ">
            <div className="mb-6 md:mb-0">
              <Link href={"/"} className="flex items-center">
                <Package2 className="w-5 h-5 text-zinc-900" />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-8 sm:gap-6">
              <div>
                <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">
                  Giới thiệu
                </h2>
                <p className="text-gray-500 dark:text-gray-400 font-medium">
                  Giới thiệu
                </p>
              </div>
              <div>
                <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">
                  Theo dõi
                </h2>
                <ul className="text-gray-500 dark:text-gray-400 font-medium">
                  <li className="mb-4 ">
                    <Link href={"#"} className="hover:underline">
                      Twitter
                    </Link>
                  </li>
                  <li className="mb-4 ">
                    <Link href={"#"} className="hover:underline">
                      Facebook
                    </Link>
                  </li>
                  <li className="mb-4 ">
                    <Link href={"#"} className="hover:underline">
                      Youtobe
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
          <div className="sm:flex sm:items-center sm:justify-between">
            <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">
              © {new Date().getFullYear()}{" "}
              <a href="https://flowbite.com/" className="hover:underline">
                Vu
              </a>
              . All Rights Reserved.
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

"use client";
import { ChevronDown } from "lucide-react";
import { ReactNode } from "react";
import { useState } from "react";
export default function Accordion({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  const [isActive, setIsActive] = useState<boolean>(false);
  function handleActive() {
    setIsActive(!isActive);
  }
  return (
    <>
      <button
        type="button"
        onClick={handleActive}
        className="flex items-center w-full py-2 text-base text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
      >
        <span className="flex-1 ms-3 text-left rtl:text-right whitespace-nowrap">
          {title}
        </span>
        <ChevronDown className="w-5 h-5 text-gray-500 transition duration-75" />
      </button>
      <ul className={` py-2 space-y-2 ${isActive ? "block" : "hidden"}`}>
        {children}
      </ul>
    </>
  );
}

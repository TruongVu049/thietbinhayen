"use client";

import { useFormStatus } from "react-dom";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";
import React from "react";

export function SubmitButton({
  label,
  cName,
  bgColor = "bg-indigo-600",
  bgColorHover = "bg-indigo-400",
  name = "",
  children,
}: {
  label: string;
  cName?: string;
  bgColor?: string;
  bgColorHover?: string;
  name?: string;
  children?: React.ReactNode;
}) {
  const { pending } = useFormStatus();

  return (
    <Button
      disabled={pending}
      type="submit"
      name={name}
      className={`${cName} hover:shadow-form flex items-center justify-center  ${
        pending ? bgColorHover : bgColor
      } hover:${bgColorHover}  text-center text-base outline-none`}
    >
      <Loader2
        className={`mr-2 h-4 w-4 animate-spin ${pending ? "block" : "hidden"}`}
      />
      {label}
      {children}
    </Button>
  );
}
// pading py-3 px-8 text-white

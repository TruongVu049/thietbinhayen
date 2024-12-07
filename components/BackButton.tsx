"use client";
import React from "react";
import { Button, ButtonProps } from "./ui/button";
import { useRouter } from "next/navigation";

type BackButtonProps = ButtonProps & {
  children: React.ReactNode; // Đảm bảo hỗ trợ nội dung bên trong nút
};

const BackButton: React.FC<BackButtonProps> = ({
  className,
  variant,
  size,
  children,
  ...rest
}) => {
  const router = useRouter();

  return (
    <Button
      onClick={() => router.back()}
      className={className}
      variant={variant}
      size={size}
      {...rest}
    >
      {children}
    </Button>
  );
};

export default BackButton;

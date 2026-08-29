import React from "react";
import { cn } from "@/shared/utils";

interface BrandLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

const SIZE_CLASS = {
  sm: "h-8",
  md: "h-10",
  lg: "h-12",
};

export const BrandLogo: React.FC<BrandLogoProps> = ({ className, size = "md" }) => {
  return (
    <img
      src="/ecomind-logo.png"
      alt="EcoMind"
      className={cn("w-auto object-contain object-left", SIZE_CLASS[size], className)}
    />
  );
};

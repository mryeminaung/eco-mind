import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/shared/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-lima-500 focus:ring-offset-2 whitespace-nowrap",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-lima-600 text-white shadow-xs",
        secondary:
          "border-transparent bg-lima-100 text-lima-800",
        outline:
          "text-slate-700 border-slate-200 bg-white",
        success:
          "border-transparent bg-lima-500 text-white",
        warning:
          "border-transparent bg-amber-100 text-amber-800",
        destructive:
          "border-transparent bg-rose-100 text-rose-800",
        info:
          "border-transparent bg-sky-100 text-sky-800",
        eco:
          "border-lima-300/60 bg-lima-50 text-lima-800 font-medium",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  className?: string;
  children?: React.ReactNode;
}

function Badge({ className, variant, children, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props}>
      {children}
    </div>
  );
}

export { Badge, badgeVariants };

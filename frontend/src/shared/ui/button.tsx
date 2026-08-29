import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/shared/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lima-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] cursor-pointer",
  {
    variants: {
      variant: {
        default:
          "bg-lima-600 text-white shadow-sm hover:bg-lima-700 hover:shadow-md",
        secondary:
          "bg-lima-50 text-lima-900 hover:bg-lima-100 border border-lima-200/60",
        outline:
          "border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 shadow-xs",
        ghost:
          "hover:bg-lima-50 hover:text-lima-900 text-slate-600",
        destructive:
          "bg-rose-600 text-white hover:bg-rose-700 shadow-sm",
        eco:
          "bg-gradient-to-r from-lima-600 to-lima-700 text-white shadow-sm hover:from-lima-700 hover:to-lima-800 hover:shadow-lima-200",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 rounded-lg px-3 text-xs",
        lg: "h-12 rounded-xl px-6 text-base font-semibold",
        icon: "h-10 w-10 p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };

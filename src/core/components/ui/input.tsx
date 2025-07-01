import * as React from "react";
import { cn } from "@/core/lib/utils";

interface InputProps extends React.ComponentProps<"input"> {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  iconPosition?: "left" | "right" | "both";
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, leftIcon, rightIcon, iconPosition, ...props }, ref) => {
    const hasLeftIcon =
      leftIcon && (iconPosition === "left" || iconPosition === "both");
    const hasRightIcon =
      rightIcon && (iconPosition === "right" || iconPosition === "both");

    if (hasLeftIcon || hasRightIcon) {
      return (
        <div className="relative w-full">
          {hasLeftIcon && (
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              {leftIcon}
            </div>
          )}
          <input
            type={type}
            data-slot="input"
            ref={ref}
            className={cn(
              "file:text-foreground placeholder:text-neutral/60 selection:bg-accent/50 selection:text-primary",
              "flex h-10 w-full min-w-0 rounded-sm bg-primary border border-neutral/50 p-2 text-sm tracking-wide",
              "transition-all duration-200 ease-in-out outline-none",
              "file:inline-flex file:h-8 file:border-0 file:bg-transparent file:text-sm file:font-medium",
              "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
              "focus:bg-muted focus:shadow-sm focus:ring-1 focus:ring-accent/80 focus:border-accent/50",
              "aria-invalid:border-destructive aria-invalid:ring-destructive/20",
              "dark:aria-invalid:ring-destructive/40 dark:focus:ring-accent/20",
              hasLeftIcon ? "pl-10" : "",
              hasRightIcon ? "pr-10" : "",
              className
            )}
            {...props}
          />
          {hasRightIcon && (
            <div className="absolute inset-y-0 right-0 flex items-center justify-center pr-3 pointer-events-none">
              {rightIcon}
            </div>
          )}
        </div>
      );
    }

    return (
      <input
        type={type}
        data-slot="input"
        ref={ref}
        className={cn(
          "file:text-foreground placeholder:text-neutral/60 selection:bg-accent/50 selection:text-primary",
          "flex h-10 w-full min-w-0 rounded-sm border border-neutral/50 p-2 text-sm tracking-wide",
          "transition-all duration-200 ease-in-out outline-none",
          "file:inline-flex file:h-8 file:border-0 file:bg-transparent file:text-sm file:font-medium",
          "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
          "focus:bg-muted/80 dark:focus:bg-muted/40 focus:shadow-sm focus:ring-1 focus:ring-accent/50 focus:border-accent/50",
          "aria-invalid:border-destructive aria-invalid:ring-destructive/20",
          "dark:aria-invalid:ring-destructive/40 dark:focus:ring-accent/20",
          className
        )}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";

export { Input };

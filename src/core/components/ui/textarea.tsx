import * as React from "react";

import { cn } from "@/core/lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "border-neutral/50 placeholder:text-neutral/50 focus:bg-muted/80 dark:focus:bg-muted/40 focus:shadow-sm focus:ring-1 focus:ring-accent/50 focus:border-accent/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 flex field-sizing-content resize-none min-h-20 max-h-40 w-full rounded-md border p-2 shadow-xs transition-[color,box-shadow] outline-none disabled:cursor-not-allowed disabled:opacity-50 text-sm",
        className
      )}
      {...props}
    />
  );
}

export { Textarea };

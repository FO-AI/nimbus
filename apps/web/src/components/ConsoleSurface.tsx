import type { ElementType, HTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/utils";

type ConsoleSurfaceTone = "hero" | "dark" | "panel";

interface ConsoleSurfaceProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType;
  tone: ConsoleSurfaceTone;
  children: ReactNode;
  contentClassName?: string;
}

const toneStyles: Record<ConsoleSurfaceTone, string> = {
  hero: "[background-image:var(--background-image-console-hero)] text-white",
  dark: "[background-image:var(--background-image-console-dark)] text-white",
  panel:
    "rounded-xl border border-white/15 bg-console-panel/80 shadow-[var(--shadow-console-panel)] backdrop-blur-xl",
};

export function ConsoleSurface({
  as: Component = "div",
  tone,
  className,
  contentClassName,
  children,
  ...props
}: ConsoleSurfaceProps) {
  return (
    <Component
      className={cn("relative isolate overflow-hidden", toneStyles[tone], className)}
      {...props}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-25 [background-image:linear-gradient(var(--color-console-grid)_1px,transparent_1px),linear-gradient(90deg,var(--color-console-grid)_1px,transparent_1px)] [background-size:44px_44px]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-console-glow to-transparent opacity-80"
      />
      <div className={cn("relative", contentClassName)}>{children}</div>
    </Component>
  );
}

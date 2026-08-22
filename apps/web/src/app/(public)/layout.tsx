import type { ReactNode } from "react";

import { PublicNavBar } from "@/components/PublicNavBar";

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <PublicNavBar />
      <div className="flex flex-1 flex-col">{children}</div>
    </div>
  );
}

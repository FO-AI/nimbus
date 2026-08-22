import type { Metadata } from "next";

import { AuthDisabledBanner } from "@/components/AuthDisabledBanner";
import { AuthProvider } from "@/lib/auth/AuthProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "FOAI — Finance & Operations AI Initiative",
  description:
    "FOAI helps UNC Finance & Operations staff build AI familiarity and tool literacy. Nimbus, the initiative's flagship product, brings guides, prompts, and a grounded assistant into one workspace.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <AuthDisabledBanner />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}

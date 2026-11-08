import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SupriseCode — AI coding workspace",
  description: "Open-source AI coding agent with isolated remote execution.",
  applicationName: "SupriseCode",
  manifest: "/manifest.webmanifest",
  appleWebApp: { capable: true, statusBarStyle: "black-translucent", title: "SupriseCode" },
  icons: { icon: "/suprisecode-mark.svg", apple: "/suprisecode-mark.svg" }
};
export const viewport: Viewport = { themeColor: "#090b10", width: "device-width", initialScale: 1 };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}

import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Issue Analyser Dashboard",
  description: "Visualize GitHub issue digests with snapshot, themes, and contributor shortlists",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col bg-background text-foreground antialiased">
        {children}
      </body>
    </html>
  );
}

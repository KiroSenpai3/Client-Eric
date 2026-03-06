import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "EPIC BR Platform — Tanzania's Leading HR & Recruitment Platform",
  description:
    "Connect employers, recruiters, and job seekers. EPIC Business Resources Ltd — real partnerships, real solutions, addressing real needs.",
  keywords: "recruitment Tanzania, HR platform, jobs Dar es Salaam, EPIC BR, talent acquisition",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-body antialiased">{children}</body>
    </html>
  );
}

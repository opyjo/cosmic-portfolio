import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Johnson Ojo | Frontend Engineer",
  description:
    "Portfolio of Johnson Ojo, a Frontend Engineer specializing in React, Next.js, and modern web technologies.",
  icons: {
    icon: "/logo.svg",
    shortcut: "/logo.svg",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "Johnson Ojo | Frontend Engineer",
    description: "Explore the work and projects of Johnson Ojo.",
    url: "https://yourdomain.com",
    siteName: "Johnson Ojo Portfolio",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Johnson Ojo Portfolio Preview",
      },
    ],
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

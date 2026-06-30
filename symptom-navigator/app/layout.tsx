/*
  Import the Metadata type from Next.js.

  This allows page titles, descriptions,
  manifest files, and other metadata
  to be defined with proper typing.
*/
import type { Metadata } from "next";

/*
  Import the "Geist" and "Geist Mono" fonts
  using Next.js' built-in font system.
*/
import { Geist, Geist_Mono } from "next/font/google";

/*
  Import the global stylesheet.

  These styles apply to the entire application.
*/
import "./globals.css";

/*
  Configure the primary font.

  The font is exposed as a CSS variable
  and only includes Latin characters.
*/
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

/*
  Configure the monospace font.

  It can be used, for example,
  for displaying code.
*/
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/*
  Global application metadata.

  This information is used for browser tabs,
  search engines, and PWA features.
*/
export const metadata: Metadata = {
  title: "Symptometer",
  description: "Ersteinschätzung von Symptomen",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Symptometer",
  },
  icons: {
    icon: [
      { url: "/images/symptometer192x192px.png", sizes: "192x192", type: "image/png" },
      { url: "/images/symptometer512x512px.png", sizes: "512x512", type: "image/png" }
    ],
    apple: "/images/symptometer192x192px.png",
  },
};

/*
  RootLayout defines the global layout
  of the entire application.

  All pages are rendered inside {children}.
*/
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    /*
    The html element defines the application's language
    and applies the fonts globally.
  */
    <html
      lang="de"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      {/*
        The body element contains
        the application's main content.
      */}
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}

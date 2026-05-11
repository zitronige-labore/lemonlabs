/*
  Import des Metadata-Typs von Next.js.

  Damit können Seitentitel, Beschreibung,
  Manifest-Dateien und weitere Metadaten
  typisiert definiert werden.
*/
import type { Metadata } from "next";

/*
  Import der Schriftarten "Geist" und "Geist Mono"
  über das integrierte Font-System von Next.js.
*/
import { Geist, Geist_Mono } from "next/font/google";

/*
  Import der globalen CSS-Datei.

  Diese Styles gelten für die gesamte Anwendung.
*/
import "./globals.css";

/*
  Konfiguration der Hauptschriftart.

  Die Schrift wird als CSS-Variable bereitgestellt
  und enthält nur lateinische Zeichen.
*/
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

/*
  Konfiguration der Monospace-Schriftart.

  Diese kann beispielsweise für Code-Darstellungen
  verwendet werden.
*/
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/*
  Globale Metadaten der Anwendung.

  Diese Informationen werden unter anderem
  im Browser-Tab, bei Suchmaschinen
  und für PWA-Funktionen verwendet.
*/
export const metadata: Metadata = {
  title: "MediGuide",
  description: "asses your symptoms",
  manifest: "/manifest.json",
};

/*
  RootLayout ist das globale Grundlayout der gesamten Anwendung.

  Alle Seiten der App werden innerhalb von {children}
  gerendert.
*/
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    /*
      Das html-Element definiert die Hauptsprache
      und bindet die Schriftarten global ein.
    */
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      {/*
        Der body enthält den eigentlichen Inhalt der Anwendung.
      */}
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
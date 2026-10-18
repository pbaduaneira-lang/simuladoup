import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import RegisterServiceWorker from "@/components/RegisterServiceWorker";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "SimuladoUp",
  icons: { icon: "/icons/play-store-512.png", apple: "/icons/app-192.png" },
  description: "Questões do ENEM, explicações e uma rotina de estudo gratuita.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={geistSans.variable}>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <RegisterServiceWorker />
        {children}
      </body>
    </html>
  );
}

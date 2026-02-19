import type { Metadata, Viewport } from "next";
import "./globals.css";
import ErrorReporter from "@/components/ErrorReporter";
import ClientLayout from "@/components/ClientLayout";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#050810",
};

export const metadata: Metadata = {
  title: "RigSense Engine - AI-Powered PC Building Platform",
  description: "Build your dream PC with AI-powered intelligence. Real-time compatibility, budget optimization, and performance analytics.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* DNS Prefetch for faster connections */}
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />

        {/* Preconnect for critical resources */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Press Start 2P:wght@400;500;600;700;800;900&family=Fira+Code:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        <ErrorReporter />
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}


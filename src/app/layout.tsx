import type { Metadata } from "next";
import "./globals.css";
import { Inter, JetBrains_Mono } from "next/font/google";
import ErrorBoundary from "@/components/error-boundary";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
});

export const metadata: Metadata = {
  title: "Travel Tab - AI-Powered Travel Compliance",
  description:
    "Navigate visa requirements, manage documents, and prepare for international travel with AI-powered guidance.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body className="font-sans antialiased bg-background text-foreground">
        {/* Set initial color mode before hydration to prevent FOUC */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(() => { try { const s = localStorage.getItem('theme'); const m = window.matchMedia('(prefers-color-scheme: dark)').matches; const dark = s ? s === 'dark' : m; const root = document.documentElement; if (dark) root.classList.add('dark'); else root.classList.remove('dark'); } catch (e) {} })()",
          }}
        />
        <ErrorBoundary>{children}</ErrorBoundary>
      </body>
    </html>
  );
}

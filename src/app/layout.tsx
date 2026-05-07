import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "CredLens — Free AI Spend Audit | Stop Overpaying for AI Tools",
  description:
    "Instantly audit your team's AI tool spending. Get a personalized report showing where you're overspending and how to save thousands annually. Free, no login required.",
  keywords: [
    "AI spend audit",
    "AI tool pricing",
    "AI cost optimization",
    "Cursor pricing",
    "ChatGPT pricing",
    "Claude pricing",
    "GitHub Copilot pricing",
    "Credex",
    "AI credits",
  ],
  authors: [{ name: "Credex", url: "https://credex.rocks" }],
  openGraph: {
    title: "CredLens — Free AI Spend Audit",
    description:
      "Find out if you're overpaying for AI tools. Get instant savings recommendations.",
    type: "website",
    siteName: "CredLens",
  },
  twitter: {
    card: "summary_large_image",
    title: "CredLens — Free AI Spend Audit",
    description:
      "Find out if you're overpaying for AI tools. Get instant savings recommendations.",
  },
  robots: "index, follow",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full`} suppressHydrationWarning>
      <head>
        {/* Prevent flash of wrong theme */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('credlens-theme') || 'system';
                  var isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
                  if (isDark) document.documentElement.classList.add('dark');
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col antialiased">
        <ThemeProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}

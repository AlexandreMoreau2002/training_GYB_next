/**
 * =============================================================================
 * ROOT LAYOUT - Layout racine (minimal)
 * =============================================================================
 *
 * Ce layout est minimal car next-intl gère le routing via [locale].
 * Il sert principalement à importer les styles globaux et les fonts.
 *
 * Le vrai layout avec le contenu est dans app/[locale]/layout.tsx
 */

import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Summit - Blog Escalade',
  description: 'Le blog dédié à la passion de l\'escalade',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning data-scroll-behavior="smooth">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}

/**
 * =============================================================================
 * NEXT.JS CONFIGURATION
 * =============================================================================
 *
 * Configuration principale de Next.js avec:
 * - Plugin next-intl pour l'internationalisation
 * - Configuration des images externes
 */

import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

// Plugin next-intl - pointe vers notre fichier de config request
const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

const nextConfig: NextConfig = {
  // Autorise les images depuis n'importe quel domaine (pour les URLs externes)
  // En production, on limiterait à des domaines spécifiques
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

export default withNextIntl(nextConfig);

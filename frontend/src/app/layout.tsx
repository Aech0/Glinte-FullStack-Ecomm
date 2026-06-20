import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { AuthProvider } from '@/lib/auth-context';
import { CartProvider } from '@/lib/cart-context';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans', display: 'swap' });
const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

// Used by Next to resolve relative URLs in metadata (OG image, etc.) when a
// crawler hits the site. Override via NEXT_PUBLIC_SITE_URL in production.
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

// The S3-hosted hero, used as the default Open Graph image so WhatsApp / IG
// DM / Twitter share previews look good.
const OG_IMAGE =
  'https://elasticbeanstalk-ap-south-1-539247475467.s3.ap-south-1.amazonaws.com/resources/back/imgs/Landing%20Page%20Image/glinte%20%289%29.png';

const LOGO =
  'https://elasticbeanstalk-ap-south-1-539247475467.s3.ap-south-1.amazonaws.com/resources/back/imgs/homepage/glinte-logo.png';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Glinte — Lip gloss, glossier.',
    template: '%s · Glinte',
  },
  description:
    'High-shine, non-sticky lip glosses in shades that flatter every undertone. Vegan, cruelty-free, made in India.',
  keywords: [
    'lip gloss',
    'vegan lip gloss',
    'cruelty-free lip gloss',
    'high-shine gloss',
    'plumping gloss',
    'Indian lip gloss brand',
    'Glinte',
  ],
  authors: [{ name: 'Glinte' }],
  icons: {
    icon: LOGO,
    apple: LOGO,
    shortcut: LOGO,
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: SITE_URL,
    siteName: 'Glinte',
    title: 'Glinte — Lip gloss, glossier.',
    description:
      'High-shine, non-sticky lip glosses in shades that flatter every undertone. Vegan, cruelty-free, made in India.',
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: 'Glinte lip gloss collection',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Glinte — Lip gloss, glossier.',
    description:
      'High-shine, non-sticky lip glosses. Vegan, cruelty-free, made in India.',
    images: [OG_IMAGE],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="min-h-screen flex flex-col">
        <AuthProvider>
          <CartProvider>
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import JsonLd from '@/components/JsonLd';
import { organizationSchema, webSiteSchema } from '@/lib/structuredData';
import { SITE_URL } from '@/lib/seoMetadata';
import './globals.css';

export const metadata = {
  metadataBase: new URL('https://breastcalculator.com'),
  title: {
    default: 'Breast Calculator: Free Bra Size Calculator — US, UK, EU Sizing',
    template: '%s | Breast Calculator',
  },
  description: 'Free breast calculator and bra size calculator for accurate US, UK, EU sizing. Measure at home, get instant results. No registration, 100% private.',
  keywords: 'breast calculator, bra size calculator, bra fitting, cup size, breast measurement, bra size guide',
  openGraph: {
    title: 'Breast Calculator: Free Bra Size Calculator — US, UK, EU Sizing',
    description: 'Free breast calculator and bra size calculator. Measure your bust and band at home, get your US, UK, EU cup size instantly.',
    url: 'https://breastcalculator.com/',
    siteName: 'Breast Calculator',
    images: [{ url: 'https://breastcalculator.com/images/og-default.jpg', width: 1200, height: 630 }],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Breast Calculator: Free Bra Size Calculator',
    description: 'Free breast calculator and bra size calculator. Measure your bust and band at home.',
    images: ['https://breastcalculator.com/images/og-default.jpg'],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="alternate" hrefLang="x-default" href={SITE_URL + '/'} />
        <JsonLd data={organizationSchema()} />
        <JsonLd data={webSiteSchema()} />
      </head>
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
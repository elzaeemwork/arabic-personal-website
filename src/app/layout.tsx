import type { Metadata } from "next";
import "./globals.css";

const siteUrl = 'https://yousef-muhamed.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "يوسف محمد | مطور برمجيات محترف",
    template: "%s | يوسف محمد",
  },
  description: "يوسف محمد - مطور برمجيات محترف من الموصل، العراق. متخصص في تطوير المواقع والتطبيقات وحلول البرمجيات المتكاملة. تواصل معي لتحويل أفكارك إلى واقع رقمي.",
  keywords: [
    "يوسف محمد",
    "مطور برمجيات",
    "مبرمج",
    "تطوير مواقع",
    "تطوير تطبيقات",
    "الموصل",
    "العراق",
    "مطور ويب",
    "برمجة",
  ],
  authors: [{ name: "يوسف محمد", url: siteUrl }],
  creator: "يوسف محمد",
  publisher: "يوسف محمد",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: "/favicon.png",
    apple: "/favicon.png",
  },
  openGraph: {
    type: "website",
    locale: "ar_IQ",
    url: siteUrl,
    siteName: "يوسف محمد",
    title: "يوسف محمد | مطور برمجيات محترف",
    description: "يوسف محمد - مطور برمجيات محترف من الموصل، العراق. متخصص في تطوير المواقع والتطبيقات وحلول البرمجيات المتكاملة.",
    images: [
      {
        url: "/favicon.png",
        width: 512,
        height: 512,
        alt: "يوسف محمد - مطور برمجيات",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "يوسف محمد | مطور برمجيات محترف",
    description: "يوسف محمد - مطور برمجيات محترف من الموصل، العراق. متخصص في تطوير المواقع والتطبيقات وحلول البرمجيات المتكاملة.",
    images: ["/favicon.png"],
    creator: "@yousef_muhamed",
  },
  alternates: {
    canonical: siteUrl,
  },
  verification: {
    google: "3D43N7XYf_47pHMFvWRmNcE6G5Fd1UQnU29SjIEz1X8",
  },
};

// JSON-LD Structured Data
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "يوسف محمد",
  alternateName: "Yousef Muhamed",
  url: siteUrl,
  image: `${siteUrl}/favicon.png`,
  jobTitle: "مطور برمجيات",
  worksFor: {
    "@type": "Organization",
    name: "عمل حر",
  },
  address: {
    "@type": "PostalAddress",
    addressLocality: "الموصل",
    addressCountry: "العراق",
  },
  sameAs: [],
  description: "مطور برمجيات محترف متخصص في تطوير المواقع والتطبيقات وحلول البرمجيات المتكاملة",
  knowsLanguage: ["ar", "en"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700;800;900&display=swap" rel="stylesheet" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-tajawal antialiased bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white min-h-screen">
        {children}
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import "./globals.css";

const siteUrl = 'https://yousef-muhamed.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "يوسف محمد | مهندس اتصالات ومطور تطبيقات ويب",
    template: "%s | يوسف محمد",
  },
  description: "يوسف محمد أسود الجوباني - مهندس اتصالات ومطور تطبيقات ويب من الموصل، العراق. متخصص في HTML5, CSS3, JavaScript, Node.js وتصميم واجهات المستخدم التفاعلية. خبرة في بناء REST APIs وتطوير حلول برمجية احترافية.",
  keywords: [
    "يوسف محمد",
    "يوسف محمد أسود الجوباني",
    "Yousef Muhamed",
    "مهندس اتصالات",
    "مطور تطبيقات ويب",
    "مطور برمجيات",
    "مبرمج",
    "مطور ويب",
    "web developer",
    "HTML5",
    "CSS3",
    "JavaScript",
    "Node.js",
    "REST API",
    "Git",
    "GitHub",
    "تصميم واجهات",
    "Responsive Design",
    "تطوير مواقع",
    "تطوير تطبيقات",
    "برمجة",
    "UX Design",
    "الموصل",
    "العراق",
    "نينوى",
    "مبرمج عراقي",
    "مطور عراقي",
    "مطور ويب في العراق",
    "مهندس اتصالات مبرمج",
    "مبرمج JavaScript الموصل",
    "تطوير تطبيقات ويب احترافية",
  ],
  authors: [{ name: "يوسف محمد أسود الجوباني", url: siteUrl }],
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
    siteName: "يوسف محمد - مهندس اتصالات ومطور ويب",
    title: "يوسف محمد | مهندس اتصالات ومطور تطبيقات ويب",
    description: "يوسف محمد أسود الجوباني - مهندس اتصالات ومطور تطبيقات ويب من الموصل، العراق. متخصص في HTML5, CSS3, JavaScript, Node.js وتصميم واجهات المستخدم التفاعلية.",
    images: [
      {
        url: "/favicon.png",
        width: 512,
        height: 512,
        alt: "يوسف محمد - مهندس اتصالات ومطور تطبيقات ويب",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "يوسف محمد | مهندس اتصالات ومطور تطبيقات ويب",
    description: "يوسف محمد أسود الجوباني - مهندس اتصالات ومطور تطبيقات ويب من الموصل، العراق. متخصص في HTML5, CSS3, JavaScript, Node.js.",
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
const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "يوسف محمد",
    url: "https://yousef-muhamed.vercel.app",
    jobTitle: "مهندس اتصالات ومطور تطبيقات ويب",
    address: {
      "@type": "PostalAddress",
      addressLocality: "الموصل",
      addressCountry: "IQ",
    },
    // Extra rich data
    alternateName: ["Yousef Muhamed", "يوسف محمد أسود الجوباني"],
    image: `${siteUrl}/favicon.png`,
    worksFor: {
      "@type": "Organization",
      name: "عمل حر",
    },
    alumniOf: {
      "@type": "EducationalOrganization",
      name: "جامعة نينوى - كلية هندسة الكترونيات",
    },
    knowsAbout: [
      "HTML5",
      "CSS3",
      "JavaScript",
      "Node.js",
      "REST API",
      "Git",
      "GitHub",
      "تصميم واجهات المستخدم",
      "Responsive Design",
      "UX Design",
    ],
    sameAs: ["https://github.com/elzaeemwork"],
    description: "مهندس اتصالات ومطور تطبيقات ويب محترف متخصص في تطوير المواقع والتطبيقات وحلول البرمجيات المتكاملة",
    knowsLanguage: ["ar", "en"],
  },
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "يوسف محمد",
    alternateName: ["Yousef Muhamed", "Yousef Portfolio"],
    url: "https://yousef-muhamed.vercel.app",
  }
];

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
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.png" type="image/png" />
        <link rel="apple-touch-icon" href="/favicon.png" />
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

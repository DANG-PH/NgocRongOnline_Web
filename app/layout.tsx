import './globals.css'
import ReduxProvider from "./Provider";
import type { Metadata } from "next";

const BASE_URL = "https://ngocrongdark.com";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),

  // ✅ Title dài hơn, chứa từ khóa cạnh tranh trực tiếp
  title: {
    default: "Ngọc Rồng Dark (NroDark) - Game Dragon Ball MMORPG Việt Nam | Chơi Ngay",
    template: "%s | Ngọc Rồng Dark",
  },

  // ✅ Description dài hơn, chứa từ khóa người ta hay search
  description:
    "Ngọc Rồng Dark - Server Ngọc Rồng Online private mới nhất 2026. Chơi miễn phí, PvP real-time, hệ thống bang hội, kỹ năng Dragon Ball đỉnh cao. Đăng ký ngay!",

  // ✅ Thêm nhiều từ khóa dài (long-tail keywords)
  keywords: [
    "Ngọc Rồng Online",
    "Ngọc Rồng Dark",
    "Ngọc Rồng private server",
    "server Ngọc Rồng mới nhất 2026",
    "chú bé rồng online",
    "Dragon Ball MMORPG Việt Nam",
    "game Ngọc Rồng miễn phí",
    "Ngọc Rồng online mobile",
    "HDG game",
    "DANG-PH",
    "game nhập vai Dragon Ball",
    "Ngọc Rồng PvP",
    "Ngọc Rồng bang hội",
    "Hải Đăng Game Studio",
    "ngocrongdark.com",
    "Ngọc Rồng Dark",
    "NRODARK",
    "nrodark",
    "ngocrongdark",
    "ngoc rong dark",
    "Ngọc Rồng Online private server",
    "Dragon Ball MMORPG Việt Nam",
    "server Ngọc Rồng 2026",
  ],

  authors: [{ name: "Hải Đăng Game Studio", url: BASE_URL }],
  creator: "Hải Đăng Game Studio",
  publisher: "Hải Đăng Game Studio",

  // ✅ Thêm canonical để tránh duplicate content
  alternates: {
    canonical: BASE_URL,
  },

  // ✅ OpenGraph đầy đủ hơn
  openGraph: {
    title: "Ngọc Rồng Dark - Game Dragon Ball MMORPG Việt Nam",
    description:
      "Server Ngọc Rồng Online private mới nhất. PvP real-time, bang hội, kỹ năng đỉnh cao. Chơi miễn phí ngay hôm nay!",
    url: BASE_URL,
    siteName: "Ngọc Rồng Dark",
    images: [
      {
        url: "/assets/head1.webp",
        width: 1200,
        height: 630,
        alt: "Ngọc Rồng Dark - Game Dragon Ball MMORPG",
      },
    ],
    locale: "vi_VN",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Ngọc Rồng Dark - Game Dragon Ball MMORPG",
    description: `Ngọc Rồng Dark - Server Ngọc Rồng Online private uy tín mới nhất 2026, 
                  lấy cảm hứng từ Dragon Ball. Chiến đấu PvP real-time, luyện kỹ năng 
                  Kamehameha, Kiaiho, tham gia bang hội, tranh đoạt Ngọc Rồng. 
                  Hoàn toàn miễn phí - Đăng ký chơi ngay!`,
    images: ["/assets/head1.webp"],
    site: "@ngocrongdark", // thêm nếu có Twitter/X
  },

  icons: {
    icon: "/favicon.ico", // dùng file local, không dùng link ngoài
    apple: "/apple-touch-icon.png",
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // ✅ Thêm verification nếu có (Google Search Console)
  verification: {
    google: "e68df9cb22a00e1a",
  },
};

// ✅ JSON-LD Structured Data — cực kỳ quan trọng cho Google hiểu site
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "VideoGame",
  name: "Ngọc Rồng Dark",
  description:
    "Game Dragon Ball MMORPG Việt Nam với gameplay PvP real-time, bang hội và kỹ năng đa dạng.",
  url: BASE_URL,
  image: `${BASE_URL}/assets/head1.webp`,
  genre: ["MMORPG", "RPG", "Action"],
  gamePlatform: ["Web Browser", "Mobile"],
  applicationCategory: "Game",
  operatingSystem: "Any",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "VND",
    availability: "https://schema.org/InStock",
  },
  author: {
    "@type": "Organization",
    name: "Hải Đăng Game Studio",
    url: BASE_URL,
  },
  publisher: {
    "@type": "Organization",
    name: "Hải Đăng Game Studio",
    url: BASE_URL,
  },
  inLanguage: "vi",
  keywords: "Ngọc Rồng Online, Dragon Ball, MMORPG, game Việt Nam",
   datePublished: "2026-01-01",
  dateModified: new Date().toISOString().split("T")[0],
  
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.8",
    ratingCount: "1200",
    bestRating: "5",
  },

  screenshot: `${BASE_URL}/assets/head1.webp`,

  featureList: [
    "PvP real-time",
    "Hệ thống bang hội",
    "Kỹ năng Dragon Ball",
    "Chơi miễn phí",
    "Máy chủ ổn định"
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <head>
        {/* ✅ JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {/* ✅ Preconnect để tăng tốc độ load */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//www.google-analytics.com" />
      </head>
      <body suppressHydrationWarning>
        <ReduxProvider>{children}</ReduxProvider>
      </body>
    </html>
  );
}
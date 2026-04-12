import './globals.css'
import ReduxProvider from "./Provider";

export const metadata = {
  title: {
    default: "Ngọc Rồng Dark",
    template: "%s | Ngọc Rồng Dark",
  },
  description: "Ngọc Rồng Dark - Game MMORPG Dragon Ball với gameplay real-time, PvP hấp dẫn, hệ thống bang hội và kỹ năng đa dạng.",

  keywords: [
    "Ngọc Rồng Online",
    "Ngọc Rồng Dark",
    "HDG",
    "DANG-PH",
    "Ngọc Rồng Online github",
    "Dragon Ball game",
    "MMORPG Việt Nam",
    "game nhập vai",
    "game online mobile",
  ],

  authors: [{ name: "Hải Đăng Game Studio" }],
  creator: "Hải Đăng Game Studio",

  openGraph: {
    title: "Ngọc Rồng Dark",
    description: "Trải nghiệm game Dragon Ball MMORPG cực kỳ mãn nhãn.",
    url: "https://ngocrongdark.com",
    siteName: "Ngọc Rồng Dark",
    images: [
      {
        url: "/assets/head1.webp",
        width: 1200,
        height: 630,
        alt: "Ngọc Rồng Dark",
      },
    ],
    locale: "vi_VN",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Ngọc Rồng Dark",
    description: "Game Dragon Ball MMORPG hấp dẫn.",
    images: ["/assets/head1.webp"],
  },

  icons: {
    icon: "/assets/avt3.webp",
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi">
      <body suppressHydrationWarning>
        <ReduxProvider>{children}</ReduxProvider>
      </body>
    </html>
  )
}
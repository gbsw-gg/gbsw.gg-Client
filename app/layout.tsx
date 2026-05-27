import "@/styles/globals.css";
import { Inter } from "next/font/google";
import { ToastProvider } from "@/context/ToastContext";
import { UserProvider } from "@/context/UserContext";
import type { Metadata } from "next";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "경소마고 귀가/귀교",
  description: "경북소프트웨어마이스터고등학교 귀가/귀교 버스 탑승 관리 서비스",
  icons: {
    icon: "/images/logo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className={inter.className}>
        <UserProvider>
          <ToastProvider>
            <main className="max-w-[402px] mx-auto min-h-screen">
              {children}
            </main>
          </ToastProvider>
        </UserProvider>
      </body>
    </html>
  );
}

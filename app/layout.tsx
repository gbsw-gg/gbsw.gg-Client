import "@/styles/globals.css";
import { Inter } from "next/font/google";
import { ToastProvider } from "@/context/ToastContext";
import { UserProvider } from "@/context/UserContext";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="wrapper">
          <UserProvider>
            <ToastProvider>{children}</ToastProvider>
          </UserProvider>
        </div>
      </body>
    </html>
  );
}

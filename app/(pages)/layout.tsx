import type { Metadata } from "next";
import { Golos_Text } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { useRouter } from "next/navigation";
import { IoIosAdd, IoMdMore } from "react-icons/io";
import { FiTrash } from "react-icons/fi";

const golos = Golos_Text({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI app",
  description: "AI financial chat bot",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${golos.className} tracking-tight transition-all duration-300 ease-in-out dark:bg-[#191919] dark:text-[#fefefe] text-[#191919] bg-[#fefefe]`}
      >
        <div>
          <Providers>{children}</Providers>
        </div>
      </body>
    </html>
  );
}

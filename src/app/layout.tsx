import type { ReactNode } from "react";
import type { Metadata } from "next";

import { Inter } from "next/font/google";

import { Human } from "@/components/human.component";
import { HeaderLayout } from "@/layout/header.layout";
import { FooterLayout } from "@/layout/footer.layout";

import "./globals.css";

const inter = Inter({ subsets: ["latin"] });
export const metadata: Metadata = {
  title: "Markdown Редактор",
  description: "Онлайн редактор Markdown с реальным предпросмотром",
};

const RootLayout = ({
  children,
}: Readonly<{
  children: ReactNode;
}>) => {
  return (
    <html lang="ru">
      <body className={inter.className}>
        <div className="background"></div>
        <Human />

        <HeaderLayout />

        <main>{children}</main>

        <FooterLayout />
      </body>
    </html>
  );
};

export default RootLayout;

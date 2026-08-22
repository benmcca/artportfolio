import type { Metadata } from "next";
import { Roboto_Mono } from "next/font/google";
import { CategoryFilterProvider } from "../components/CategoryFilterContext";
import Sidebar from "../components/Sidebar";
import "./globals.css";

const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  variable: "--font-roboto-mono",
});

export const metadata: Metadata = {
  title: "Art Portfolio",
  description: "Portfolio gallery",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${robotoMono.variable} h-full antialiased`}>
      <body className="min-h-full bg-background text-foreground">
        <CategoryFilterProvider>
          <div className="flex min-h-screen">
            <Sidebar />
            <div className="flex-1">{children}</div>
          </div>
        </CategoryFilterProvider>
      </body>
    </html>
  );
}

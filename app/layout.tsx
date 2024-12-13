import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import SessionProviderWrapper from "./SessionProviderWrapper";
import Navbar from "./components/ui/navigation/Navbar";
import DynamicBody from "./DynamicBody";
import MainSideBars from "./MainSidebars";
import MobileNavbar from "./components/ui/navigation/MobileNavbar";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Blogpedia",
  description: "A community for tech blogger",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SessionProviderWrapper>
      <html lang="en">
        <head>
          <link rel="icon" href="/blogpedia_fav.svg" type="image/svg+xml" />
        </head>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased relative`}
        >
          <Navbar />
          <div className="">
            <DynamicBody>
              <MainSideBars>{children}</MainSideBars>
            </DynamicBody>
            <MobileNavbar />
            {/* Show the mobile navbar */}
          </div>
        </body>
      </html>
    </SessionProviderWrapper>
  );
}

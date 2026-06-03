import { Geist, Geist_Mono } from "next/font/google";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { GoogleOAuthProvider } from "@react-oauth/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Pharmart",
  description: "Online Multi-vendor pharmacy",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col overflow-x-hidden`}
      >
        <AuthProvider>
          <CartProvider>
          <GoogleOAuthProvider clientId="550867182044-9gkuh535go248jtahq7jt17t1bo6rf5b.apps.googleusercontent.com">
            <Toaster position="top-right" />
            <Header />
            {children}
            <Footer />
          </GoogleOAuthProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

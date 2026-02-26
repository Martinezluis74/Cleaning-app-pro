import { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const viewport: Viewport = {
    themeColor: "#000000",
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
};

export const metadata: Metadata = {
    title: "Cleaning App Pro | Ontario Quotes",
    description: "Commercial cleaning quoting app for Ontario",
    manifest: "/manifest.json",
    appleWebApp: {
        capable: true,
        statusBarStyle: "default",
        title: "Cleaning Pro",
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className="dark">
            <body className={inter.className}>
                <main className="min-h-screen bg-slate-950 text-slate-50 selection:bg-blue-700 selection:text-white">
                    {children}
                </main>
            </body>
        </html>
    );
}

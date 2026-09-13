import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata = {
  title: "E-Commerce D2C Sales OS",
  description: "Enterprise multi-tenant D2C sales operating system, RTO protection, abandoned recovery & Tally integration",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full bg-slate-950 text-slate-100">
      <body className="min-h-full flex flex-col font-sans antialiased bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white">
        <Navbar />
        <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 md:p-8">
          {children}
        </main>
      </body>
    </html>
  );
}

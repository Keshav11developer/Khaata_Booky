import "./globals.css";
import Header from "@/components/header"
import { Inter } from 'next/font/google';
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";

const inter = Inter({
  subsets: ['latin'], // ✅ Add this
  preload: true,
});


export const metadata = {
  title: "KhaataBooky",
  description: "All your kharchas, now in one funky book!",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
    <html lang="en">
      <body
    
        className={inter.className}
      >
        {/*header*/}
        <Header></Header>
        
        <main className="min-h-screen bg-white ">{children}</main>
        <Toaster richColors/>
        {/* footer */ }
        <footer className="bg-blue-200 py-12 ">
          <div className="container mx-auto px-4 text-center text-black">
            Made with ❤️ by <b>Keshav</b> !! 
          </div>
        </footer>
      </body>
    </html>
    </ClerkProvider>
  );
}

// app/layout.tsx
import SideBar from "@/components/SideBar"; 
import Header from "@/components/Header";
import "./globals.css"; // Make sure your global CSS is imported here
export default function RootLayout({children,}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased text-slate-900 dark:text-slate-50">
        <div className="flex h-screen flex-col overflow-hidden">
          <Header />

          <div className="flex flex-1 overflow-hidden">
            <SideBar />

            <main className="flex-1 overflow-y-auto bg-gray-50 p-6 dark:bg-slate-900">
              {children}
            </main>
          </div>
        </div>

      </body>
    </html>
  );
}
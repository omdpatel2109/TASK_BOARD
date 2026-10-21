// // app/layout.tsx (Clean and keeps everything running fast on the server)
// import "./globals.css"; 

// export default function RootLayout({ children }: { children: React.ReactNode }) {
//   return (
//     <html lang="en">
//       <body className="antialiased text-slate-900 dark:text-slate-50">
//         {children}
//       </body>
//     </html>
//   );
// }

import "./globals.css";

export default function RootLayout({children,}: Readonly<{children: React.ReactNode;}>) {
    return (
        <html lang="en">
            <body>{children}</body>
        </html>
    );
}
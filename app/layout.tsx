
import "./globals.css";

// export default function RootLayout({children,}: Readonly<{children: React.ReactNode;}>) {
//     return (
//         <html lang="en">
//             <body>{children}</body>
//         </html>
//     );
// }

import type { ReactNode } from "react";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";

export default async function RootLayout({
    children,
    }: {
    children: ReactNode;
    }) {
    const locale = await getLocale();
    const messages = await getMessages();

    return (
        <html lang={locale}>
        <body>
            <NextIntlClientProvider messages={messages}>
            {children}
            </NextIntlClientProvider>
        </body>
        </html>
    );
}
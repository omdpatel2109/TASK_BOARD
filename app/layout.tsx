import "./globals.css";

// export default function RootLayout({children,}: Readonly<{children: React.ReactNode;}>) {
//     return (
//         <html lang="en">
//             <body>{children}</body>
//         </html>
//     );
// }

import type { ReactNode } from "react";
import { NextIntlClientProvider } from "next-intl"; //purpose is to make translation messages available to Client Components, The provider supplies the translation messages that client-side translation hooks need.
import { getLocale, getMessages } from "next-intl/server";

export default async function RootLayout({children}:{children: ReactNode;}){
    const locale = await getLocale();
    const messages = await getMessages();

    return(
        <html lang={locale}>
            <body>
                {/* The provider receives the messages in selected language and render the message which is accessed by {t("title")} */}
                <NextIntlClientProvider messages={messages}> 
                    {children}
                </NextIntlClientProvider>
            </body>
        </html>
    );
}
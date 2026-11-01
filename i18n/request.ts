import { getRequestConfig } from "next-intl/server";
import { cookies } from "next/headers";
const locales = ["en", "hi", "gu"] as const;

export default getRequestConfig(async () => {
    const cookieStore = await cookies();
    const savedLocale = cookieStore.get("locale")?.value;

    const locale = locales.includes(savedLocale as (typeof locales)[number]) ? savedLocale! : "en";//checks whether the language stored in the cookie is supported in project

    return {
        locale,
        messages: (await import(`../messages/${locale}.json`)).default,
    };
});
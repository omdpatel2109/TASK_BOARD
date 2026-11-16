import { NextRequest, NextResponse } from "next/server";
import { createHash } from "node:crypto";
import { serverApi } from "@/lib/serverApi";
import { cookies } from "next/headers";

const LANGUAGE_CODES: Record<string, string> = { en: "en-US", hi: "hi-IN", gu: "gu-IN" };
const MAX_CHUNK_BYTES = 450; // MyMemory documents a 500-byte maximum for q.

type TranslationRecord = {
    id: string;
    key: string;
    sourceText: string;
    translatedText: string;
    sourceLanguage: string;
    targetLanguage: string;
    createdAt: string;
};

function getCacheKey(text: string, source: string, target: string) {
    return createHash("sha256").update(`${source}:${target}:${text}`).digest("hex");
}

// Keep each request below MyMemory's documented 500-byte query limit.
function splitIntoChunks(value: string): string[] {
    const tokens = value.match(/\S+\s*/gu) ?? [value];
    const chunks: string[] = [];
    let current = "";

    for (const token of tokens) {
        if (new TextEncoder().encode(current + token).length <= MAX_CHUNK_BYTES) {
            current += token;
            continue;
        }
        if (current) chunks.push(current);
        current = "";
        for (const character of token) {
            if (new TextEncoder().encode(current + character).length > MAX_CHUNK_BYTES) {
                if (current) chunks.push(current);
                current = character;
            } else {
                current += character;
            }
        }
    }
    if (current) chunks.push(current);
    return chunks;
}

async function translateChunk(text: string, source: string, target: string) {
    const url = new URL("https://api.mymemory.translated.net/get");
    url.searchParams.set("q", text);
    url.searchParams.set("langpair", `${LANGUAGE_CODES[source]}|${LANGUAGE_CODES[target]}`);
    const response = await fetch(url, { cache: "no-store", signal: AbortSignal.timeout(15000) });
    if (!response.ok) throw new Error(`Translation provider returned ${response.status}`);
    const data = await response.json() as {
        responseStatus?: number;
        responseDetails?: string;
        responseData?: { translatedText?: string };
    };
    const translated = data.responseData?.translatedText;
    if (data.responseStatus !== 200 || !translated) {
        throw new Error(data.responseDetails || "The translation provider could not translate this text.");
    }
    return translated;
}

export async function POST(request: NextRequest) {
    try {
        const cookieStore = await cookies();
        if (!cookieStore.get("access_token")?.value) {
            return NextResponse.json({ message: "Please sign in to translate content." }, { status: 401 });
        }
        const body = await request.json() as {
            text?: string;
            sourceLanguage?: string;
            targetLanguage?: string;
        };
        const text = body.text?.trim();
        const sourceLanguage = body.sourceLanguage;
        const targetLanguage = body.targetLanguage;

        if (!text || text.length > 5000) {
            return NextResponse.json({ message: "Text must contain between 1 and 5000 characters." }, { status: 400 });
        }
        if (!sourceLanguage || !targetLanguage || LANGUAGE_CODES[sourceLanguage] === undefined || LANGUAGE_CODES[targetLanguage] === undefined) {
            return NextResponse.json({ message: "Unsupported source or target language." }, { status: 400 });
        }
        if (sourceLanguage === targetLanguage) {
            return NextResponse.json({ translatedText: text, cached: true });
        }

        const key = getCacheKey(text, sourceLanguage, targetLanguage);
        const cached = await serverApi.get<TranslationRecord[]>("/translations", { params: { key } });
        if (cached.data.length > 0) {
            return NextResponse.json({ translatedText: cached.data[0].translatedText, cached: true });
        }

        const chunks = splitIntoChunks(text);
        const translatedChunks: string[] = [];
        // Small batches keep the public free service from receiving a large burst.
        for (let index = 0; index < chunks.length; index += 4) {
            const batch = chunks.slice(index, index + 4);
            translatedChunks.push(...await Promise.all(
                batch.map((chunk) => translateChunk(chunk, sourceLanguage, targetLanguage))
            ));
        }
        const translatedText = translatedChunks.join("");

        const record: TranslationRecord = {
            id: key,
            key,
            sourceText: text,
            translatedText,
            sourceLanguage,
            targetLanguage,
            createdAt: new Date().toISOString(),
        };
        // A cache write failure should not discard a successful translation.
        try {
            await serverApi.post("/translations", record);
        } catch (cacheError) {
            console.error("Unable to save translation cache:", cacheError);
        }

        return NextResponse.json({ translatedText, cached: false });
    } catch (error) {
        console.error("Dynamic translation failed:", error);
        const message = error instanceof Error ? error.message : "Translation is temporarily unavailable.";
        return NextResponse.json({ message }, { status: 502 });
    }
}

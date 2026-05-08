import type { CaptionDocument } from "@/types/caption";

export function encodeDocumentToHash(document: CaptionDocument): string {
    const payload = {
        c: document.caption,
        e: document.editorContent,
        f: document.footer,
        h: document.hashtags,
        s: document.settings,
        ct: document.customPlatformText,
    };

    try {
        const jsonStr = JSON.stringify(payload);
        const encoded = btoa(encodeURIComponent(jsonStr));
        return `draft=${encoded}`;
    } catch {
        return "";
    }
}

export function decodeDocumentFromHash(hashStr: string): Partial<CaptionDocument> | null {
    if (!hashStr) return null;

    const cleanedHash = hashStr.replace(/^#/, "");
    const match = cleanedHash.match(/draft=([^&]+)/);
    if (!match) return null;

    try {
        const decodedJson = decodeURIComponent(atob(match[1]));
        const data = JSON.parse(decodedJson);

        return {
            caption: typeof data.c === "string" ? data.c : "",
            editorContent: data.e ?? null,
            footer: typeof data.f === "string" ? data.f : "",
            hashtags: Array.isArray(data.h) ? data.h : [],
            settings: typeof data.s === "object" ? data.s : undefined,
            customPlatformText: typeof data.ct === "object" ? data.ct : {},
        };
    } catch {
        return null;
    }
}

export function getShareableUrl(document: CaptionDocument): string {
    const hash = encodeDocumentToHash(document);
    const baseUrl = window.location.origin + window.location.pathname;
    return `${baseUrl}#${hash}`;
}

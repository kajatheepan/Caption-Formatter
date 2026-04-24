import type { CaptionDocument } from "@/types/caption";
import { cleanHashtags } from "@/lib/hashtags/cleanHashtags";

function joinParts(parts: string[]) {
    return parts.filter((part) => part.trim()).join("\n\n");
}

function cleanPlainText(input: string) {
    return input
        .replace(/\*([^\s].*?[^\s])\*/g, "$1")
        .replace(/_([^\s].*?[^\s])_/g, "$1")
        .replace(/~([^\s].*?[^\s])~/g, "$1")
        .replace(/[ \t]+$/gm, "")
        .replace(/\n{3,}/g, "\n\n")
        .trim();
}

export function formatLinkedinCaption(document: CaptionDocument) {
    const caption = document.customPlatformText.linkedin ?? document.caption;
    const parts = [caption];

    if (document.settings.includeFooter) {
        parts.push(document.footer);
    }

    if (document.settings.attachHashtags) {
        parts.push(cleanHashtags(document.hashtags).join(" "));
    }

    return joinParts(parts);
}

export function LinkedinFormatter(input: string) {
    return cleanPlainText(input);
}

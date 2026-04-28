import type { CaptionDocument } from "@/types/caption";
import { cleanHashtags } from "@/lib/hashtags/cleanHashtags";

function joinParts(parts: string[]) {
    return parts.filter((part) => part.trim()).join("\n\n");
}

export function formatWhatsappCaption(document: CaptionDocument) {
    const parts = [document.caption];

    if (document.settings.includeFooter) {
        parts.push(document.footer);
    }

    if (document.settings.attachHashtags) {
        parts.push(cleanHashtags(document.hashtags).join(" "));
    }

    return joinParts(parts);
}

export function WhatsappFormatter(input: string) {
    return input;
}

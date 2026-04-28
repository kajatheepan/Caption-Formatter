import type { CaptionDocument } from "@/types/caption";
import { cleanHashtags } from "@/lib/hashtags/cleanHashtags";
import { getPlatformCaption } from "./getPlatformCaption";

function joinParts(parts: string[]) {
    return parts.filter((part) => part.trim()).join("\n\n");
}

export function formatWhatsappCaption(document: CaptionDocument) {
    const caption = getPlatformCaption(document, "whatsapp");
    const parts = [caption];

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

import type { CaptionDocument } from "@/types/caption";
import { cleanHashtags } from "@/lib/hashtags/cleanHashtags";

function joinParts(parts: string[]) {
    return parts.filter((part) => part.trim()).join("\n\n");
}

export function formatTelegramCaption(document: CaptionDocument) {
    const caption = document.customPlatformText.telegram ?? document.caption;
    const parts = [caption];

    if (document.settings.includeFooter) {
        parts.push(document.footer);
    }

    if (document.settings.attachHashtags) {
        parts.push(cleanHashtags(document.hashtags).join(" "));
    }

    return joinParts(parts);
}

export function TelegramFormatter(input: string) {
    let caption = input.replace(/\*([^\s].*?[^\s])\*/g, "**$1**");
    caption = caption.replace(/_([^\s].*?[^\s])_/g, "__$1__");
    caption = caption.replace(/~([^\s].*?[^\s])~/g, "~$1~");
    return caption;
}

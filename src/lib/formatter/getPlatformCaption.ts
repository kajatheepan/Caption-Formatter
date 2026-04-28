import type { CaptionDocument } from "@/types/caption";
import type { Platform } from "@/types/platform";

export function getPlatformCaption(document: CaptionDocument, platform: Platform) {
    const customText = document.customPlatformText[platform];

    if (customText && customText.trim()) {
        return customText;
    }

    return document.caption;
}

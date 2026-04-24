import { PLATFORM_CONFIG } from "@/lib/constants";
import type { CaptionDocument } from "@/types/caption";
import type { Platform } from "@/types/platform";
import type { FormattedOutput } from "./types";
import { InstagramFormatter } from "./instagramFormatter";
import { LinkedinFormatter } from "./linkedinFormatter";
import { formatTelegramCaption, TelegramFormatter } from "./telegramFormatter";
import { TwitterFormatter } from "./twitterFormatter";
import { formatWhatsappCaption, WhatsappFormatter } from "./whatsappFormatter";
import { YoutubeFormatter } from "./youtubeFormatter";

export { TelegramFormatter } from "./telegramFormatter";
export { YoutubeFormatter } from "./youtubeFormatter";
export { WhatsappFormatter } from "./whatsappFormatter";
export { InstagramFormatter } from "./instagramFormatter";
export { TwitterFormatter } from "./twitterFormatter";
export { LinkedinFormatter } from "./linkedinFormatter";

const formatters: Record<Platform, (input: string) => string> = {
    whatsapp: WhatsappFormatter,
    telegram: TelegramFormatter,
    youtube: YoutubeFormatter,
    instagram: InstagramFormatter,
    twitter: TwitterFormatter,
    linkedin: LinkedinFormatter,
};

const allPlatforms: Platform[] = [
    "whatsapp",
    "telegram",
    "youtube",
    "instagram",
    "twitter",
    "linkedin",
];

function joinCaptionParts(caption: string, footer: string) {
    if (caption && footer) {
        return `${caption}\n\n${footer}`;
    }

    return caption || footer;
}

function getRawTextForPlatform(platform: Platform, document: CaptionDocument) {
    if (platform === "whatsapp") {
        return formatWhatsappCaption(document);
    }

    if (platform === "telegram") {
        return formatTelegramCaption(document);
    }

    return joinCaptionParts(document.caption, document.footer);
}

export function formatForPlatform(
    platform: Platform,
    document: CaptionDocument
): FormattedOutput {
    const config = PLATFORM_CONFIG[platform];
    const rawText = getRawTextForPlatform(platform, document);
    const text = formatters[platform](rawText);
    const characterCount = text.length;

    return {
        platform,
        label: config.label,
        text,
        characterCount,
        characterLimit: config.limit,
        isOverLimit: characterCount > config.limit,
    };
}

export function formatAllPlatforms(document: CaptionDocument): FormattedOutput[] {
    return allPlatforms.map((platform) => formatForPlatform(platform, document));
}

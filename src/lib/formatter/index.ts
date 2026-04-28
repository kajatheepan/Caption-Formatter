import { PLATFORM_CONFIG } from "@/lib/constants";
import type { CaptionDocument } from "@/types/caption";
import type { Platform } from "@/types/platform";
import type { FormattedOutput } from "./types";
import { formatInstagramCaption, InstagramFormatter } from "./instagramFormatter";
import { formatLinkedinCaption, LinkedinFormatter } from "./linkedinFormatter";
import { formatTelegramCaption, TelegramFormatter } from "./telegramFormatter";
import { formatWhatsappCaption, WhatsappFormatter } from "./whatsappFormatter";
import { formatYoutubeCaption, YoutubeFormatter } from "./youtubeFormatter";
import { plainTextExporter } from "./exporters/plainTextExporter";
import { telegramRichTextExporter } from "./exporters/telegramRichTextExporter";
import { whatsappRichTextExporter } from "./exporters/whatsappRichTextExporter";

export { TelegramFormatter } from "./telegramFormatter";
export { YoutubeFormatter } from "./youtubeFormatter";
export { WhatsappFormatter } from "./whatsappFormatter";
export { InstagramFormatter } from "./instagramFormatter";
export { LinkedinFormatter } from "./linkedinFormatter";

const formatters: Record<Platform, (input: string) => string> = {
    whatsapp: WhatsappFormatter,
    telegram: TelegramFormatter,
    youtube: YoutubeFormatter,
    instagram: InstagramFormatter,
    linkedin: LinkedinFormatter,
};

const allPlatforms: Platform[] = [
    "whatsapp",
    "telegram",
    "youtube",
    "instagram",
    "linkedin",
];

function joinCaptionParts(caption: string, footer: string) {
    if (caption && footer) {
        return `${caption}\n\n${footer}`;
    }

    return caption || footer;
}

function getCaptionSource(platform: Platform, document: CaptionDocument) {
    if (!document.editorContent) {
        return document.caption;
    }

    if (platform === "whatsapp") {
        return whatsappRichTextExporter(document.editorContent);
    }

    if (platform === "telegram") {
        return telegramRichTextExporter(document.editorContent);
    }

    return plainTextExporter(document.editorContent);
}

function buildDocumentForPlatform(platform: Platform, document: CaptionDocument): CaptionDocument {
    return {
        ...document,
        caption: getCaptionSource(platform, document),
    };
}

function getRawTextForPlatform(platform: Platform, document: CaptionDocument) {
    const platformDocument = buildDocumentForPlatform(platform, document);

    if (platform === "whatsapp") {
        return formatWhatsappCaption(platformDocument);
    }

    if (platform === "telegram") {
        return formatTelegramCaption(platformDocument);
    }

    if (platform === "youtube") {
        return formatYoutubeCaption(platformDocument);
    }

    if (platform === "instagram") {
        return formatInstagramCaption(platformDocument);
    }

    if (platform === "linkedin") {
        return formatLinkedinCaption(platformDocument);
    }

    return joinCaptionParts(platformDocument.caption, platformDocument.footer);
}

function hasCustomPlatformText(platform: Platform, document: CaptionDocument) {
    return document.customPlatformText[platform] !== undefined;
}

export function formatForPlatform(
    platform: Platform,
    document: CaptionDocument
): FormattedOutput {
    const config = PLATFORM_CONFIG[platform];
    const rawText = hasCustomPlatformText(platform, document)
        ? document.customPlatformText[platform] ?? ""
        : getRawTextForPlatform(platform, document);
    const text = hasCustomPlatformText(platform, document) || document.editorContent
        ? rawText
        : formatters[platform](rawText);
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

import { PLATFORM_CONFIG } from "@/lib/constants";
import { cleanHashtags } from "@/lib/hashtags/cleanHashtags";
import type { CaptionDocument } from "@/types/caption";
import type { Platform } from "@/types/platform";
import type { FormattedOutput } from "./types";
import { formatInstagramCaption, InstagramFormatter } from "./instagramFormatter";
import { formatLinkedinCaption, LinkedinFormatter } from "./linkedinFormatter";
import { formatTelegramCaption, TelegramFormatter } from "./telegramFormatter";
import { formatWhatsappCaption, WhatsappFormatter } from "./whatsappFormatter";
import { formatYoutubeCaption, YoutubeFormatter } from "./youtubeFormatter";
import { plainTextExporter } from "./exporters/plainTextExporter";
import { telegramRichTextExportResult } from "./exporters/telegramRichTextExporter";
import { whatsappRichTextExportResult } from "./exporters/whatsappRichTextExporter";
import type { FormattingNotice } from "./rich-text/formattingPolicy";
import {
    exportRichTextHtmlForPlatform,
    joinClipboardHtmlParts,
    textToClipboardHtml,
} from "./rich-text/richTextHtmlExporter";

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

function getCaptionSource(platform: Platform, document: CaptionDocument): {
    caption: string;
    captionHtml?: string;
    formattingNotices: FormattingNotice[];
} {
    const customContent = document.customPlatformContent[platform];

    if (customContent) {
        if (platform === "whatsapp") {
            const result = whatsappRichTextExportResult(customContent);
            return {
                caption: result.text,
                captionHtml: exportRichTextHtmlForPlatform(customContent, "whatsapp"),
                formattingNotices: result.notices,
            };
        }

        if (platform === "telegram") {
            const result = telegramRichTextExportResult(customContent);
            return {
                caption: result.text,
                captionHtml: exportRichTextHtmlForPlatform(customContent, "telegram"),
                formattingNotices: result.notices,
            };
        }

        return {
            caption: plainTextExporter(customContent),
            formattingNotices: [],
        };
    }

    if (!document.editorContent) {
        return {
            caption: document.caption,
            formattingNotices: [],
        };
    }

    if (platform === "whatsapp") {
        const result = whatsappRichTextExportResult(document.editorContent);
        return {
            caption: result.text,
            captionHtml: exportRichTextHtmlForPlatform(document.editorContent, "whatsapp"),
            formattingNotices: result.notices,
        };
    }

    if (platform === "telegram") {
        const result = telegramRichTextExportResult(document.editorContent);
        return {
            caption: result.text,
            captionHtml: exportRichTextHtmlForPlatform(document.editorContent, "telegram"),
            formattingNotices: result.notices,
        };
    }

    return {
        caption: plainTextExporter(document.editorContent),
        formattingNotices: [],
    };
}

function buildDocumentForPlatform(platform: Platform, document: CaptionDocument): {
    document: CaptionDocument;
    captionHtml?: string;
    formattingNotices: FormattingNotice[];
} {
    const captionSource = getCaptionSource(platform, document);

    return {
        document: {
            ...document,
            caption: captionSource.caption,
        },
        captionHtml: captionSource.captionHtml,
        formattingNotices: captionSource.formattingNotices,
    };
}

function buildClipboardHtml(
    platform: Platform,
    document: CaptionDocument,
    captionHtml?: string
) {
    if ((platform !== "telegram" && platform !== "whatsapp") || !captionHtml) {
        return undefined;
    }

    const parts = [captionHtml];

    if (document.settings.includeFooter) {
        parts.push(textToClipboardHtml(document.footer));
    }

    if (document.settings.attachHashtags) {
        parts.push(textToClipboardHtml(cleanHashtags(document.hashtags).join(" ")));
    }

    return joinClipboardHtmlParts(parts);
}

function getRawTextForPlatform(platform: Platform, document: CaptionDocument) {
    const {
        document: platformDocument,
        captionHtml,
        formattingNotices,
    } = buildDocumentForPlatform(platform, document);
    const html = buildClipboardHtml(platform, document, captionHtml);
    let text: string;

    if (platform === "whatsapp") {
        text = formatWhatsappCaption(platformDocument);
        return { text, html, formattingNotices };
    }

    if (platform === "telegram") {
        text = formatTelegramCaption(platformDocument);
        return { text, html, formattingNotices };
    }

    if (platform === "youtube") {
        text = formatYoutubeCaption(platformDocument);
        return { text, formattingNotices };
    }

    if (platform === "instagram") {
        text = formatInstagramCaption(platformDocument);
        return { text, formattingNotices };
    }

    if (platform === "linkedin") {
        text = formatLinkedinCaption(platformDocument);
        return { text, formattingNotices };
    }

    return {
        text: joinCaptionParts(platformDocument.caption, platformDocument.footer),
        formattingNotices,
    };
}

function hasCustomPlatformText(platform: Platform, document: CaptionDocument) {
    return document.customPlatformText[platform] !== undefined;
}

export function formatForPlatform(
    platform: Platform,
    document: CaptionDocument
): FormattedOutput {
    const config = PLATFORM_CONFIG[platform];
    const formatted = hasCustomPlatformText(platform, document)
        ? { text: document.customPlatformText[platform] ?? "", html: undefined, formattingNotices: [] }
        : getRawTextForPlatform(platform, document);
    const rawText = formatted.text;
    const text = hasCustomPlatformText(platform, document) || document.editorContent
        ? rawText
        : formatters[platform](rawText);
    const characterCount = text.length;

    return {
        platform,
        label: config.label,
        text,
        html: formatted.html,
        characterCount,
        characterLimit: config.limit,
        isOverLimit: characterCount > config.limit,
        formattingNotices: formatted.formattingNotices,
    };
}

export function formatAllPlatforms(document: CaptionDocument): FormattedOutput[] {
    return allPlatforms.map((platform) => formatForPlatform(platform, document));
}

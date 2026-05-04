import type { JSONContent } from "@tiptap/core";

export type PlatformFormatting = "whatsapp" | "telegram" | "plain";

export type FormattingNotice = {
    type: "info" | "warning";
    message: string;
};

export type RichTextMarkType = "bold" | "italic" | "strike" | "underline" | "code" | "link" | "spoiler";

export type RichTextBlockType =
    | "doc"
    | "paragraph"
    | "text"
    | "hardBreak"
    | "bulletList"
    | "orderedList"
    | "listItem"
    | "blockquote"
    | "codeBlock";

export const ALLOWED_RICH_TEXT_NODES = new Set<RichTextBlockType>([
    "doc",
    "paragraph",
    "text",
    "hardBreak",
    "bulletList",
    "orderedList",
    "listItem",
    "blockquote",
    "codeBlock",
]);

export const ALLOWED_RICH_TEXT_MARKS = new Set<RichTextMarkType>([
    "bold",
    "italic",
    "strike",
    "underline",
    "code",
    "link",
    "spoiler",
]);

export const PLATFORM_SUPPORTED_MARKS: Record<PlatformFormatting, Set<RichTextMarkType>> = {
    whatsapp: new Set(["bold", "italic", "strike", "code"]),
    telegram: new Set(["bold", "italic", "strike", "code", "spoiler"]),
    plain: new Set(),
};

export const WHATSAPP_UNSUPPORTED_NOTICE =
    "Underline and hidden links are not supported by WhatsApp copy. They were converted to readable text.";
export const WHATSAPP_LIST_STRIKE_UNSUPPORTED_NOTICE =
    "Strike formatting inside lists is not reliable when pasted. It was copied as normal text.";
export const TELEGRAM_UNSUPPORTED_NOTICE =
    "Telegram chat paste supports bold, italic, strike, and inline code. Underline uses rich clipboard when supported; otherwise it becomes readable text.";
export const TELEGRAM_QUOTE_UNSUPPORTED_NOTICE =
    "Telegram copy does not support quote blocks. Quote text was copied as normal text.";
export const SPOILER_UNSUPPORTED_NOTICE =
    "Spoiler formatting is only available for Telegram. Other platforms keep the text readable.";
export const UNSUPPORTED_PASTE_NOTICE = "Unsupported pasted formatting was removed.";

export function createEmptyDocument(): JSONContent {
    return {
        type: "doc",
        content: [{ type: "paragraph" }],
    };
}

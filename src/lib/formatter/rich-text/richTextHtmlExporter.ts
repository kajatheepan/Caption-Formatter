import type { JSONContent } from "@tiptap/core";
import {
    WHATSAPP_UNSUPPORTED_NOTICE,
    type PlatformFormatting,
    type RichTextMarkType,
} from "./formattingPolicy";
import { sanitizeRichTextContent } from "./sanitizeRichText";

function escapeHtml(text: string) {
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}

function isSafeHref(value: unknown): value is string {
    return typeof value === "string" && /^(https?:\/\/|mailto:|tel:)/i.test(value);
}

function getHtmlSupportedMarks(platform: PlatformFormatting) {
    if (platform === "telegram") {
        return new Set<RichTextMarkType>(["bold", "italic", "strike", "underline", "code", "link", "spoiler"]);
    }

    if (platform === "whatsapp") {
        return new Set<RichTextMarkType>(["bold", "italic", "strike", "code"]);
    }

    return new Set<RichTextMarkType>();
}

function renderTextWithMarks(text: string, marks: JSONContent["marks"], platform: PlatformFormatting) {
    if (!marks?.length) {
        return escapeHtml(text);
    }

    const supportedMarks = getHtmlSupportedMarks(platform);
    const hasCode = marks.some((mark) => mark.type === "code");

    if (hasCode) {
        return `<code>${escapeHtml(text)}</code>`;
    }

    return marks.reduce((html, mark) => {
        const markType = mark.type as RichTextMarkType;

        if (!supportedMarks.has(markType)) {
            if (platform === "whatsapp" && markType === "link" && isSafeHref(mark.attrs?.href) && mark.attrs.href !== text) {
                return `${html} (${escapeHtml(mark.attrs.href)})`;
            }

            return html;
        }

        if (markType === "bold") return `<strong>${html}</strong>`;
        if (markType === "italic") return `<em>${html}</em>`;
        if (markType === "strike") return `<s>${html}</s>`;
        if (markType === "underline") return `<u>${html}</u>`;
        if (markType === "spoiler") return `<span data-spoiler="true">${html}</span>`;
        if (markType === "link" && isSafeHref(mark.attrs?.href)) {
            return `<a href="${escapeHtml(mark.attrs.href)}">${html}</a>`;
        }

        return html;
    }, escapeHtml(text));
}

function renderInlineContent(node: JSONContent, platform: PlatformFormatting): string {
    return (node.content ?? []).map((childNode) => renderNode(childNode, platform)).join("");
}

function renderList(node: JSONContent, platform: PlatformFormatting, tag: "ul" | "ol") {
    const listItems = (node.content ?? [])
        .map((childNode) => `<li>${renderInlineContent(childNode, platform)}</li>`)
        .join("");

    return `<${tag}>${listItems}</${tag}>`;
}

function renderCodeBlock(node: JSONContent) {
    const codeText = (node.content ?? []).map((childNode) => {
        if (childNode.type === "text") {
            return childNode.text ?? "";
        }

        return "";
    }).join("");
    const language = typeof node.attrs?.language === "string" && node.attrs.language.trim()
        ? ` data-language="${escapeHtml(node.attrs.language.trim())}"`
        : "";

    return `<pre${language}><code>${escapeHtml(codeText)}</code></pre>`;
}

function renderNode(node: JSONContent, platform: PlatformFormatting): string {
    if (node.type === "text") {
        return renderTextWithMarks(node.text ?? "", node.marks, platform);
    }

    if (node.type === "hardBreak") {
        return "<br>";
    }

    if (node.type === "paragraph") {
        return `<p>${renderInlineContent(node, platform)}</p>`;
    }

    if (node.type === "bulletList") {
        return renderList(node, platform, "ul");
    }

    if (node.type === "orderedList") {
        return renderList(node, platform, "ol");
    }

    if (node.type === "blockquote") {
        if (platform === "telegram") {
            return (node.content ?? []).map((childNode) => renderNode(childNode, platform)).join("");
        }

        return `<blockquote>${(node.content ?? []).map((childNode) => renderNode(childNode, platform)).join("")}</blockquote>`;
    }

    if (node.type === "codeBlock") {
        return renderCodeBlock(node);
    }

    if (node.type === "listItem") {
        return renderInlineContent(node, platform);
    }

    return (node.content ?? []).map((childNode) => renderNode(childNode, platform)).join("");
}

export function textToClipboardHtml(text: string) {
    return text
        .split(/\n{2,}/)
        .map((block) => `<p>${escapeHtml(block).replace(/\n/g, "<br>")}</p>`)
        .join("");
}

export function joinClipboardHtmlParts(parts: Array<string | undefined>) {
    return parts.filter((part) => part?.trim()).join("");
}

export function exportRichTextHtmlForPlatform(
    editorContent: JSONContent | null | undefined,
    platform: PlatformFormatting
) {
    if (!editorContent) {
        return "";
    }

    const { content } = sanitizeRichTextContent(editorContent);
    const html = renderNode(content, platform);

    if (platform === "whatsapp" && html.includes("<u>")) {
        return html.replace(/<\/?u>/g, "");
    }

    return html;
}

export const TELEGRAM_HTML_CLIPBOARD_NOTICE =
    "Telegram paste uses rich clipboard formatting. If an app ignores rich clipboard content, it may show markdown characters as plain text.";

export const WHATSAPP_HTML_CLIPBOARD_NOTICE = WHATSAPP_UNSUPPORTED_NOTICE;

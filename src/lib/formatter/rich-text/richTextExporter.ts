import type { JSONContent } from "@tiptap/core";
import {
    PLATFORM_SUPPORTED_MARKS,
    TELEGRAM_QUOTE_UNSUPPORTED_NOTICE,
    SPOILER_UNSUPPORTED_NOTICE,
    TELEGRAM_UNSUPPORTED_NOTICE,
    WHATSAPP_LIST_STRIKE_UNSUPPORTED_NOTICE,
    WHATSAPP_UNSUPPORTED_NOTICE,
    type FormattingNotice,
    type PlatformFormatting,
    type RichTextMarkType,
} from "./formattingPolicy";
import { sanitizeRichTextContent } from "./sanitizeRichText";

type ExportState = {
    platform: PlatformFormatting;
    notices: FormattingNotice[];
    insideList?: boolean;
};

function addNotice(state: ExportState, notice: FormattingNotice) {
    if (!state.notices.some((currentNotice) => currentNotice.message === notice.message)) {
        state.notices.push(notice);
    }
}

function escapeTelegramCode(text: string) {
    return text.replace(/[\\`]/g, "\\$&");
}

function escapeCodeBlockText(text: string, state: ExportState) {
    if (!text.includes("```")) {
        return text;
    }

    addNotice(state, {
        type: "info",
        message: "Triple backticks inside code blocks were spaced so the copied code block stays valid.",
    });

    return text.replace(/```/g, "``\u200B`");
}

function canUseWhatsAppDelimiter(text: string, delimiter: string) {
    return Boolean(text.trim()) && !text.includes("\n") && !text.includes(delimiter);
}

function wrapWhatsApp(text: string, delimiter: string, state: ExportState) {
    if (!canUseWhatsAppDelimiter(text, delimiter)) {
        addNotice(state, {
            type: "info",
            message: "Some formatting was flattened because the text contains conflicting markdown characters.",
        });
        return text;
    }

    return `${delimiter}${text}${delimiter}`;
}

function getPrimaryFormattingMark(marks: JSONContent["marks"], state: ExportState) {
    if (!marks?.length) {
        return null;
    }

    if (marks.some((mark) => mark.type === "code")) {
        return "code";
    }

    const supportedMarks = PLATFORM_SUPPORTED_MARKS[state.platform];
    const supportedTextMarks = marks
        .map((mark) => mark.type as RichTextMarkType)
        .filter((markType) => {
            if (state.platform === "whatsapp" && state.insideList && markType === "strike") {
                addNotice(state, { type: "info", message: WHATSAPP_LIST_STRIKE_UNSUPPORTED_NOTICE });
                return false;
            }

            return supportedMarks.has(markType);
        });

    if (supportedTextMarks.includes("spoiler")) return "spoiler";
    if (supportedTextMarks.includes("bold")) return "bold";
    if (supportedTextMarks.includes("italic")) return "italic";
    if (supportedTextMarks.includes("strike")) return "strike";

    return supportedTextMarks[0] ?? null;
}

function tryRenderWhatsAppCombined(text: string, supportedTextMarks: RichTextMarkType[], state: ExportState) {
    const delimiterFor: Record<RichTextMarkType, string> = {
        bold: "*",
        italic: "_",
        strike: "~",
        code: "`",
        underline: "",
        link: "",
        spoiler: "",
    } as const;

    const nestingOrder: RichTextMarkType[] = ["bold", "italic", "strike"];
    const marksToWrap = nestingOrder.filter((m) => supportedTextMarks.includes(m));

    if (marksToWrap.length <= 1) return null;
    if (!text.trim() || text.includes("\n")) return null;

    for (const mark of marksToWrap) {
        const delim = delimiterFor[mark];
        if (!delim) return null;
        if (text.includes(delim)) return null;
    }

    let rendered = text;
    for (const mark of marksToWrap.reverse()) {
        const delim = delimiterFor[mark];
        rendered = `${delim}${rendered}${delim}`;
    }

    return rendered;
}

function renderTextWithMarks(text: string, marks: JSONContent["marks"], state: ExportState) {
    if (state.platform === "plain" || !marks?.length) {
        return text;
    }

    const supportedMarks = PLATFORM_SUPPORTED_MARKS[state.platform];
    const supportedTextMarks = marks
        .map((mark) => mark.type as RichTextMarkType)
        .filter((markType) => {
            if (state.platform === "whatsapp" && state.insideList && markType === "strike") {
                addNotice(state, { type: "info", message: WHATSAPP_LIST_STRIKE_UNSUPPORTED_NOTICE });
                return false;
            }

            return supportedMarks.has(markType);
        });

    if (state.platform === "telegram" && supportedTextMarks.length > 1) {
        addNotice(state, {
            type: "info",
            message: "Combined text styles were simplified so pasted text stays reliable.",
        });
    }

    // For WhatsApp, try to emit nested delimiters when safe (e.g. `_~text~_`).
    if (state.platform === "whatsapp" && supportedTextMarks.length > 1) {
        const combined = tryRenderWhatsAppCombined(text, supportedTextMarks, state);
        if (combined) return combined;
        // otherwise fall through and simplify with primary mark below and add notice
        addNotice(state, {
            type: "info",
            message: "Combined text styles were simplified so pasted text stays reliable.",
        });
    }

    const primaryMark = getPrimaryFormattingMark(marks, state);

    if (primaryMark === "code") {
        if (state.platform === "telegram") {
            return `\`${escapeTelegramCode(text)}\``;
        }

        return wrapWhatsApp(text, "`", state);
    }

    for (const mark of marks) {
        const markType = mark.type as RichTextMarkType;

        if (state.platform === "whatsapp" && (markType === "underline" || markType === "link")) {
            addNotice(state, { type: "info", message: WHATSAPP_UNSUPPORTED_NOTICE });
        }
        if (state.platform === "whatsapp" && state.insideList && markType === "strike") {
            addNotice(state, { type: "info", message: WHATSAPP_LIST_STRIKE_UNSUPPORTED_NOTICE });
        }
        if (state.platform === "telegram" && (markType === "underline" || markType === "link")) {
            addNotice(state, { type: "info", message: TELEGRAM_UNSUPPORTED_NOTICE });
        }
        if (state.platform !== "telegram" && markType === "spoiler") {
            addNotice(state, { type: "info", message: SPOILER_UNSUPPORTED_NOTICE });
        }
    }

    let rendered = text;

    if (state.platform === "telegram") {
        if (primaryMark === "bold") rendered = `**${text}**`;
        if (primaryMark === "italic") rendered = `__${text}__`;
        if (primaryMark === "strike") rendered = `~~${text}~~`;
        if (primaryMark === "spoiler") rendered = `||${text}||`;
    } else if (state.platform === "whatsapp") {
        if (primaryMark === "bold") rendered = wrapWhatsApp(text, "*", state);
        if (primaryMark === "italic") rendered = wrapWhatsApp(text, "_", state);
        if (primaryMark === "strike") rendered = wrapWhatsApp(text, "~", state);
    }

    if (state.platform === "whatsapp") {
        const linkMark = marks.find((mark) => mark.type === "link" && typeof mark.attrs?.href === "string");
        if (linkMark && typeof linkMark.attrs?.href === "string" && linkMark.attrs.href !== text) {
            return `${rendered} (${linkMark.attrs.href})`;
        }
    }

    if (state.platform === "telegram") {
        const linkMark = marks.find((mark) => mark.type === "link" && typeof mark.attrs?.href === "string");
        if (linkMark && typeof linkMark.attrs?.href === "string" && linkMark.attrs.href !== text) {
            return `${rendered} (${linkMark.attrs.href})`;
        }
    }

    return rendered;
}

function joinBlocks(parts: string[]) {
    return parts
        .map((part) => part.trimEnd())
        .filter((part) => part.trim())
        .join("\n");
}

function renderInlineContent(node: JSONContent, state: ExportState) {
    return (node.content ?? []).map((childNode) => renderNode(childNode, state)).join("");
}

function renderPlainInlineContent(node: JSONContent) {
    return renderInlineContent(node, { platform: "plain", notices: [] });
}

function renderCodeBlock(node: JSONContent, state: ExportState) {
    const codeText = renderPlainInlineContent(node);

    if (state.platform === "plain") {
        return codeText;
    }

    const language = typeof node.attrs?.language === "string" && node.attrs.language.trim()
        ? node.attrs.language.trim()
        : "";
    const openingFence = language ? `\`\`\`${language}` : "```";

    return `${openingFence}\n${escapeCodeBlockText(codeText, state)}\n\`\`\``;
}

function renderListItem(node: JSONContent, state: ExportState) {
    const itemState = state.platform === "telegram"
        ? { ...state, platform: "plain" as const }
        : { ...state, insideList: true };

    return (node.content ?? [])
        .map((childNode) => renderNode(childNode, itemState))
        .join("\n")
        .trim();
}

function renderList(node: JSONContent, state: ExportState, ordered: boolean) {
    const start = typeof node.attrs?.start === "number" ? node.attrs.start : 1;

    return (node.content ?? [])
        .map((childNode, index) => {
            const marker = ordered ? `${start + index}.` : "-";
            return `${marker} ${renderListItem(childNode, state)}`.trimEnd();
        })
        .filter((line) => line.trim())
        .join("\n");
}

function renderQuote(node: JSONContent, state: ExportState) {
    const quoteText = state.platform === "telegram"
        ? joinBlocks((node.content ?? []).map((childNode) => renderPlainInlineContent(childNode)))
        : joinBlocks((node.content ?? []).map((childNode) => renderNode(childNode, state)));

    if (state.platform === "telegram") {
        addNotice(state, { type: "info", message: TELEGRAM_QUOTE_UNSUPPORTED_NOTICE });
        return quoteText;
    }

    return quoteText
        .split("\n")
        .map((line) => `> ${line}`)
        .join("\n");
}

function renderNode(node: JSONContent, state: ExportState): string {
    if (node.type === "text") {
        return renderTextWithMarks(node.text ?? "", node.marks, state);
    }

    if (node.type === "hardBreak") {
        return "\n";
    }

    if (node.type === "paragraph") {
        return renderInlineContent(node, state);
    }

    if (node.type === "bulletList") {
        return renderList(node, state, false);
    }

    if (node.type === "orderedList") {
        return renderList(node, state, true);
    }

    if (node.type === "listItem") {
        return renderListItem(node, state);
    }

    if (node.type === "blockquote") {
        return renderQuote(node, state);
    }

    if (node.type === "codeBlock") {
        return renderCodeBlock(node, state);
    }

    return joinBlocks((node.content ?? []).map((childNode) => renderNode(childNode, state)));
}

export function exportRichTextForPlatform(
    editorContent: JSONContent | null | undefined,
    platform: PlatformFormatting
): { text: string; notices: FormattingNotice[] } {
    if (!editorContent) {
        return { text: "", notices: [] };
    }

    const { content, notices } = sanitizeRichTextContent(editorContent);
    const state: ExportState = {
        platform,
        notices: [...notices],
    };

    return {
        text: renderNode(content, state).trim(),
        notices: state.notices,
    };
}

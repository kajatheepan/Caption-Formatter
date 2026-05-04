import type { JSONContent } from "@tiptap/core";
import {
    ALLOWED_RICH_TEXT_MARKS,
    ALLOWED_RICH_TEXT_NODES,
    UNSUPPORTED_PASTE_NOTICE,
    createEmptyDocument,
    type FormattingNotice,
    type RichTextMarkType,
} from "./formattingPolicy";

type SanitizerState = {
    removedUnsupportedFormatting: boolean;
};

function isSafeHref(value: unknown): value is string {
    if (typeof value !== "string") {
        return false;
    }

    return /^(https?:\/\/|mailto:|tel:)/i.test(value);
}

function sanitizeMarks(marks: JSONContent["marks"], state: SanitizerState): JSONContent["marks"] {
    if (!marks?.length) {
        return undefined;
    }

    const sanitizedMarks = marks.flatMap((mark) => {
        if (!ALLOWED_RICH_TEXT_MARKS.has(mark.type as RichTextMarkType)) {
            state.removedUnsupportedFormatting = true;
            return [];
        }

        if (mark.type === "link") {
            if (!isSafeHref(mark.attrs?.href)) {
                state.removedUnsupportedFormatting = true;
                return [];
            }

            return [{
                type: "link",
                attrs: {
                    href: mark.attrs.href,
                    target: null,
                    rel: "noopener noreferrer nofollow",
                },
            }];
        }

        return [{ type: mark.type }];
    });

    const hasCode = sanitizedMarks.some((mark) => mark.type === "code");
    const normalizedMarks = hasCode
        ? sanitizedMarks.filter((mark) => mark.type === "code")
        : sanitizedMarks;

    return normalizedMarks.length ? normalizedMarks : undefined;
}

function getPlainTextContent(nodes: JSONContent[] | undefined): string {
    return (nodes ?? []).map((node) => {
        if (node.type === "text") {
            return node.text ?? "";
        }

        if (node.type === "hardBreak") {
            return "\n";
        }

        return getPlainTextContent(node.content);
    }).join("");
}

function sanitizeNodeToArray(node: JSONContent, state: SanitizerState): JSONContent[] {
    if (!node.type || !ALLOWED_RICH_TEXT_NODES.has(node.type as never)) {
        state.removedUnsupportedFormatting = true;

        if (node.type === "image" && typeof node.attrs?.alt === "string" && node.attrs.alt.trim()) {
            return [{ type: "text", text: node.attrs.alt.trim() }];
        }

        return (node.content ?? []).flatMap((childNode) => sanitizeNodeToArray(childNode, state));
    }

    if (node.type === "text") {
        if (!node.text) {
            return [];
        }

        return [{
            type: "text",
            text: node.text,
            marks: sanitizeMarks(node.marks, state),
        }];
    }

    if (node.type === "hardBreak") {
        return [{ type: "hardBreak" }];
    }

    const sanitizedContent = (node.content ?? []).flatMap((childNode) => sanitizeNodeToArray(childNode, state));

    if (node.type === "doc") {
        return [{
            type: "doc",
            content: sanitizedContent.length ? sanitizedContent : [{ type: "paragraph" }],
        }];
    }

    if (node.type === "orderedList") {
        return [{
            type: "orderedList",
            attrs: {
                start: typeof node.attrs?.start === "number" ? node.attrs.start : 1,
            },
            content: sanitizedContent,
        }];
    }

    if (node.type === "codeBlock") {
        const codeText = getPlainTextContent(sanitizedContent);

        return [{
            type: "codeBlock",
            attrs: typeof node.attrs?.language === "string" && node.attrs.language.trim()
                ? { language: node.attrs.language.trim() }
                : undefined,
            content: codeText ? [{ type: "text", text: codeText }] : undefined,
        }];
    }

    return [{
        type: node.type,
        content: sanitizedContent.length ? sanitizedContent : undefined,
    }];
}

function normalizeTopLevelContent(content: JSONContent[]) {
    const normalizedContent: JSONContent[] = [];
    let pendingInlineContent: JSONContent[] = [];

    const flushInlineContent = () => {
        if (!pendingInlineContent.length) {
            return;
        }

        normalizedContent.push({
            type: "paragraph",
            content: pendingInlineContent,
        });
        pendingInlineContent = [];
    };

    for (const node of content) {
        if (node.type === "text" || node.type === "hardBreak") {
            pendingInlineContent.push(node);
            continue;
        }

        flushInlineContent();
        normalizedContent.push(node);
    }

    flushInlineContent();

    return normalizedContent.length ? normalizedContent : [{ type: "paragraph" }];
}

export function sanitizeRichTextContent(editorContent: JSONContent | null | undefined): {
    content: JSONContent;
    notices: FormattingNotice[];
} {
    if (!editorContent) {
        return {
            content: createEmptyDocument(),
            notices: [],
        };
    }

    const state: SanitizerState = {
        removedUnsupportedFormatting: false,
    };
    const sanitized = sanitizeNodeToArray(editorContent, state)[0] ?? createEmptyDocument();

    return {
        content: sanitized.type === "doc"
            ? { ...sanitized, content: normalizeTopLevelContent(sanitized.content ?? []) }
            : { type: "doc", content: normalizeTopLevelContent([sanitized]) },
        notices: state.removedUnsupportedFormatting
            ? [{ type: "info", message: UNSUPPORTED_PASTE_NOTICE }]
            : [],
    };
}

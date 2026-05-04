import type { JSONContent } from "@tiptap/core";
import { createEmptyDocument, type PlatformFormatting, type RichTextMarkType } from "./formattingPolicy";
import { sanitizeRichTextContent } from "./sanitizeRichText";

type InlineDelimiter = {
    marker: string;
    mark: RichTextMarkType;
};

const SHARED_DELIMITERS: InlineDelimiter[] = [
    { marker: "*", mark: "bold" },
    { marker: "_", mark: "italic" },
    { marker: "~", mark: "strike" },
];

const TELEGRAM_DELIMITERS: InlineDelimiter[] = [
    { marker: "**", mark: "bold" },
    { marker: "__", mark: "italic" },
    { marker: "~~", mark: "strike" },
    { marker: "||", mark: "spoiler" },
    { marker: "*", mark: "bold" },
    { marker: "_", mark: "italic" },
    { marker: "~", mark: "strike" },
];

function isEscaped(text: string, index: number) {
    let slashCount = 0;

    for (let cursor = index - 1; cursor >= 0 && text[cursor] === "\\"; cursor -= 1) {
        slashCount += 1;
    }

    return slashCount % 2 === 1;
}

function unescapeMarkdownText(text: string) {
    return text.replace(/\\([\\_*~`[\]()>.#!+\-=|{}])/g, "$1");
}

function textNode(text: string, marks?: JSONContent["marks"]): JSONContent[] {
    if (!text) {
        return [];
    }

    return marks?.length
        ? [{ type: "text", text: unescapeMarkdownText(text), marks }]
        : [{ type: "text", text: unescapeMarkdownText(text) }];
}

function normalizeInlineNodes(nodes: JSONContent[]) {
    return nodes.reduce<JSONContent[]>((normalizedNodes, node) => {
        const previousNode = normalizedNodes[normalizedNodes.length - 1];

        if (
            previousNode?.type === "text" &&
            node.type === "text" &&
            JSON.stringify(previousNode.marks ?? []) === JSON.stringify(node.marks ?? [])
        ) {
            previousNode.text = `${previousNode.text ?? ""}${node.text ?? ""}`;
            return normalizedNodes;
        }

        normalizedNodes.push(node);
        return normalizedNodes;
    }, []);
}

function findClosingMarker(text: string, marker: string, startIndex: number) {
    for (let index = startIndex; index < text.length; index += 1) {
        if (text.startsWith(marker, index) && !isEscaped(text, index)) {
            return index;
        }
    }

    return -1;
}

function findNextSpecial(text: string, startIndex: number, platform: PlatformFormatting) {
    const delimiters = platform === "telegram" ? TELEGRAM_DELIMITERS : SHARED_DELIMITERS;
    const candidates = [
        ...delimiters.map((delimiter) => ({
            index: text.indexOf(delimiter.marker, startIndex),
            delimiter,
        })),
        { index: text.indexOf("`", startIndex), delimiter: { marker: "`", mark: "code" as const } },
    ];

    if (platform === "telegram") {
        candidates.push({ index: text.indexOf("[", startIndex), delimiter: { marker: "[", mark: "link" as const } });
    }

    return candidates
        .filter((candidate) => candidate.index >= startIndex && !isEscaped(text, candidate.index))
        .sort((a, b) => a.index - b.index || b.delimiter.marker.length - a.delimiter.marker.length)[0] ?? null;
}

function parseTelegramLink(text: string, startIndex: number): { nodes: JSONContent[]; endIndex: number } | null {
    const labelEnd = findClosingMarker(text, "]", startIndex + 1);
    if (labelEnd === -1 || text[labelEnd + 1] !== "(") {
        return null;
    }

    const urlEnd = findClosingMarker(text, ")", labelEnd + 2);
    if (urlEnd === -1) {
        return null;
    }

    const label = text.slice(startIndex + 1, labelEnd);
    const href = text.slice(labelEnd + 2, urlEnd);

    if (!label.trim() || !/^(https?:\/\/|mailto:|tel:)/i.test(href)) {
        return null;
    }

    return {
        nodes: textNode(label, [{ type: "link", attrs: { href } }]),
        endIndex: urlEnd + 1,
    };
}

export function parseInlineMarkdown(text: string, platform: PlatformFormatting): JSONContent[] {
    if (platform === "plain") {
        return textNode(text);
    }

    const nodes: JSONContent[] = [];
    let cursor = 0;

    while (cursor < text.length) {
        const next = findNextSpecial(text, cursor, platform);

        if (!next) {
            nodes.push(...textNode(text.slice(cursor)));
            break;
        }

        if (next.index > cursor) {
            nodes.push(...textNode(text.slice(cursor, next.index)));
        }

        if (next.delimiter.mark === "link") {
            const linkMatch = parseTelegramLink(text, next.index);
            if (linkMatch) {
                nodes.push(...linkMatch.nodes);
                cursor = linkMatch.endIndex;
                continue;
            }

            nodes.push(...textNode(text[next.index]));
            cursor = next.index + 1;
            continue;
        }

        const marker = next.delimiter.marker;
        const contentStart = next.index + marker.length;
        const contentEnd = findClosingMarker(text, marker, contentStart);

        if (contentEnd === -1 || contentEnd === contentStart) {
            nodes.push(...textNode(marker));
            cursor = contentStart;
            continue;
        }

        const content = text.slice(contentStart, contentEnd);
        if (!content.trim() || content !== content.trim()) {
            nodes.push(...textNode(marker + content + marker));
            cursor = contentEnd + marker.length;
            continue;
        }

        if (next.delimiter.mark === "code") {
            nodes.push(...textNode(content, [{ type: "code" }]));
        } else {
            const childNodes = parseInlineMarkdown(content, platform);
            nodes.push(...childNodes.map((node) => {
                if (node.type !== "text") {
                    return node;
                }

                return {
                    ...node,
                    marks: [
                        { type: next.delimiter.mark },
                        ...(node.marks ?? []),
                    ],
                };
            }));
        }

        cursor = contentEnd + marker.length;
    }

    return normalizeInlineNodes(nodes);
}

function paragraphFromText(text: string, platform: PlatformFormatting): JSONContent {
    return {
        type: "paragraph",
        content: parseInlineMarkdown(text, platform),
    };
}

function paragraphFromPlainText(text: string): JSONContent {
    return {
        type: "paragraph",
        content: textNode(text),
    };
}

function listItemFromText(text: string, platform: PlatformFormatting): JSONContent {
    return {
        type: "listItem",
        content: [paragraphFromText(text, platform)],
    };
}

function codeBlockFromText(text: string, language?: string): JSONContent {
    return {
        type: "codeBlock",
        attrs: language ? { language } : undefined,
        content: text ? [{ type: "text", text }] : undefined,
    };
}

function getFenceOpening(line: string) {
    const match = line.match(/^\s*```(.*)$/);

    if (!match) {
        return null;
    }

    const afterFence = match[1] ?? "";
    const trimmedAfterFence = afterFence.trim();
    const language = trimmedAfterFence && /^[A-Za-z0-9_-]+$/.test(trimmedAfterFence)
        ? trimmedAfterFence
        : undefined;

    return {
        language,
        inlineCode: language ? "" : afterFence,
    };
}

function splitCodeFenceClose(line: string) {
    const closeIndex = line.indexOf("```");

    if (closeIndex === -1) {
        return null;
    }

    return line.slice(0, closeIndex);
}

export function parseMarkdownToRichText(value: string, platform: PlatformFormatting = "telegram"): JSONContent {
    if (!value.trim()) {
        return createEmptyDocument();
    }

    const lines = value.replace(/\r\n?/g, "\n").split("\n");
    const content: JSONContent[] = [];

    for (let index = 0; index < lines.length; index += 1) {
        const line = lines[index];

        if (!line.trim()) {
            content.push({ type: "paragraph" });
            continue;
        }

        const codeFenceOpening = getFenceOpening(line);
        if (codeFenceOpening) {
            const codeLines: string[] = codeFenceOpening.inlineCode ? [codeFenceOpening.inlineCode] : [];
            let closingIndex = -1;

            for (let cursor = index + 1; cursor < lines.length; cursor += 1) {
                const closingLine = splitCodeFenceClose(lines[cursor]);

                if (closingLine !== null) {
                    if (closingLine) {
                        codeLines.push(closingLine);
                    }
                    closingIndex = cursor;
                    break;
                }

                codeLines.push(lines[cursor]);
            }

            if (closingIndex === -1) {
                content.push(paragraphFromPlainText(line));
                for (let cursor = index + 1; cursor < lines.length; cursor += 1) {
                    content.push(paragraphFromPlainText(lines[cursor]));
                }
                index = lines.length;
                continue;
            }

            content.push(codeBlockFromText(codeLines.join("\n"), codeFenceOpening.language));
            index = closingIndex;

            continue;
        }

        const quoteMatch = line.match(/^\s*>\s?(.*)$/);
        if (quoteMatch) {
            const quoteContent: JSONContent[] = [];

            while (index < lines.length) {
                const currentQuote = lines[index].match(/^\s*>\s?(.*)$/);
                if (!currentQuote) {
                    break;
                }

                quoteContent.push(paragraphFromText(currentQuote[1], platform));
                index += 1;
            }

            index -= 1;
            content.push({ type: "blockquote", content: quoteContent });
            continue;
        }

        const bulletMatch = line.match(/^\s*-\s+(.+)$/);
        if (bulletMatch) {
            const items: JSONContent[] = [];

            while (index < lines.length) {
                const currentItem = lines[index].match(/^\s*-\s+(.+)$/);
                if (!currentItem) {
                    break;
                }

                items.push(listItemFromText(currentItem[1], platform));
                index += 1;
            }

            index -= 1;
            content.push({ type: "bulletList", content: items });
            continue;
        }

        const orderedMatch = line.match(/^\s*(\d{1,2})\.\s+(.+)$/);
        if (orderedMatch) {
            const items: JSONContent[] = [];
            const start = Number(orderedMatch[1]);

            while (index < lines.length) {
                const currentItem = lines[index].match(/^\s*\d{1,2}\.\s+(.+)$/);
                if (!currentItem) {
                    break;
                }

                items.push(listItemFromText(currentItem[1], platform));
                index += 1;
            }

            index -= 1;
            content.push({
                type: "orderedList",
                attrs: { start: Number.isFinite(start) ? start : 1 },
                content: items,
            });
            continue;
        }

        content.push(paragraphFromText(line, platform));
    }

    return sanitizeRichTextContent({ type: "doc", content }).content;
}

import type { JSONContent } from "@tiptap/core";

type RichTextSyntax = {
    bold?: (text: string) => string;
    italic?: (text: string) => string;
    underline?: (text: string) => string;
    strike?: (text: string) => string;
    code?: (text: string) => string;
    codeBlock?: (text: string) => string;
    link?: (text: string, href: string) => string;
    spoiler?: (text: string) => string;
    quote?: (text: string) => string;
};

function joinBlocks(parts: string[]) {
    return parts
        .map((part) => part.trimEnd())
        .filter((part) => part.trim())
        .join("\n\n");
}

function renderMarks(text: string, marks: JSONContent["marks"], syntax: RichTextSyntax) {
    if (!marks?.length) {
        return text;
    }

    return marks.reduce((currentText, mark) => {
        if (mark.type === "bold" && syntax.bold) {
            return syntax.bold(currentText);
        }

        if (mark.type === "italic" && syntax.italic) {
            return syntax.italic(currentText);
        }

        if (mark.type === "underline" && syntax.underline) {
            return syntax.underline(currentText);
        }

        if (mark.type === "strike" && syntax.strike) {
            return syntax.strike(currentText);
        }

        if (mark.type === "code" && syntax.code) {
            return syntax.code(currentText);
        }

        if (mark.type === "link" && syntax.link && typeof mark.attrs?.href === "string") {
            return syntax.link(currentText, mark.attrs.href);
        }

        if (mark.type === "spoiler" && syntax.spoiler) {
            return syntax.spoiler(currentText);
        }

        return currentText;
    }, text);
}

function renderInlineContent(node: JSONContent, syntax: RichTextSyntax) {
    return (node.content ?? []).map((childNode) => renderNode(childNode, syntax)).join("");
}

function renderListItem(node: JSONContent, syntax: RichTextSyntax) {
    return (node.content ?? [])
        .map((childNode) => renderNode(childNode, syntax))
        .join("\n")
        .trim();
}

function renderList(node: JSONContent, syntax: RichTextSyntax, ordered: boolean) {
    const start = typeof node.attrs?.start === "number" ? node.attrs.start : 1;

    return (node.content ?? [])
        .map((childNode, index) => {
            const marker = ordered ? `${start + index}.` : "-";
            return `${marker} ${renderListItem(childNode, syntax)}`.trimEnd();
        })
        .filter((line) => line.trim())
        .join("\n");
}

function renderQuote(node: JSONContent, syntax: RichTextSyntax) {
    const quoteText = joinBlocks((node.content ?? []).map((childNode) => renderNode(childNode, syntax)));

    if (!syntax.quote) {
        return quoteText;
    }

    return quoteText
        .split("\n")
        .map((line) => syntax.quote?.(line) ?? line)
        .join("\n");
}

function renderNode(node: JSONContent, syntax: RichTextSyntax): string {
    if (node.type === "text") {
        return renderMarks(node.text ?? "", node.marks, syntax);
    }

    if (node.type === "hardBreak") {
        return "\n";
    }

    if (node.type === "paragraph") {
        return renderInlineContent(node, syntax);
    }

    if (node.type === "bulletList") {
        return renderList(node, syntax, false);
    }

    if (node.type === "orderedList") {
        return renderList(node, syntax, true);
    }

    if (node.type === "listItem") {
        return renderListItem(node, syntax);
    }

    if (node.type === "blockquote") {
        return renderQuote(node, syntax);
    }

    if (node.type === "codeBlock") {
        const codeText = renderInlineContent(node, {});
        return syntax.codeBlock ? syntax.codeBlock(codeText) : codeText;
    }

    return joinBlocks((node.content ?? []).map((childNode) => renderNode(childNode, syntax)));
}

export function renderRichText(editorContent: JSONContent | null | undefined, syntax: RichTextSyntax) {
    if (!editorContent) {
        return "";
    }

    return renderNode(editorContent, syntax).trim();
}

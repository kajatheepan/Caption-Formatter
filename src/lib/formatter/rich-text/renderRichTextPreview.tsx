import type { JSONContent } from "@tiptap/core";
import type { ReactNode } from "react";
import { parseInlineMarkdown, parseMarkdownToRichText } from "./markdownParser";
import type { PlatformFormatting } from "./formattingPolicy";

function renderMarkedText(text: string, marks: JSONContent["marks"], key: string): ReactNode {
    if (!marks?.length) {
        return <span key={key}>{text}</span>;
    }

    return marks.reduce<ReactNode>((currentNode, mark, index) => {
        const markKey = `${key}-${mark.type}-${index}`;

        if (mark.type === "bold") {
            return <strong key={markKey}>{currentNode}</strong>;
        }

        if (mark.type === "italic") {
            return <em key={markKey}>{currentNode}</em>;
        }

        if (mark.type === "strike") {
            return <span key={markKey} className="line-through">{currentNode}</span>;
        }

        if (mark.type === "underline") {
            return <span key={markKey} className="underline underline-offset-2">{currentNode}</span>;
        }

        if (mark.type === "code") {
            return (
                <code key={markKey} className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-[0.92em] text-zinc-900">
                    {currentNode}
                </code>
            );
        }

        if (mark.type === "spoiler") {
            return (
                <span key={markKey} className="rounded bg-zinc-800 px-1 text-zinc-800 selection:bg-zinc-700">
                    {currentNode}
                </span>
            );
        }

        if (mark.type === "link" && typeof mark.attrs?.href === "string") {
            return (
                <span key={markKey} className="underline underline-offset-2">
                    {currentNode}
                </span>
            );
        }

        return currentNode;
    }, <span key={key}>{text}</span>);
}

function renderInlineContent(node: JSONContent, keyPrefix: string): ReactNode[] {
    return (node.content ?? []).map((childNode, index) => renderNode(childNode, `${keyPrefix}-${index}`));
}

function renderNode(node: JSONContent, key: string): ReactNode {
    if (node.type === "text") {
        return renderMarkedText(node.text ?? "", node.marks, key);
    }

    if (node.type === "hardBreak") {
        return <br key={key} />;
    }

    if (node.type === "paragraph") {
        return (
            <div key={key} className="min-h-5">
                {renderInlineContent(node, key)}
            </div>
        );
    }

    if (node.type === "bulletList") {
        return (
            <ul key={key} className="list-disc space-y-0.5 pl-5">
                {(node.content ?? []).map((childNode, index) => renderNode(childNode, `${key}-li-${index}`))}
            </ul>
        );
    }

    if (node.type === "orderedList") {
        return (
            <ol key={key} className="list-decimal space-y-0.5 pl-5">
                {(node.content ?? []).map((childNode, index) => renderNode(childNode, `${key}-li-${index}`))}
            </ol>
        );
    }

    if (node.type === "listItem") {
        return (
            <li key={key}>
                {renderInlineContent(node, key)}
            </li>
        );
    }

    if (node.type === "blockquote") {
        return (
            <blockquote key={key} className="border-l-4 border-zinc-300 pl-3 text-zinc-700">
                {(node.content ?? []).map((childNode, index) => renderNode(childNode, `${key}-quote-${index}`))}
            </blockquote>
        );
    }

    if (node.type === "codeBlock") {
        const codeText = (node.content ?? []).map((childNode) => childNode.text ?? "").join("");

        return (
            <pre key={key} className="overflow-x-auto rounded-lg bg-zinc-900 px-3 py-2 text-xs leading-5 text-zinc-50">
                <code>{codeText}</code>
            </pre>
        );
    }

    return <span key={key}>{renderInlineContent(node, key)}</span>;
}

export function renderRichTextContentPreview(content: JSONContent, formatting: PlatformFormatting) {
    const nodes = content.content?.length ? content.content : [{ type: "paragraph", content: [] }];

    return (
        <div className="space-y-1">
            {nodes.map((node, index) => renderNode(node, `${formatting}-preview-${index}`))}
        </div>
    );
}

function renderTelegramComposerPreview(text: string) {
    const lines = text.split("\n");

    return (
        <div>
            {lines.map((line, index) => (
                <div key={index} className="min-h-5">
                    {line
                        ? parseInlineMarkdown(line, "telegram").map((node, nodeIndex) =>
                            renderNode(node, `telegram-preview-${index}-${nodeIndex}`)
                        )
                        : "\u00a0"}
                </div>
            ))}
        </div>
    );
}

export function renderRichTextPreview(text: string, formatting: PlatformFormatting) {
    if (formatting === "telegram" && !text.includes("```")) {
        return renderTelegramComposerPreview(text);
    }

    const doc = parseMarkdownToRichText(text, formatting);
    return renderRichTextContentPreview(doc, formatting);
}

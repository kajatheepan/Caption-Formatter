import type { JSONContent } from "@tiptap/core";
import React, { useState } from "react";
import type { ReactNode } from "react";
import { parseMarkdownToRichText } from "./markdownParser";
import type { PlatformFormatting } from "./formattingPolicy";

function Spoiler({ children }: { children: ReactNode }) {
    const [revealed, setRevealed] = useState(false);

    React.useEffect(() => {
        if (typeof document === "undefined") return;
        if (document.getElementById("tg-spoiler-styles")) return;

        const style = document.createElement("style");
        style.id = "tg-spoiler-styles";
        style.innerHTML = `
            @keyframes tgSpoilerMove { from { background-position: 0 0 } to { background-position: 100% 0 } }
            .tg-spoiler-overlay {
                background-image: linear-gradient(90deg, rgba(0,0,0,0.18) 0.5rem, rgba(0,0,0,0.04) 1.5rem, rgba(0,0,0,0.18) 2.5rem);
                background-size: 200% 100%;
                animation: tgSpoilerMove 1.6s linear infinite;
            }
        `;

        document.head.appendChild(style);
    }, []);

    return (
        <button
            type="button"
            onClick={() => setRevealed((r) => !r)}
            className="relative inline-flex items-center rounded px-0.5"
            aria-pressed={revealed}
        >
            <span className={`relative z-10 transition-colors duration-200 ${revealed ? "text-inherit" : "text-transparent"}`}>
                {children}
            </span>

            <span
                aria-hidden
                className={`tg-spoiler-overlay absolute inset-0 z-20 rounded ${revealed ? "opacity-0" : "opacity-100"} transition-opacity duration-200`}
            />
        </button>
    );
}

function TelegramCodeBlock({ code, language }: { code: string; language?: string }) {
    const [copied, setCopied] = useState(false);
    const languageLabel = (language ?? "code").toLowerCase();

    const handleCopy = async () => {
        try {
            if (navigator?.clipboard?.writeText) {
                await navigator.clipboard.writeText(code);
                setCopied(true);
                setTimeout(() => setCopied(false), 1500);
            }
        } catch (e) {
            // ignore copy errors
        }
    };

    function highlightCode(codeText: string, lang?: string) {
        const l = (lang ?? "").toLowerCase();
        if (!(l.startsWith("js") || l.startsWith("javascript"))) {
            return <>{codeText}</>;
        }

        const parts: ReactNode[] = [];
        const tokenRegex = /([a-zA-Z_$][a-zA-Z0-9_$]*)|(\d+(?:\.\d+)?)|([(){}\[\].,;:+\-*/%<>=!&|?]+)/g;
        const jsKeywords = new Set(["let", "const", "var", "if", "else", "for", "while", "return", "function", "true", "false", "null"]);
        let lastIndex = 0;
        let match: RegExpExecArray | null;

        while ((match = tokenRegex.exec(codeText)) !== null) {
            if (match.index > lastIndex) {
                parts.push(codeText.slice(lastIndex, match.index));
            }

            const token = match[0];
            if (jsKeywords.has(token)) {
                parts.push(<span key={`kw-${match.index}`} className="text-[#4BA3E3]">{token}</span>);
            } else if (/^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(token)) {
                parts.push(<span key={`id-${match.index}`} className="text-[#56A47A]">{token}</span>);
            } else if (/^(\d+(?:\.\d+)?)$/.test(token) || /^[(){}\[\].,;:+\-*/%<>=!&|?]+$/.test(token)) {
                parts.push(<span key={`sym-${match.index}`} className="text-[#E56B6F]">{token}</span>);
            } else {
                parts.push(token);
            }

            lastIndex = match.index + token.length;
        }

        if (lastIndex < codeText.length) {
            parts.push(codeText.slice(lastIndex));
        }

        return <>{parts}</>;
    }

    return (
        <div className="my-1 w-full">
            <div className="relative w-full max-w-full rounded-[9px] bg-[#DBF1D0] pb-2.5 pl-4 pr-3 pt-1.5">
                <span aria-hidden className="absolute inset-y-0 left-0 w-[5px] rounded-l-[9px] bg-[#56A47A]" />

                <div className="mb-1.5 flex items-start justify-between gap-3">
                    <span className="font-mono text-[17px] font-semibold lowercase leading-none text-[#56A47A]">
                        {languageLabel}
                    </span>

                    <button
                        type="button"
                        onClick={handleCopy}
                        className="shrink-0 text-[#94C7B1] transition-colors hover:text-[#83b9a2] active:text-[#73ab94]"
                        aria-label="Copy code"
                        title={copied ? "Copied" : "Copy"}
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect x="10" y="3" width="10" height="14" rx="2" stroke="currentColor" strokeWidth="1.8"/>
                            <path d="M7 7H6a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </button>
                </div>

                <pre className="m-0 max-w-full overflow-x-auto whitespace-pre text-left font-mono text-[13px] leading-5 text-[#41584A]">
                    <code>{highlightCode(code, languageLabel)}</code>
                </pre>
            </div>
        </div>
    );
}

function WhatsAppCodeBlock({ code }: { code: string }) {
    return (
        <div className="my-1 max-w-full">
            <pre className="m-0 max-w-full overflow-x-auto whitespace-pre text-left font-mono text-[13px] leading-6 tracking-[0.01em] text-[#1f2937]">
                <code>{code}</code>
            </pre>
        </div>
    );
}

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
            return <span key={markKey} className="line-through decoration-[1.5px]">{currentNode}</span>;
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
                <Spoiler key={markKey}>{currentNode}</Spoiler>
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

function renderInlineContent(node: JSONContent, keyPrefix: string, formatting: PlatformFormatting): ReactNode[] {
    return (node.content ?? []).map((childNode, index) => renderNode(childNode, `${keyPrefix}-${index}`, formatting));
}

function renderNode(node: JSONContent, key: string, formatting: PlatformFormatting): ReactNode {
    if (node.type === "text") {
        return renderMarkedText(node.text ?? "", node.marks, key);
    }

    if (node.type === "hardBreak") {
        return <br key={key} />;
    }

    if (node.type === "paragraph") {
        return (
            <div key={key} className="min-h-5 leading-5">
                {renderInlineContent(node, key, formatting)}
            </div>
        );
    }

    if (node.type === "bulletList") {
        return (
            <ul key={key} className="list-disc space-y-0.5 pl-5 leading-5">
                {(node.content ?? []).map((childNode, index) => renderNode(childNode, `${key}-li-${index}`, formatting))}
            </ul>
        );
    }

    if (node.type === "orderedList") {
        return (
            <ol key={key} className="list-decimal space-y-0.5 pl-5 leading-5">
                {(node.content ?? []).map((childNode, index) => renderNode(childNode, `${key}-li-${index}`, formatting))}
            </ol>
        );
    }

    if (node.type === "listItem") {
        return (
            <li key={key}>
                {renderInlineContent(node, key, formatting)}
            </li>
        );
    }

    if (node.type === "blockquote") {
        return (
            <blockquote key={key} className="border-l-4 border-zinc-300 pl-3 text-zinc-700 leading-5">
                {(node.content ?? []).map((childNode, index) => renderNode(childNode, `${key}-quote-${index}`, formatting))}
            </blockquote>
        );
    }

    if (node.type === "codeBlock") {
        const codeText = (node.content ?? []).map((childNode) => childNode.text ?? "").join("");
        const language = typeof node.attrs?.language === "string" ? node.attrs.language : undefined;

        return (
            <div key={key} className="py-1">
                {formatting === "telegram"
                    ? <TelegramCodeBlock code={codeText} language={language} />
                    : <WhatsAppCodeBlock code={codeText} />}
            </div>
        );
    }
    
    // Fallback for unhandled node types: render their inline content
    return <span key={key}>{renderInlineContent(node, key, formatting)}</span>;
}

export function renderRichTextContentPreview(content: JSONContent, formatting: PlatformFormatting) {
    const nodes = content.content?.length ? content.content : [{ type: "paragraph", content: [] }];

    return (
        <div className="space-y-1.5">
            {nodes.map((node, index) => renderNode(node, `${formatting}-preview-${index}`, formatting))}
        </div>
    );
}

export function renderRichTextPreview(text: string, formatting: PlatformFormatting) {
    const doc = parseMarkdownToRichText(text, formatting);
    return renderRichTextContentPreview(doc, formatting);
}

import { describe, expect, it } from "vitest";
import { exportRichTextForPlatform } from "./richTextExporter";

const richDoc = {
    type: "doc",
    content: [{
        type: "paragraph",
        content: [
            { type: "text", text: "Bold", marks: [{ type: "bold" }] },
            { type: "text", text: " " },
            { type: "text", text: "Under", marks: [{ type: "underline" }] },
            { type: "text", text: " " },
            { type: "text", text: "Site", marks: [{ type: "link", attrs: { href: "https://example.com?a=1)" } }] },
        ],
    }],
};

describe("exportRichTextForPlatform", () => {
    it("exports WhatsApp-safe markdown and flattens unsupported marks", () => {
        const result = exportRichTextForPlatform(richDoc, "whatsapp");

        expect(result.text).toBe("*Bold* Under Site (https://example.com?a=1))");
        expect(result.notices).toContainEqual({
            type: "info",
            message: "Underline and hidden links are not supported by WhatsApp copy. They were converted to readable text.",
        });
    });

    it("exports Telegram chat-safe markdown and flattens unsupported marks", () => {
        const result = exportRichTextForPlatform(richDoc, "telegram");

        expect(result.text).toBe("**Bold** Under Site (https://example.com?a=1))");
        expect(result.notices).toContainEqual({
            type: "info",
            message: "Telegram chat paste supports bold, italic, strike, and inline code. Underline uses rich clipboard when supported; otherwise it becomes readable text.",
        });
    });

    it("simplifies nested Telegram marks to one reliable pasted style", () => {
        const result = exportRichTextForPlatform({
            type: "doc",
            content: [{
                type: "paragraph",
                content: [{
                    type: "text",
                    text: "nested",
                    marks: [{ type: "italic" }, { type: "bold" }, { type: "strike" }],
                }],
            }],
        }, "telegram");

        expect(result.text).toBe("**nested**");
        expect(result.notices).toContainEqual({
            type: "info",
            message: "Combined text styles were simplified so pasted text stays reliable.",
        });
    });

    it("simplifies nested WhatsApp marks to one reliable pasted style", () => {
        const result = exportRichTextForPlatform({
            type: "doc",
            content: [{
                type: "paragraph",
                content: [{
                    type: "text",
                    text: "nested",
                    marks: [{ type: "italic" }, { type: "strike" }],
                }],
            }],
        }, "whatsapp");

        // New behavior: when safe, WhatsApp exports nested delimiters (italic outside, strike inside)
        expect(result.text).toBe("_~nested~_");
    });

    it("does not add blank lines between normal paragraphs", () => {
        const result = exportRichTextForPlatform({
            type: "doc",
            content: [
                {
                    type: "paragraph",
                    content: [{ type: "text", text: "first line" }],
                },
                {
                    type: "paragraph",
                    content: [{ type: "text", text: "second line" }],
                },
                {
                    type: "paragraph",
                    content: [{ type: "text", text: "third line" }],
                },
            ],
        }, "whatsapp");

        expect(result.text).toBe("first line\nsecond line\nthird line");
    });

    it("keeps Telegram list and quote fallback readable without nested markers", () => {
        const result = exportRichTextForPlatform({
            type: "doc",
            content: [
                {
                    type: "orderedList",
                    attrs: { start: 1 },
                    content: [{
                        type: "listItem",
                        content: [{
                            type: "paragraph",
                            content: [{
                                type: "text",
                                text: "ikhkhkhh",
                                marks: [{ type: "strike" }, { type: "bold" }],
                            }],
                        }],
                    }],
                },
                {
                    type: "blockquote",
                    content: [{
                        type: "paragraph",
                        content: [{
                            type: "text",
                            text: "one thing",
                            marks: [{ type: "italic" }, { type: "bold" }],
                        }],
                    }],
                },
            ],
        }, "telegram");

        expect(result.text).toBe("1. ikhkhkhh\none thing");
        expect(result.notices).toContainEqual({
            type: "info",
            message: "Telegram copy does not support quote blocks. Quote text was copied as normal text.",
        });
    });

    it("exports Telegram spoiler syntax and flattens spoiler elsewhere", () => {
        const doc = {
            type: "doc",
            content: [{
                type: "paragraph",
                content: [{
                    type: "text",
                    text: "secret",
                    marks: [{ type: "spoiler" }],
                }],
            }],
        };

        expect(exportRichTextForPlatform(doc, "telegram").text).toBe("||secret||");

        const whatsappResult = exportRichTextForPlatform(doc, "whatsapp");
        expect(whatsappResult.text).toBe("secret");
        expect(whatsappResult.notices).toContainEqual({
            type: "info",
            message: "Spoiler formatting is only available for Telegram. Other platforms keep the text readable.",
        });
    });

    it("flattens WhatsApp strike marks inside lists so tildes are not copied", () => {
        const result = exportRichTextForPlatform({
            type: "doc",
            content: [{
                type: "bulletList",
                content: [
                    {
                        type: "listItem",
                        content: [{
                            type: "paragraph",
                            content: [{
                                type: "text",
                                text: "Bold + strike",
                                marks: [{ type: "bold" }, { type: "strike" }],
                            }, {
                                type: "text",
                                text: " combination",
                            }],
                        }],
                    },
                    {
                        type: "listItem",
                        content: [{
                            type: "paragraph",
                            content: [{
                                type: "text",
                                text: "strike only",
                                marks: [{ type: "strike" }],
                            }],
                        }],
                    },
                ],
            }],
        }, "whatsapp");

        expect(result.text).toBe("- *Bold + strike* combination\n- strike only");
        expect(result.notices).toContainEqual({
            type: "info",
            message: "Strike formatting inside lists is not reliable when pasted. It was copied as normal text.",
        });
    });

    it("keeps unsupported rich text out of plain platform exports", () => {
        const result = exportRichTextForPlatform(richDoc, "plain");

        expect(result.text).toBe("Bold Under Site");
    });

    it("exports code blocks with fenced markdown for WhatsApp and Telegram", () => {
        const doc = {
            type: "doc",
            content: [{
                type: "codeBlock",
                attrs: { language: "python" },
                content: [{ type: "text", text: "print('*literal*')" }],
            }],
        };

        expect(exportRichTextForPlatform(doc, "telegram").text).toBe("```python\nprint('*literal*')\n```");
        expect(exportRichTextForPlatform(doc, "whatsapp").text).toBe("```python\nprint('*literal*')\n```");
        expect(exportRichTextForPlatform(doc, "plain").text).toBe("print('*literal*')");
    });

    it("keeps inner backticks from breaking copied code blocks", () => {
        const result = exportRichTextForPlatform({
            type: "doc",
            content: [{
                type: "codeBlock",
                content: [{ type: "text", text: "```" }],
            }],
        }, "telegram");

        expect(result.text).toBe("```\n``\u200B`\n```");
        expect(result.notices).toContainEqual({
            type: "info",
            message: "Triple backticks inside code blocks were spaced so the copied code block stays valid.",
        });
    });
});

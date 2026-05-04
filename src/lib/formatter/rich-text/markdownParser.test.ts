import { describe, expect, it } from "vitest";
import { parseMarkdownToRichText } from "./markdownParser";

describe("parseMarkdownToRichText", () => {
    it("converts shared markdown markers into TipTap marks", () => {
        const doc = parseMarkdownToRichText("*bold* _italic_ ~strike~ `code`", "whatsapp");
        const paragraph = doc.content?.[0];

        expect(paragraph?.content).toEqual([
            { type: "text", text: "bold", marks: [{ type: "bold" }] },
            { type: "text", text: " " },
            { type: "text", text: "italic", marks: [{ type: "italic" }] },
            { type: "text", text: " " },
            { type: "text", text: "strike", marks: [{ type: "strike" }] },
            { type: "text", text: " " },
            { type: "text", text: "code", marks: [{ type: "code" }] },
        ]);
    });

    it("converts nested WhatsApp markdown combinations into stacked TipTap marks", () => {
        const doc = parseMarkdownToRichText("*_Bold + italic_* *~Bold + strike~*", "whatsapp");

        expect(doc.content?.[0]?.content).toEqual([
            {
                type: "text",
                text: "Bold + italic",
                marks: [{ type: "bold" }, { type: "italic" }],
            },
            { type: "text", text: " " },
            {
                type: "text",
                text: "Bold + strike",
                marks: [{ type: "bold" }, { type: "strike" }],
            },
        ]);
    });

    it("keeps unmatched markers as plain text", () => {
        const doc = parseMarkdownToRichText("This is *not closed and _also open", "telegram");

        expect(doc.content?.[0]?.content).toEqual([
            { type: "text", text: "This is *not closed and _also open" },
        ]);
    });

    it("keeps loose markdown markers with edge spaces as plain text", () => {
        const doc = parseMarkdownToRichText("* bold with wrong spacing * _ italic with wrong spacing _ ~ strike with wrong spacing ~", "whatsapp");

        expect(doc.content?.[0]?.content).toEqual([
            {
                type: "text",
                text: "* bold with wrong spacing * _ italic with wrong spacing _ ~ strike with wrong spacing ~",
            },
        ]);
    });

    it("supports Telegram chat composer inline markers and links", () => {
        const doc = parseMarkdownToRichText("**bold** __italic__ ~~strike~~ ||secret|| [site](https://example.com)", "telegram");

        expect(doc.content?.[0]?.content).toEqual([
            { type: "text", text: "bold", marks: [{ type: "bold" }] },
            { type: "text", text: " " },
            { type: "text", text: "italic", marks: [{ type: "italic" }] },
            { type: "text", text: " " },
            { type: "text", text: "strike", marks: [{ type: "strike" }] },
            { type: "text", text: " " },
            { type: "text", text: "secret", marks: [{ type: "spoiler" }] },
            { type: "text", text: " " },
            {
                type: "text",
                text: "site",
                marks: [{
                    type: "link",
                    attrs: {
                        href: "https://example.com",
                        target: null,
                        rel: "noopener noreferrer nofollow",
                    },
                }],
            },
        ]);
    });

    it("supports mixed Telegram and shared paste markers", () => {
        const doc = parseMarkdownToRichText("**Bold** _italic_ ~strike~ `code` ||spoiler||", "telegram");

        expect(doc.content?.[0]?.content).toEqual([
            { type: "text", text: "Bold", marks: [{ type: "bold" }] },
            { type: "text", text: " " },
            { type: "text", text: "italic", marks: [{ type: "italic" }] },
            { type: "text", text: " " },
            { type: "text", text: "strike", marks: [{ type: "strike" }] },
            { type: "text", text: " " },
            { type: "text", text: "code", marks: [{ type: "code" }] },
            { type: "text", text: " " },
            { type: "text", text: "spoiler", marks: [{ type: "spoiler" }] },
        ]);
    });

    it("converts fenced code blocks into TipTap code block nodes", () => {
        const doc = parseMarkdownToRichText("```python\n*literal*\n```", "telegram");

        expect(doc.content).toEqual([
            {
                type: "codeBlock",
                attrs: { language: "python" },
                content: [{ type: "text", text: "*literal*" }],
            },
        ]);
    });

    it("supports code fences with content beside the opening and closing fence", () => {
        const doc = parseMarkdownToRichText("```console.log(\"test\");\nnpm run build\nnpm run preview```", "whatsapp");

        expect(doc.content).toEqual([
            {
                type: "codeBlock",
                content: [{ type: "text", text: "console.log(\"test\");\nnpm run build\nnpm run preview" }],
            },
        ]);
    });

    it("keeps unclosed fenced code markers as plain text", () => {
        const doc = parseMarkdownToRichText("```\n*literal*", "telegram");

        expect(doc.content).toEqual([
            { type: "paragraph", content: [{ type: "text", text: "```" }] },
            { type: "paragraph", content: [{ type: "text", text: "*literal*" }] },
        ]);
    });
});

import { describe, expect, it } from "vitest";
import { sanitizeRichTextContent } from "./sanitizeRichText";

describe("sanitizeRichTextContent", () => {
    it("keeps supported semantic nodes and marks", () => {
        const result = sanitizeRichTextContent({
            type: "doc",
            content: [{
                type: "paragraph",
                content: [
                    { type: "text", text: "Bold", marks: [{ type: "bold" }] },
                    { type: "text", text: " link", marks: [{ type: "link", attrs: { href: "https://example.com" } }] },
                ],
            }],
        });

        expect(result.notices).toEqual([]);
        expect(result.content.content?.[0]?.content).toEqual([
            { type: "text", text: "Bold", marks: [{ type: "bold" }] },
            {
                type: "text",
                text: " link",
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

    it("strips unsupported nodes while preserving readable child text", () => {
        const result = sanitizeRichTextContent({
            type: "doc",
            content: [{
                type: "heading",
                attrs: { level: 1 },
                content: [{ type: "text", text: "Heading text" }],
            }],
        });

        expect(result.notices).toEqual([{
            type: "info",
            message: "Unsupported pasted formatting was removed.",
        }]);
        expect(result.content.content).toEqual([{
            type: "paragraph",
            content: [{ type: "text", text: "Heading text" }],
        }]);
    });

    it("removes unsafe links", () => {
        const result = sanitizeRichTextContent({
            type: "doc",
            content: [{
                type: "paragraph",
                content: [{
                    type: "text",
                    text: "bad link",
                    marks: [{ type: "link", attrs: { href: "javascript:alert(1)" } }],
                }],
            }],
        });

        expect(result.notices).toHaveLength(1);
        expect(result.content.content?.[0]?.content).toEqual([{ type: "text", text: "bad link" }]);
    });

    it("keeps code blocks and removes nested marks inside code", () => {
        const result = sanitizeRichTextContent({
            type: "doc",
            content: [{
                type: "codeBlock",
                attrs: { language: "js" },
                content: [{
                    type: "text",
                    text: "*literal*",
                    marks: [{ type: "bold" }],
                }],
            }],
        });

        expect(result.notices).toEqual([]);
        expect(result.content.content).toEqual([{
            type: "codeBlock",
            attrs: { language: "js" },
            content: [{ type: "text", text: "*literal*" }],
        }]);
    });
});

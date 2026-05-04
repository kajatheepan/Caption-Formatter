import { describe, expect, it } from "vitest";
import type { JSONContent } from "@tiptap/core";
import { formatForPlatform } from "./index";
import type { CaptionDocument } from "@/types/caption";

const richContent: JSONContent = {
    type: "doc",
    content: [{
        type: "paragraph",
        content: [
            {
                type: "text",
                text: "rich text",
                marks: [{ type: "italic" }, { type: "strike" }],
            },
        ],
    }],
};

const baseDocument: CaptionDocument = {
    id: null,
    title: "Test",
    caption: "generated caption",
    editorContent: null,
    footer: "",
    hashtags: [],
    customPlatformText: {},
    customPlatformContent: {},
    settings: {
        includeFooter: true,
        attachHashtags: false,
        optimizeForPlatform: true,
        previewMode: true,
    },
};

describe("formatForPlatform", () => {
    it("uses per-platform rich content when available", () => {
        const result = formatForPlatform("whatsapp", {
            ...baseDocument,
            customPlatformContent: {
                whatsapp: richContent,
            },
        });

        expect(result.text).toBe("_~rich text~_");
        expect(result.html).toContain("<em>");
        expect(result.html).toContain("<s>");
        expect(result.formattingNotices).toHaveLength(0);
    });
});

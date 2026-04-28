import type { JSONContent } from "@tiptap/core";
import { renderRichText } from "./richTextRenderer";

export function telegramRichTextExporter(editorContent: JSONContent | null | undefined) {
    return renderRichText(editorContent, {
        code: (text) => text,
        codeBlock: (text) => text,
        link: (text, href) => `${text} (${href})`,
        quote: (text) => `> ${text}`,
    });
}

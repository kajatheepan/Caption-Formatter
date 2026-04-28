import type { JSONContent } from "@tiptap/core";
import { renderRichText } from "./richTextRenderer";

export function whatsappRichTextExporter(editorContent: JSONContent | null | undefined) {
    return renderRichText(editorContent, {
        bold: (text) => `*${text}*`,
        italic: (text) => `_${text}_`,
        strike: (text) => `~${text}~`,
        code: (text) => `\`${text}\``,
        codeBlock: (text) => `\`\`\`${text}\`\`\``,
        quote: (text) => `> ${text}`,
    });
}

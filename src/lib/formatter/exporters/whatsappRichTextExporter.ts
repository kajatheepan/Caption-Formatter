import type { JSONContent } from "@tiptap/core";
import { exportRichTextForPlatform } from "../rich-text/richTextExporter";

export function whatsappRichTextExporter(editorContent: JSONContent | null | undefined) {
    return exportRichTextForPlatform(editorContent, "whatsapp").text;
}

export function whatsappRichTextExportResult(editorContent: JSONContent | null | undefined) {
    return exportRichTextForPlatform(editorContent, "whatsapp");
}

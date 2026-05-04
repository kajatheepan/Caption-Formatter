import type { JSONContent } from "@tiptap/core";
import { exportRichTextForPlatform } from "../rich-text/richTextExporter";

export function telegramRichTextExporter(editorContent: JSONContent | null | undefined) {
    return exportRichTextForPlatform(editorContent, "telegram").text;
}

export function telegramRichTextExportResult(editorContent: JSONContent | null | undefined) {
    return exportRichTextForPlatform(editorContent, "telegram");
}

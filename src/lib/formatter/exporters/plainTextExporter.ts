import type { JSONContent } from "@tiptap/core";
import { exportRichTextForPlatform } from "../rich-text/richTextExporter";

export function plainTextExporter(editorContent: JSONContent | null | undefined) {
    return exportRichTextForPlatform(editorContent, "plain").text;
}

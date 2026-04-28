import type { JSONContent } from "@tiptap/core";
import { renderRichText } from "./richTextRenderer";

export function plainTextExporter(editorContent: JSONContent | null | undefined) {
    return renderRichText(editorContent, {});
}

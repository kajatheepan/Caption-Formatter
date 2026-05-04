import { useCallback, useEffect, useRef, useState } from "react";
import { EditorContent, useEditor, type Editor, type JSONContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import EditorToolbar from "./EditorToolbar";
import { Spoiler } from "./extensions/Spoiler";
import { parseMarkdownToRichText } from "@/lib/formatter/rich-text/markdownParser";
import { sanitizeRichTextContent } from "@/lib/formatter/rich-text/sanitizeRichText";
import { createEmptyDocument, type FormattingNotice } from "@/lib/formatter/rich-text/formattingPolicy";

type RichCaptionEditorProps = {
    value: string;
    editorContent?: JSONContent | null;
    onChange: (value: string) => void;
    onEditorContentChange: (value: JSONContent | null) => void;
    onClear?: () => void;
};

function textToTipTapContent(value: string): JSONContent {
    if (!value.trim()) {
        return createEmptyDocument();
    }

    return {
        type: "doc",
        content: value.split("\n").map((line) => ({
            type: "paragraph",
            content: line ? [{ type: "text", text: line }] : undefined,
        })),
    };
}

function getInitialContent(value: string, editorContent?: JSONContent | null): JSONContent {
    return editorContent ?? textToTipTapContent(value);
}

const hasMarkdownFormatting = (text: string) =>
    /(^|\s)(```|>\s|- |\d{1,2}\. )/.test(text) ||
    /(\*[^*\n]+\*|_[^_\n]+_|__[^_\n]+__|~[^~\n]+~|`[^`\n]+`|\[[^\]\n]+\]\([^)]+\))/.test(text);

const getPasteMarkdownPlatform = (text: string) =>
    /(\*\*[^*\n]+\*\*|__[^_\n]+__|~~[^~\n]+~~|\|\|[^|\n]+\|\||\[[^\]\n]+\]\([^)]+\))/.test(text)
        ? "telegram"
        : "whatsapp";

function RichCaptionEditor({
    value,
    editorContent,
    onChange,
    onEditorContentChange,
    onClear,
}: RichCaptionEditorProps) {
    const [formattingNotices, setFormattingNotices] = useState<FormattingNotice[]>([]);
    const isApplyingSanitizedContent = useRef(false);
    const editorRef = useRef<Editor | null>(null);

    const syncEditorContent = useCallback((
        currentEditor: NonNullable<ReturnType<typeof useEditor>>,
        nextEditorContent: JSONContent = currentEditor.getJSON()
    ) => {
        onChange(currentEditor.getText({ blockSeparator: "\n" }));
        onEditorContentChange(nextEditorContent);
    }, [onChange, onEditorContentChange]);

    const sanitizeCurrentEditorContent = useCallback((currentEditor: NonNullable<ReturnType<typeof useEditor>>) => {
        const sanitized = sanitizeRichTextContent(currentEditor.getJSON());
        const currentJson = JSON.stringify(currentEditor.getJSON());
        const sanitizedJson = JSON.stringify(sanitized.content);
        let nextEditorContent: JSONContent = currentEditor.getJSON();

        setFormattingNotices(sanitized.notices);

        if (currentJson !== sanitizedJson) {
            isApplyingSanitizedContent.current = true;
            currentEditor.commands.setContent(sanitized.content);
            isApplyingSanitizedContent.current = false;
            nextEditorContent = sanitized.content;
        }

        syncEditorContent(currentEditor, nextEditorContent);
    }, [syncEditorContent]);

    const insertMarkdownPaste = useCallback((currentEditor: Editor, pastedText: string) => {
        const parsedContent = parseMarkdownToRichText(pastedText, getPasteMarkdownPlatform(pastedText));
        const isEditorEmpty = !currentEditor.getText().trim();

        isApplyingSanitizedContent.current = true;
        if (isEditorEmpty) {
            currentEditor.commands.setContent(parsedContent);
        } else {
            currentEditor.chain().focus().insertContent(parsedContent.content ?? []).run();
        }
        isApplyingSanitizedContent.current = false;

        const nextEditorContent = currentEditor.getJSON();
        syncEditorContent(currentEditor, nextEditorContent);
        setFormattingNotices([{
            type: "info",
            message: "Markdown paste was converted into editable formatting.",
        }]);
    }, [syncEditorContent]);

    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
            Spoiler,
            Link.configure({
                openOnClick: false,
                autolink: true,
            }),
        ],
        content: getInitialContent(value, editorContent),
        editorProps: {
            attributes: {
                class: "rich-caption-editor min-h-32 px-4 py-3 text-sm leading-6 outline-none",
            },
        },
        onCreate: ({ editor: currentEditor }) => {
            editorRef.current = currentEditor;
        },
        onDestroy: () => {
            editorRef.current = null;
        },
        onUpdate: ({ editor: currentEditor }) => {
            if (isApplyingSanitizedContent.current) {
                return;
            }

            syncEditorContent(currentEditor);
        },
    });

    useEffect(() => {
        if (!editor || value.trim() || editorContent) {
            return;
        }

        if (editor.getText().trim()) {
            editor.commands.clearContent();
        }
    }, [editor, editorContent, value]);

    useEffect(() => {
        if (!editor) {
            return;
        }

        const handleNativePaste = (event: ClipboardEvent) => {
            const pastedText = event.clipboardData?.getData("text/plain") ?? "";

            if (!pastedText || !hasMarkdownFormatting(pastedText)) {
                window.setTimeout(() => {
                    if (editor.isDestroyed) {
                        return;
                    }

                    sanitizeCurrentEditorContent(editor);
                }, 0);
                return;
            }

            event.preventDefault();
            event.stopPropagation();
            insertMarkdownPaste(editor, pastedText);
        };

        editor.view.dom.addEventListener("paste", handleNativePaste, true);

        return () => {
            editor.view.dom.removeEventListener("paste", handleNativePaste, true);
        };
    }, [editor, insertMarkdownPaste, sanitizeCurrentEditorContent]);

    const handleClear = () => {
        editor?.commands.clearContent();
        onEditorContentChange(null);
        setFormattingNotices([]);
        onClear?.();
    };

    return (
        <>
            <div className="flex items-center justify-between gap-3">
                <h3 className="text-[13px] font-medium text-zinc-700">Main Caption</h3>
                {value.trim() && onClear && (
                    <button
                        type="button"
                        onClick={handleClear}
                        className="text-xs font-semibold text-primary"
                    >
                        Clear caption
                    </button>
                )}
            </div>
            <div className="overflow-hidden rounded-[10px] border bg-white shadow-xs focus-within:ring-[3px] focus-within:ring-ring/50">
                {editor && <EditorToolbar editor={editor} />}
                <EditorContent editor={editor} />
            </div>
            {formattingNotices.length > 0 ? (
                <div className="space-y-1">
                    {formattingNotices.map((notice) => (
                        <p
                            key={notice.message}
                            className={notice.type === "warning" ? "text-[11px] text-destructive" : "text-[11px] text-muted-foreground"}
                        >
                            {notice.message}
                        </p>
                    ))}
                </div>
            ) : null}
        </>
    );
}

export default RichCaptionEditor;

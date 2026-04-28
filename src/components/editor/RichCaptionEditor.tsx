import { useEffect } from "react";
import { EditorContent, useEditor, type JSONContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import EditorToolbar from "./EditorToolbar";

type RichCaptionEditorProps = {
    value: string;
    editorContent?: JSONContent | null;
    onChange: (value: string) => void;
    onEditorContentChange: (value: JSONContent | null) => void;
    onClear?: () => void;
};

function textToTipTapContent(value: string): JSONContent {
    if (!value.trim()) {
        return {
            type: "doc",
            content: [{ type: "paragraph" }],
        };
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

function RichCaptionEditor({
    value,
    editorContent,
    onChange,
    onEditorContentChange,
    onClear,
}: RichCaptionEditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
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
        onUpdate: ({ editor: currentEditor }) => {
            onChange(currentEditor.getText({ blockSeparator: "\n" }));
            onEditorContentChange(currentEditor.getJSON());
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

    const handleClear = () => {
        editor?.commands.clearContent();
        onEditorContentChange(null);
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
            <p className="text-[11px] text-muted-foreground">
                Underline is exported only for Telegram. Other platforms keep it as plain text.
            </p>
        </>
    );
}

export default RichCaptionEditor;

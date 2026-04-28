import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

type CaptionEditorProps = {
    value: string;
    onChange: (value: string) => void;
    onClear?: () => void;
};

function CaptionEditor({ value, onChange, onClear }: CaptionEditorProps) {
    const editor = useEditor({
        extensions: [StarterKit],
        content: value ? `<p>${value.replace(/\n/g, "<br />")}</p>` : "",
        editorProps: {
            attributes: {
                class: "min-h-32 rounded-[10px] bg-[#f7f7f8] px-3 py-2 text-sm leading-6 outline-none focus:bg-white",
            },
        },
        onUpdate: ({ editor: currentEditor }) => {
            onChange(currentEditor.getText({ blockSeparator: "\n" }));
        },
    });

    const handleClear = () => {
        editor?.commands.clearContent();
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
            <div className="rounded-[10px] border bg-[#f7f7f8] shadow-xs focus-within:bg-white focus-within:ring-[3px] focus-within:ring-ring/50">
                <EditorContent editor={editor} />
            </div>
        </>
    );
}

export default CaptionEditor;

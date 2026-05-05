import { useEffect, useState } from "react";
import type { Editor } from "@tiptap/react";
import {
    Bold,
    Code,
    CodeXml,
    Italic,
    List,
    ListOrdered,
    Quote,
    RemoveFormatting,
    ScanEye,
    Strikethrough,
    Underline,
    type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { PlatformFormatting } from "@/lib/formatter/rich-text/formattingPolicy";

type ToolbarButtonProps = {
    label: string;
    icon: LucideIcon;
    isActive?: boolean;
    disabled?: boolean;
    onClick: () => void;
};

function ToolbarButton({ label, icon: Icon, isActive = false, disabled = false, onClick }: ToolbarButtonProps) {
    return (
        <button
            type="button"
            title={label}
            aria-label={label}
            aria-pressed={isActive}
            disabled={disabled}
            onMouseDown={(event) => {
                event.preventDefault();
            }}
            onClick={onClick}
            className={cn(
                "flex size-8 items-center justify-center rounded-md text-zinc-700 transition hover:bg-zinc-100 hover:text-zinc-950 disabled:cursor-not-allowed disabled:opacity-40",
                isActive && "bg-primary/10 text-primary"
            )}
        >
            <Icon className="size-4" />
        </button>
    );
}

type EditorToolbarProps = {
    editor: Editor;
    formatting?: PlatformFormatting;
};

function EditorToolbar({ editor, formatting = "telegram" }: EditorToolbarProps) {
    const [, setRenderKey] = useState(0);
    const isCodeBlockActive = editor.isActive("codeBlock");
    const isWhatsApp = formatting === "whatsapp";

    useEffect(() => {
        const rerenderToolbar = () => {
            setRenderKey((current) => current + 1);
        };

        editor.on("selectionUpdate", rerenderToolbar);
        editor.on("transaction", rerenderToolbar);
        editor.on("focus", rerenderToolbar);
        editor.on("blur", rerenderToolbar);

        return () => {
            editor.off("selectionUpdate", rerenderToolbar);
            editor.off("transaction", rerenderToolbar);
            editor.off("focus", rerenderToolbar);
            editor.off("blur", rerenderToolbar);
        };
    }, [editor]);

    return (
        <div className="flex flex-wrap items-center justify-center gap-1 border-b bg-white px-3 py-2">
            <ToolbarButton
                label="Bold"
                icon={Bold}
                isActive={editor.isActive("bold")}
                disabled={isCodeBlockActive}
                onClick={() => editor.chain().focus().toggleBold().run()}
            />
            <ToolbarButton
                label="Italic"
                icon={Italic}
                isActive={editor.isActive("italic")}
                disabled={isCodeBlockActive}
                onClick={() => editor.chain().focus().toggleItalic().run()}
            />
            <ToolbarButton
                label="Strikethrough"
                icon={Strikethrough}
                isActive={editor.isActive("strike")}
                disabled={isCodeBlockActive}
                onClick={() => editor.chain().focus().toggleStrike().run()}
            />
            {isWhatsApp ? null : (
                <ToolbarButton
                    label="Underline"
                    icon={Underline}
                    isActive={editor.isActive("underline")}
                    disabled={isCodeBlockActive}
                    onClick={() => editor.chain().focus().toggleUnderline().run()}
                />
            )}
            <ToolbarButton
                label="Numbered list"
                icon={ListOrdered}
                isActive={editor.isActive("orderedList")}
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
            />
            <ToolbarButton
                label="Bullet list"
                icon={List}
                isActive={editor.isActive("bulletList")}
                onClick={() => editor.chain().focus().toggleBulletList().run()}
            />
            <ToolbarButton
                label="Quote"
                icon={Quote}
                isActive={editor.isActive("blockquote")}
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
            />
            <ToolbarButton
                label="Inline code"
                icon={Code}
                isActive={editor.isActive("code")}
                disabled={isCodeBlockActive}
                onClick={() => editor.chain().focus().toggleCode().run()}
            />
            <ToolbarButton
                label="Code block"
                icon={CodeXml}
                isActive={editor.isActive("codeBlock")}
                onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            />
            {isWhatsApp ? null : (
                <ToolbarButton
                    label="Telegram spoiler"
                    icon={ScanEye}
                    isActive={editor.isActive("spoiler")}
                    disabled={isCodeBlockActive}
                    onClick={() => editor.chain().focus().toggleMark("spoiler").run()}
                />
            )}
            <ToolbarButton
                label="Clear formatting"
                icon={RemoveFormatting}
                onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}
            />
        </div>
    );
}

export default EditorToolbar;

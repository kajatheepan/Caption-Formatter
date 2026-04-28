import type { Editor } from "@tiptap/react";
import {
    Bold,
    Code,
    FileCode,
    Italic,
    List,
    ListOrdered,
    Quote,
    RemoveFormatting,
    Strikethrough,
    Underline,
    type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

type ToolbarButtonProps = {
    label: string;
    icon: LucideIcon;
    isActive?: boolean;
    onClick: () => void;
};

function ToolbarButton({ label, icon: Icon, isActive = false, onClick }: ToolbarButtonProps) {
    return (
        <button
            type="button"
            title={label}
            aria-label={label}
            onClick={onClick}
            className={cn(
                "flex size-8 items-center justify-center rounded-md text-zinc-700 transition hover:bg-zinc-100 hover:text-zinc-950",
                isActive && "bg-primary/10 text-primary"
            )}
        >
            <Icon className="size-4" />
        </button>
    );
}

type EditorToolbarProps = {
    editor: Editor;
};

function EditorToolbar({ editor }: EditorToolbarProps) {
    return (
        <div className="flex flex-wrap items-center justify-center gap-1 border-b bg-white px-3 py-2">
            <ToolbarButton
                label="Bold"
                icon={Bold}
                isActive={editor.isActive("bold")}
                onClick={() => editor.chain().focus().toggleBold().run()}
            />
            <ToolbarButton
                label="Italic"
                icon={Italic}
                isActive={editor.isActive("italic")}
                onClick={() => editor.chain().focus().toggleItalic().run()}
            />
            <ToolbarButton
                label="Strikethrough"
                icon={Strikethrough}
                isActive={editor.isActive("strike")}
                onClick={() => editor.chain().focus().toggleStrike().run()}
            />
            <ToolbarButton
                label="Underline"
                icon={Underline}
                isActive={editor.isActive("underline")}
                onClick={() => editor.chain().focus().toggleUnderline().run()}
            />
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
                onClick={() => editor.chain().focus().toggleCode().run()}
            />
            <ToolbarButton
                label="Code block"
                icon={FileCode}
                isActive={editor.isActive("codeBlock")}
                onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            />
            <ToolbarButton
                label="Clear formatting"
                icon={RemoveFormatting}
                onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}
            />
        </div>
    );
}

export default EditorToolbar;

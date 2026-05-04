import { useState } from "react";
import type { JSONContent } from "@tiptap/core";
import {
    Instagram,
    Linkedin,
    MessageCircle,
    Play,
    Send,
    type LucideIcon,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PLATFORM_CONFIG } from "@/lib/constants";
import type { Platform } from "@/types/platform";
import CharacterCounter from "./CharacterCounter";
import CopyButton from "./CopyButton";
import PlatformPreview from "./PlatformPreview";
import type { FormattingNotice } from "@/lib/formatter/rich-text/formattingPolicy";
import RichCaptionEditor from "@/components/editor/RichCaptionEditor";
import { parseMarkdownToRichText } from "@/lib/formatter/rich-text/markdownParser";

type PlatformPreviewCardProps = {
    platform: Platform;
    label: string;
    text: string;
    html?: string;
    characterCount: number;
    characterLimit: number;
    isOverLimit: boolean;
    customText?: string;
    customContent?: JSONContent | null;
    formattingNotices?: FormattingNotice[];
    onCustomTextChange: (text: string) => void;
    onCustomContentChange: (content: JSONContent | null) => void;
    onCustomTextReset: () => void;
};

const platformIcons: Record<Platform, LucideIcon> = {
    whatsapp: MessageCircle,
    telegram: Send,
    youtube: Play,
    instagram: Instagram,
    linkedin: Linkedin,
};

const platformIconClassNames: Record<Platform, string> = {
    whatsapp: "bg-[#25D366]/10 text-[#075E54]",
    telegram: "bg-[#2AABEE]/10 text-[#2AABEE]",
    youtube: "bg-[#FF0000]/10 text-[#FF0000]",
    instagram: "bg-[#E6683C]/10 text-[#C13584]",
    linkedin: "bg-[#0A66C2]/10 text-[#0A66C2]",
};

function PlatformPreviewCard({
    platform,
    label,
    text,
    html,
    characterCount,
    characterLimit,
    isOverLimit,
    customText,
    customContent,
    formattingNotices = [],
    onCustomTextChange,
    onCustomContentChange,
    onCustomTextReset,
}: PlatformPreviewCardProps) {
    const Icon = platformIcons[platform];
    const badge = PLATFORM_CONFIG[platform].badge;
    const [isEditing, setIsEditing] = useState(false);
    const platformFormatting = platform === "whatsapp" ? "whatsapp" : platform === "telegram" ? "telegram" : "plain";
    const initialEditorContent = customContent ?? parseMarkdownToRichText(customText ?? text, platformFormatting);
    const previewText = customText ?? text;

    return (
        <Card className="w-full overflow-hidden rounded-[14px] shadow-md shadow-black/5 wrap-anywhere">
            <CardHeader className="border-b px-5 py-3">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                        <div className={`flex size-8 items-center justify-center rounded-lg ${platformIconClassNames[platform]}`}>
                            <Icon className="size-4" />
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                            <CardTitle className="text-base">{label}</CardTitle>
                            <span className="rounded-full bg-primary/10 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-primary">
                                {badge}
                            </span>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <label className="flex items-center gap-2 text-xs font-semibold text-zinc-600">
                            Edit
                            <span className="relative inline-flex h-5 w-9 items-center">
                                <input
                                    type="checkbox"
                                    checked={isEditing}
                                    onChange={(event) => setIsEditing(event.target.checked)}
                                    className="peer sr-only"
                                />
                                <span className="absolute inset-0 rounded-full bg-zinc-300 transition peer-checked:bg-primary" />
                                <span className="absolute left-0.5 size-4 rounded-full bg-white shadow-sm transition peer-checked:translate-x-4" />
                            </span>
                        </label>
                        <CopyButton
                            text={text}
                            html={html}
                            disabled={isOverLimit}
                            disabledMessage={isOverLimit ? "Reduce text before copying." : undefined}
                        />
                    </div>
                </div>
            </CardHeader>

            <CardContent className="space-y-4 p-5">
                <CharacterCounter
                    count={characterCount}
                    limit={characterLimit}
                    isOverLimit={isOverLimit}
                />
                {isOverLimit ? (
                    <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive">
                        This output is over the {label} limit. Shorten it before copying.
                    </div>
                ) : null}
                {formattingNotices.length > 0 ? (
                    <div className="space-y-1 rounded-xl border bg-muted/50 px-3 py-2">
                        {formattingNotices.map((notice) => (
                            <p
                                key={notice.message}
                                className={notice.type === "warning" ? "text-xs text-destructive" : "text-xs text-muted-foreground"}
                            >
                                {notice.message}
                            </p>
                        ))}
                    </div>
                ) : null}
                {isEditing ? (
                    <div className="space-y-3 rounded-xl border bg-primary/5 p-3">
                        <div className="flex items-center justify-between gap-3">
                            <div>
                                <p className="text-sm font-semibold text-zinc-800">
                                    Editing {label}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    Rich text edits replace the generated {label} output.
                                </p>
                            </div>
                        </div>
                        <div className="grid gap-3 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
                            <div className="rounded-[10px] border bg-white p-3">
                                <RichCaptionEditor
                                    value={previewText}
                                    editorContent={customContent ?? initialEditorContent}
                                    onChange={(nextText) => onCustomTextChange(nextText)}
                                    onEditorContentChange={(nextContent) => onCustomContentChange(nextContent)}
                                    onClear={() => {
                                        onCustomTextReset();
                                        setIsEditing(false);
                                    }}
                                    showHeader={false}
                                />
                            </div>
                            <div className="rounded-[10px] border bg-[#f7f7f8] p-3">
                                <div className="mb-2 flex items-center justify-between">
                                    <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-zinc-500">
                                        Live preview
                                    </p>
                                    <p className="text-[11px] text-zinc-400">{label}</p>
                                </div>
                                <PlatformPreview
                                    platform={platform}
                                    text={previewText}
                                    editorContent={customContent ?? initialEditorContent}
                                />
                            </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-3">
                            <button
                                type="button"
                                onClick={() => {
                                    onCustomTextReset();
                                    setIsEditing(false);
                                }}
                                className="text-xs font-semibold text-primary"
                            >
                                Reset to auto
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="rounded-xl bg-[#f7f7f8] p-4">
                        <PlatformPreview platform={platform} text={previewText} editorContent={customContent ?? null} />
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

export default PlatformPreviewCard;

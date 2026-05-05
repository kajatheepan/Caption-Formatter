import { useState } from "react";
import type { JSONContent } from "@tiptap/core";
import {
    Bookmark,
    Heart,
    MessageCircle,
    MessageSquare,
    MoreVertical,
    Repeat2,
    Send,
    Share2,
    ThumbsDown,
    ThumbsUp,
} from "lucide-react";
import type { Platform } from "@/types/platform";
import { renderRichTextContentPreview, renderRichTextPreview } from "@/lib/formatter/rich-text/renderRichTextPreview";
import type { PlatformFormatting } from "@/lib/formatter/rich-text/formattingPolicy";
import { telegramRichTextExporter } from "@/lib/formatter/exporters/telegramRichTextExporter";
import { whatsappRichTextExporter } from "@/lib/formatter/exporters/whatsappRichTextExporter";

type PlatformPreviewProps = {
    platform: Platform;
    text: string;
    editorContent?: JSONContent | null;
};

const EMPTY_PREVIEW_TEXT = "Start typing to see your preview...";

function splitInstagramHashtags(text: string) {
    const bodyLines: string[] = [];
    const hashtagLines: string[] = [];

    for (const line of text.split("\n")) {
        const trimmedLine = line.trim();

        if (trimmedLine && /^(#\S+\s*)+$/.test(trimmedLine)) {
            hashtagLines.push(trimmedLine);
        } else {
            bodyLines.push(line);
        }
    }

    return {
        body: bodyLines.join("\n").trim(),
        hashtags: hashtagLines.join("\n").trim(),
    };
}

type PreviewShellProps = {
    previewText: string;
    textClassName: string;
};

function PreviewText({
    children,
    className,
    formatting,
    editorContent,
}: {
    children: string;
    className: string;
    formatting: PlatformFormatting;
    editorContent?: JSONContent | null;
}) {
    if (editorContent) {
        return <div className={className}>{renderRichTextContentPreview(editorContent, formatting)}</div>;
    }

    return <div className={className}>{renderRichTextPreview(children, formatting)}</div>;
}

function WhatsAppPreview({ previewText, textClassName, editorContent }: PreviewShellProps & { editorContent?: JSONContent | null }) {
    const displayText = editorContent ? whatsappRichTextExporter(editorContent) : previewText;

    return (
        <div className="overflow-hidden rounded-[10px] border bg-[#efe7dc]">
            <div className="flex items-center gap-3 bg-[#075E54] px-4 py-2.5 text-white">
                <div className="grid size-8 place-items-center rounded-full bg-[#25D366] text-xs font-bold">
                    Y
                </div>
                <div>
                    <div className="text-sm font-bold">You</div>
                    <div className="text-[10px] text-white/75">online</div>
                </div>
            </div>
            <div className="min-h-28 p-3 sm:p-4">
                <div className="w-full max-w-[84%] rounded-r-2xl rounded-bl-2xl bg-white px-3 py-2 shadow-sm sm:px-4 sm:py-3">
                    <PreviewText className={`${textClassName} text-[12px] leading-5 sm:text-[13px]`} formatting="whatsapp">
                        {displayText}
                    </PreviewText>
                    <div className="mt-1 text-right text-[10px] text-zinc-400">
                        05:38 <span className="text-sky-400">✓✓</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

function TelegramPreview({ previewText, textClassName, editorContent }: PreviewShellProps & { editorContent?: JSONContent | null }) {
    const displayText = editorContent ? telegramRichTextExporter(editorContent) : previewText;

    return (
        <div className="overflow-hidden rounded-[10px] border bg-[#d8ecf8]">
            <div className="flex items-center gap-3 bg-[#2AABEE] px-4 py-2.5 text-white shadow-sm">
                <div className="grid size-9 place-items-center rounded-full bg-white text-xs font-bold text-[#2AABEE]">
                    CF
                </div>
                <div className="min-w-0">
                    <div className="text-sm font-bold leading-4">Your Channel</div>
                    <div className="text-[10px] text-white/80">1.2M subscribers</div>
                </div>
            </div>
            <div
                className="min-h-28 px-3 py-3 sm:px-4 sm:py-4"
                style={{
                    backgroundImage:
                        "radial-gradient(circle at 20% 20%, rgba(42,171,238,0.08) 0 1px, transparent 1px), radial-gradient(circle at 80% 30%, rgba(42,171,238,0.08) 0 1px, transparent 1px), radial-gradient(circle at 40% 80%, rgba(42,171,238,0.06) 0 1px, transparent 1px), linear-gradient(180deg, rgba(255,255,255,0.12), rgba(255,255,255,0.12))",
                    backgroundSize: "88px 88px, 116px 116px, 140px 140px, 100% 100%",
                }}
            >
                <div className="w-full max-w-[88%] rounded-2xl rounded-tl-sm bg-[#EFFDDE] px-3 py-2.5 ring-1 ring-[#cfe9d0] sm:px-4 sm:py-3">
                    <PreviewText className={`${textClassName} text-[12px] leading-5 text-[#24303f] sm:text-[13px]`} formatting="telegram">
                        {displayText}
                    </PreviewText>
                    <div className="mt-2 flex items-center justify-end gap-2 text-[10px] text-zinc-500">
                        <span>1.4K views</span>
                        <span>05:38</span>
                        <span className="text-[#2AABEE]">✓</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

function YouTubePreview({ previewText, textClassName, editorContent }: PreviewShellProps & { editorContent?: JSONContent | null }) {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className="overflow-hidden rounded-[10px] border bg-white">
            <div className="flex items-start gap-3 px-4 py-4">
                <div className="grid size-9 shrink-0 place-items-center rounded-full bg-red-600 text-xs font-bold text-white">
                    CF
                </div>
                <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-1 text-sm">
                        <span className="font-bold text-zinc-950">Your Channel</span>
                        <span className="text-zinc-500">6 months ago</span>
                    </div>
                    <PreviewText
                        className={isExpanded ? textClassName : `${textClassName} line-clamp-2`}
                        formatting="plain"
                        editorContent={editorContent}
                    >
                        {previewText}
                    </PreviewText>
                    <button
                        type="button"
                        onClick={() => setIsExpanded((current) => !current)}
                        className="mt-1 text-xs font-semibold text-zinc-600"
                    >
                        {isExpanded ? "Show less" : "Read more"}
                    </button>

                    <div className="mt-3">
                        <PostImagePlaceholder />
                    </div>

                    <div className="mt-3 flex items-center gap-4 text-zinc-900">
                        <button type="button" className="flex items-center gap-1 text-xs">
                            <ThumbsUp className="size-5 stroke-[1.8]" />
                            23
                        </button>
                        <button type="button">
                            <ThumbsDown className="size-5 stroke-[1.8]" />
                        </button>
                        <button type="button">
                            <Share2 className="size-5 stroke-[1.8]" />
                        </button>
                        <button type="button" className="flex items-center gap-1 text-xs">
                            <MessageSquare className="size-5 stroke-[1.8]" />
                            1
                        </button>
                    </div>
                </div>
                <MoreVertical className="size-5 shrink-0 text-zinc-900" />
            </div>
        </div>
    );
}

type InstagramPreviewProps = PreviewShellProps & {
    text: string;
    editorContent?: JSONContent | null;
};

function InstagramPreview({ text, previewText, editorContent }: InstagramPreviewProps) {
    const instagramText = splitInstagramHashtags(text);

    return (
        <div className="overflow-hidden rounded-[10px] border bg-white">
            <div className="flex items-center gap-2 px-3 py-3">
                <div className="rounded-full bg-gradient-to-br from-yellow-400 via-pink-500 to-purple-700 p-0.5">
                    <div className="grid size-9 place-items-center rounded-full bg-zinc-900 text-xs font-bold text-white">
                        CF
                    </div>
                </div>
                <span className="text-sm font-bold">captionforge</span>
                <span className="text-sm text-sky-500">●</span>
                <span className="text-sm text-zinc-500">3h</span>
                <span className="ml-auto text-lg font-bold leading-none">...</span>
            </div>

            <div className="mx-3">
                <PostImagePlaceholder />
            </div>

            <div className="flex items-center gap-4 px-3 py-3 text-zinc-950">
                <Heart className="size-6 stroke-[1.8]" />
                <MessageCircle className="size-6 stroke-[1.8]" />
                <Send className="size-6 stroke-[1.8]" />
                <Bookmark className="ml-auto size-6 stroke-[1.8]" />
            </div>
            <div className="px-3 text-sm font-semibold">592 likes</div>

            <div className="space-y-2 px-3 pb-4 pt-2 text-[13px] leading-5">
                <div className={text ? "whitespace-pre-wrap break-words" : "italic text-zinc-400"}>
                    <span className="font-bold not-italic text-zinc-900">captionforge </span>
                    {editorContent ? (
                        <PreviewText className="inline" formatting="plain" editorContent={editorContent}>
                            {previewText}
                        </PreviewText>
                    ) : (
                        text ? instagramText.body || instagramText.hashtags : previewText
                    )}
                </div>
                {instagramText.body && instagramText.hashtags && (
                    <p className="whitespace-pre-wrap break-words text-[#00376B]">
                        {instagramText.hashtags}
                    </p>
                )}
            </div>
        </div>
    );
}

function PostImagePlaceholder() {
    return (
        <div className="relative aspect-square overflow-hidden rounded-md border bg-zinc-50">
            <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-zinc-100 via-zinc-50 to-zinc-200" />
            <div className="absolute inset-10 rounded-2xl border border-dashed border-zinc-300 bg-white/60" />
            <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-3 text-zinc-400">
                <div className="size-12 rounded-full border-4 border-zinc-200 border-t-zinc-400" />
                <div className="text-xs font-semibold">Post image preview</div>
            </div>
        </div>
    );
}

function LinkedInPreview({ previewText, textClassName, editorContent }: PreviewShellProps & { editorContent?: JSONContent | null }) {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className="overflow-hidden rounded-[10px] border bg-white">
            <div className="flex items-start gap-3 px-4 py-3">
                <div className="grid size-11 shrink-0 place-items-center rounded bg-[#0A66C2]/10 text-xs font-bold text-[#0A66C2]">
                    CF
                </div>
                <div className="min-w-0">
                    <div className="text-sm font-bold text-zinc-950">CaptionForge</div>
                    <div className="text-xs text-zinc-500">Content tools for creators</div>
                    <div className="text-xs text-zinc-500">6mo • 🌐</div>
                </div>
                <span className="ml-auto text-lg font-bold leading-none text-zinc-700">...</span>
            </div>

            <div className="space-y-2 px-4 pb-3 text-[13px] leading-5">
                <PreviewText
                    className={isExpanded ? textClassName : `${textClassName} line-clamp-3`}
                    formatting="plain"
                    editorContent={editorContent}
                >
                    {previewText}
                </PreviewText>
                <button
                    type="button"
                    onClick={() => setIsExpanded((current) => !current)}
                    className="text-xs font-semibold text-zinc-500"
                >
                    {isExpanded ? "show less" : "...more"}
                </button>
            </div>

            <div className="px-4 pb-3">
                <PostImagePlaceholder />
            </div>

            <div className="flex items-center justify-between border-b px-4 py-2 text-xs text-zinc-500">
                <div className="flex items-center gap-1">
                    <span className="grid size-4 place-items-center rounded-full bg-[#0A66C2] text-[9px] text-white">
                        👍
                    </span>
                    <span>5</span>
                </div>
            </div>

            <div className="grid grid-cols-4 px-2 py-2 text-xs font-semibold text-zinc-600">
                <button type="button" className="flex items-center justify-center gap-1 rounded-md py-2 hover:bg-zinc-100">
                    <ThumbsUp className="size-4" />
                    Like
                </button>
                <button type="button" className="flex items-center justify-center gap-1 rounded-md py-2 hover:bg-zinc-100">
                    <MessageSquare className="size-4" />
                    Comment
                </button>
                <button type="button" className="flex items-center justify-center gap-1 rounded-md py-2 hover:bg-zinc-100">
                    <Repeat2 className="size-4" />
                    Repost
                </button>
                <button type="button" className="flex items-center justify-center gap-1 rounded-md py-2 hover:bg-zinc-100">
                    <Send className="size-4" />
                    Send
                </button>
            </div>
        </div>
    );
}

function PlatformPreview({ platform, text, editorContent }: PlatformPreviewProps) {
    const previewText = text || EMPTY_PREVIEW_TEXT;
    const textClassName = text
        ? "whitespace-pre-wrap break-words text-[13px] leading-5 text-zinc-900"
        : "whitespace-pre-wrap break-words text-xs italic leading-5 text-zinc-400";

    if (platform === "whatsapp") {
        return <WhatsAppPreview previewText={previewText} textClassName={textClassName} editorContent={editorContent} />;
    }

    if (platform === "telegram") {
        return <TelegramPreview previewText={previewText} textClassName={textClassName} editorContent={editorContent} />;
    }

    if (platform === "youtube") {
        return <YouTubePreview previewText={previewText} textClassName={textClassName} editorContent={editorContent} />;
    }

    if (platform === "instagram") {
        return (
            <InstagramPreview
                text={text}
                previewText={previewText}
                textClassName={textClassName}
                editorContent={editorContent}
            />
        );
    }

    if (platform === "linkedin") {
        return <LinkedInPreview previewText={previewText} textClassName={textClassName} editorContent={editorContent} />;
    }

    return (
        <div className="rounded-[10px] border bg-white p-4">
            <div className={text ? "min-h-32 whitespace-pre-wrap break-words text-sm leading-6" : "min-h-32 whitespace-pre-wrap break-words text-sm italic leading-6 text-muted-foreground"}>
                {previewText}
            </div>
        </div>
    );
}

export default PlatformPreview;

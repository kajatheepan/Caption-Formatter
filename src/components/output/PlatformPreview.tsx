import type { Platform } from "@/types/platform";

type PlatformPreviewProps = {
    platform: Platform;
    text: string;
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

function WhatsAppPreview({ previewText, textClassName }: PreviewShellProps) {
    return (
        <div className="overflow-hidden rounded-[10px] bg-[#e9dfd2]">
            <div className="flex items-center gap-3 bg-[#0b6b5c] px-4 py-2.5 text-white">
                <div className="grid size-8 place-items-center rounded-full bg-[#25D366] text-xs font-bold">
                    Y
                </div>
                <div>
                    <div className="text-sm font-bold">You</div>
                    <div className="text-[10px] text-white/75">online</div>
                </div>
            </div>
            <div className="min-h-24 p-3">
                <div className="inline-block max-w-[90%] rounded-r-xl rounded-bl-xl bg-white px-3 py-2 shadow-sm">
                    <div className={textClassName}>{previewText}</div>
                    <div className="mt-1 text-right text-[10px] text-zinc-400">
                        05:38 <span className="text-sky-400">✓✓</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

function PlatformPreview({ platform, text }: PlatformPreviewProps) {
    const previewText = text || EMPTY_PREVIEW_TEXT;
    const textClassName = text
        ? "whitespace-pre-wrap break-words text-[13px] leading-5 text-zinc-900"
        : "whitespace-pre-wrap break-words text-xs italic leading-5 text-zinc-400";

    if (platform === "whatsapp") {
        return <WhatsAppPreview previewText={previewText} textClassName={textClassName} />;
    }

    if (platform === "instagram") {
        const instagramText = splitInstagramHashtags(text);

        return (
            <div className="overflow-hidden rounded-[10px] border bg-white">
                <div className="flex items-center gap-2 border-b px-3 py-2">
                    <div className="grid size-8 place-items-center rounded-full bg-gradient-to-br from-orange-400 via-pink-500 to-purple-700 text-xs text-white">
                        IG
                    </div>
                    <span className="text-sm font-bold">your_handle</span>
                    <span className="ml-auto text-xs font-semibold text-sky-500">Follow</span>
                </div>
                <div className="grid aspect-square place-items-center bg-gradient-to-br from-indigo-400 to-purple-600 text-3xl">
                    +
                </div>
                <div className="space-y-2 px-3 py-3 text-[13px] leading-5">
                    <p className={text ? "whitespace-pre-wrap break-words" : "italic text-zinc-400"}>
                        <span className="font-bold not-italic text-zinc-900">your_handle </span>
                        {text ? instagramText.body || instagramText.hashtags : previewText}
                    </p>
                    {instagramText.body && instagramText.hashtags && (
                        <p className="whitespace-pre-wrap break-words text-[#00376B]">
                            {instagramText.hashtags}
                        </p>
                    )}
                    <p className="text-xs text-zinc-400">View all 42 comments</p>
                </div>
            </div>
        );
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

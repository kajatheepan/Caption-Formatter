import {
    Instagram,
    Linkedin,
    MessageCircle,
    Play,
    Send,
    Twitter,
    type LucideIcon,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PLATFORM_CONFIG } from "@/lib/constants";
import type { Platform } from "@/types/platform";
import CharacterCounter from "./CharacterCounter";
import CopyButton from "./CopyButton";

type PlatformPreviewCardProps = {
    platform: Platform;
    label: string;
    text: string;
    characterCount: number;
    characterLimit: number;
    isOverLimit: boolean;
};

const platformIcons: Record<Platform, LucideIcon> = {
    whatsapp: MessageCircle,
    telegram: Send,
    youtube: Play,
    instagram: Instagram,
    twitter: Twitter,
    linkedin: Linkedin,
};

const platformIconClassNames: Record<Platform, string> = {
    whatsapp: "bg-[#25D366]/10 text-[#075E54]",
    telegram: "bg-[#2AABEE]/10 text-[#2AABEE]",
    youtube: "bg-[#FF0000]/10 text-[#FF0000]",
    instagram: "bg-[#E6683C]/10 text-[#C13584]",
    twitter: "bg-black/10 text-black",
    linkedin: "bg-[#0A66C2]/10 text-[#0A66C2]",
};

function renderPreviewShell(platform: Platform, text: string) {
    const previewText = text || "Start typing to see your preview...";
    const textClassName = text
        ? "whitespace-pre-wrap break-words text-[13px] leading-5 text-zinc-900"
        : "whitespace-pre-wrap break-words text-xs italic leading-5 text-zinc-400";

    if (platform === "whatsapp") {
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

    return (
        <div className="rounded-[10px] border bg-white p-4">
            <div className={text ? "min-h-32 whitespace-pre-wrap break-words text-sm leading-6" : "min-h-32 whitespace-pre-wrap break-words text-sm italic leading-6 text-muted-foreground"}>
                {previewText}
            </div>
        </div>
    );
}

function PlatformPreviewCard({
    platform,
    label,
    text,
    characterCount,
    characterLimit,
    isOverLimit,
}: PlatformPreviewCardProps) {
    const Icon = platformIcons[platform];
    const badge = PLATFORM_CONFIG[platform].badge;

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
                        <label className="flex items-center gap-2 text-xs font-medium text-zinc-400">
                            Edit
                            <span className="relative inline-flex h-5 w-9 items-center opacity-60">
                                <input type="checkbox" disabled className="peer sr-only" />
                                <span className="absolute inset-0 rounded-full bg-zinc-300" />
                                <span className="absolute left-0.5 size-4 rounded-full bg-white shadow-sm" />
                            </span>
                        </label>
                        <CopyButton text={text} />
                    </div>
                </div>
            </CardHeader>

            <CardContent className="space-y-4 p-5">
                {isOverLimit && (
                    <CharacterCounter
                        count={characterCount}
                        limit={characterLimit}
                        isOverLimit={isOverLimit}
                    />
                )}
                <div className="rounded-xl bg-[#f7f7f8] p-4">
                    {renderPreviewShell(platform, text)}
                </div>
            </CardContent>
        </Card>
    );
}

export default PlatformPreviewCard;

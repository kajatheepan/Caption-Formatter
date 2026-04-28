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
import PlatformPreview from "./PlatformPreview";

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
                <CharacterCounter
                    count={characterCount}
                    limit={characterLimit}
                    isOverLimit={isOverLimit}
                />
                <div className="rounded-xl bg-[#f7f7f8] p-4">
                    <PlatformPreview platform={platform} text={text} />
                </div>
            </CardContent>
        </Card>
    );
}

export default PlatformPreviewCard;

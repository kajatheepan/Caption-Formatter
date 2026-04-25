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
    const previewText = text || "Start typing to see your formatted preview...";

    return (
        <Card className="w-full overflow-hidden wrap-anywhere">
            <CardHeader className="border-b">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                            <Icon className="size-5" />
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                            <CardTitle className="text-base">{label}</CardTitle>
                            <span className="rounded-full bg-primary/10 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-primary">
                                {badge}
                            </span>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <label className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                            Edit
                            <input type="checkbox" disabled className="size-4 accent-primary" />
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

                <div className="rounded-xl border bg-muted/40 p-4">
                    <div className="rounded-lg bg-background p-4 shadow-sm">
                        <div
                            className={
                                text
                                    ? "min-h-40 whitespace-pre-wrap break-words text-sm leading-6"
                                    : "min-h-40 whitespace-pre-wrap break-words text-sm italic leading-6 text-muted-foreground"
                            }
                        >
                            {previewText}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

export default PlatformPreviewCard;

import { useRef } from "react";
import PlatformPreviewCard from "./PlatformPreviewCard";
import type { FormattedOutput } from "@/lib/formatter/types";
import type { Platform } from "@/types/platform";
import type { JSONContent } from "@tiptap/core";

type PlatformTabsProps = {
    outputs: FormattedOutput[];
    activePlatform: Platform;
    onPlatformChange: (platform: Platform) => void;
    customPlatformText: Partial<Record<Platform, string>>;
    customPlatformContent: Partial<Record<Platform, JSONContent>>;
    onCustomPlatformTextChange: (platform: Platform, text: string) => void;
    onCustomPlatformContentChange: (platform: Platform, content: JSONContent | null) => void;
    onCustomPlatformTextReset: (platform: Platform) => void;
};

const platformDotColors: Record<Platform, string> = {
    whatsapp: "bg-[#25D366]",
    telegram: "bg-[#2AABEE]",
    youtube: "bg-[#FF0000]",
    instagram: "bg-[#E6683C]",
    linkedin: "bg-[#0A66C2]",
};

function PlatformTabs({
    outputs,
    activePlatform,
    onPlatformChange,
    customPlatformText,
    customPlatformContent,
    onCustomPlatformTextChange,
    onCustomPlatformContentChange,
    onCustomPlatformTextReset,
}: PlatformTabsProps) {
    const activeOutput = outputs.find((output) => output.platform === activePlatform) ?? outputs[0];
    const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});

    if (!activeOutput) {
        return null;
    }

    const focusAndSelect = (index: number) => {
        const platform = outputs[index]?.platform;
        if (!platform) return;
        onPlatformChange(platform);
        tabRefs.current[platform]?.focus();
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
        switch (event.key) {
            case "ArrowRight":
                event.preventDefault();
                focusAndSelect((index + 1) % outputs.length);
                break;
            case "ArrowLeft":
                event.preventDefault();
                focusAndSelect((index - 1 + outputs.length) % outputs.length);
                break;
            case "Home":
                event.preventDefault();
                focusAndSelect(0);
                break;
            case "End":
                event.preventDefault();
                focusAndSelect(outputs.length - 1);
                break;
            default:
                break;
        }
    };

    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-wrap gap-2" role="tablist" aria-label="Platform preview">
                {outputs.map((output, index) => {
                    const isActive = output.platform === activePlatform;

                    return (
                        <button
                            key={output.platform}
                            ref={(node) => {
                                tabRefs.current[output.platform] = node;
                            }}
                            type="button"
                            role="tab"
                            id={`platform-tab-${output.platform}`}
                            aria-selected={isActive}
                            aria-controls={`platform-tabpanel-${output.platform}`}
                            tabIndex={isActive ? 0 : -1}
                            onClick={() => onPlatformChange(output.platform)}
                            onKeyDown={(event) => handleKeyDown(event, index)}
                            className={
                                isActive
                                    ? "inline-flex items-center gap-2 rounded-lg border border-primary bg-primary/10 px-3 py-2 text-[13px] font-semibold text-primary"
                                    : "inline-flex items-center gap-2 rounded-lg border bg-white px-3 py-2 text-[13px] font-semibold text-zinc-600 hover:border-primary hover:text-primary"
                            }
                        >
                            <span className={`size-2 rounded-full ${platformDotColors[output.platform]}`} />
                            {output.label}
                        </button>
                    );
                })}
            </div>

            {outputs.map((output) => (
                output.platform === activeOutput.platform ? (
                    <div
                        key={output.platform}
                        role="tabpanel"
                        id={`platform-tabpanel-${output.platform}`}
                        aria-labelledby={`platform-tab-${output.platform}`}
                        tabIndex={0}
                    >
                        <PlatformPreviewCard
                            platform={output.platform}
                            label={output.label}
                            text={output.text}
                            html={output.html}
                            characterCount={output.characterCount}
                            characterLimit={output.characterLimit}
                            isOverLimit={output.isOverLimit}
                            customText={customPlatformText[output.platform]}
                            customContent={customPlatformContent[output.platform]}
                            formattingNotices={output.formattingNotices}
                            onCustomTextChange={(text) =>
                                onCustomPlatformTextChange(output.platform, text)
                            }
                            onCustomContentChange={(content) =>
                                onCustomPlatformContentChange(output.platform, content)
                            }
                            onCustomTextReset={() =>
                                onCustomPlatformTextReset(output.platform)
                            }
                        />
                    </div>
                ) : null
            ))}
        </div>
    );
}

export default PlatformTabs;

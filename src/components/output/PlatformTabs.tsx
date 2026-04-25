import PlatformPreviewCard from "./PlatformPreviewCard";
import type { FormattedOutput } from "@/lib/formatter/types";
import type { Platform } from "@/types/platform";

type PlatformTabsProps = {
    outputs: FormattedOutput[];
    activePlatform: Platform;
    onPlatformChange: (platform: Platform) => void;
};

function PlatformTabs({ outputs, activePlatform, onPlatformChange }: PlatformTabsProps) {
    const activeOutput = outputs.find((output) => output.platform === activePlatform) ?? outputs[0];

    if (!activeOutput) {
        return null;
    }

    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-wrap gap-2">
                {outputs.map((output) => {
                    const isActive = output.platform === activePlatform;

                    return (
                        <button
                            key={output.platform}
                            type="button"
                            onClick={() => onPlatformChange(output.platform)}
                            className={
                                isActive
                                    ? "rounded-lg border border-primary bg-primary/10 px-3 py-2 text-sm font-semibold text-primary"
                                    : "rounded-lg border bg-background px-3 py-2 text-sm font-semibold text-muted-foreground hover:border-primary hover:text-primary"
                            }
                        >
                            {output.label}
                        </button>
                    );
                })}
            </div>

            {outputs.map((output) => (
                output.platform === activeOutput.platform ? (
                    <PlatformPreviewCard
                        key={output.platform}
                        platform={output.platform}
                        label={output.label}
                        text={output.text}
                        characterCount={output.characterCount}
                        characterLimit={output.characterLimit}
                        isOverLimit={output.isOverLimit}
                    />
                ) : null
            ))}
        </div>
    );
}

export default PlatformTabs;

import PlatformPreviewCard from "./PlatformPreviewCard";
import type { FormattedOutput } from "@/lib/formatter/types";

type PlatformTabsProps = {
    outputs: FormattedOutput[];
};

function PlatformTabs({ outputs }: PlatformTabsProps) {
    return (
        <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {outputs.map((output) => (
                <PlatformPreviewCard
                    key={output.platform}
                    label={output.label}
                    text={output.text}
                    characterCount={output.characterCount}
                    characterLimit={output.characterLimit}
                    isOverLimit={output.isOverLimit}
                />
            ))}
        </div>
    );
}

export default PlatformTabs;

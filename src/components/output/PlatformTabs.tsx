import PlatformPreviewCard from "./PlatformPreviewCard";
import type { Platform } from "@/types/platform";

type PlatformOutput = {
    platform: Platform;
    label: string;
    caption: string;
    footer: string;
};

type PlatformTabsProps = {
    outputs: PlatformOutput[];
};

function PlatformTabs({ outputs }: PlatformTabsProps) {
    return (
        <div className="mt-4 grid w-full max-w-6xl grid-cols-1 gap-4 md:grid-cols-3">
            {outputs.map((output) => (
                <PlatformPreviewCard
                    key={output.platform}
                    label={output.label}
                    caption={output.caption}
                    footer={output.footer}
                />
            ))}
        </div>
    );
}

export default PlatformTabs;

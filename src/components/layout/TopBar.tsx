import { Copy, RotateCcw, Share2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { APP_NAME } from "@/lib/constants";

type TopBarProps = {
    saveStatus: string;
    onClear: () => void;
    onCopyAll: () => void;
};

function TopBar({ saveStatus, onClear, onCopyAll }: TopBarProps) {
    return (
        <header className="sticky top-0 z-20 w-full border-b bg-background/95 px-4 py-3 backdrop-blur">
            <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 sm:flex-row sm:items-center">
                <div className="flex flex-1 items-center gap-3">
                    <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                        <Sparkles className="size-4" />
                    </div>
                    <div>
                        <h1 className="text-base font-bold leading-tight">{APP_NAME}</h1>
                        <p className="text-xs text-muted-foreground">{saveStatus}</p>
                    </div>
                </div>

                <div className="flex flex-wrap gap-2">
                    <Button variant="outline" size="sm" onClick={onClear}>
                        <RotateCcw className="size-4" />
                        Clear
                    </Button>
                    <Button size="sm" onClick={onCopyAll}>
                        <Copy className="size-4" />
                        Copy All
                    </Button>
                    <Button variant="outline" size="sm" disabled>
                        <Share2 className="size-4" />
                        Share
                    </Button>
                </div>
            </div>
        </header>
    );
}

export default TopBar;

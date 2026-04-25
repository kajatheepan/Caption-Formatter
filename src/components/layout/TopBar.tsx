import { ArrowDown, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { APP_NAME } from "@/lib/constants";

type TopBarProps = {
    saveStatus: string;
    onClear: () => void;
    onCopyAll: () => void;
};

function TopBar({ saveStatus, onClear, onCopyAll }: TopBarProps) {
    void saveStatus;

    return (
        <header className="sticky top-0 z-20 w-full border-b bg-white px-5 py-3">
            <div className="mx-auto flex w-full max-w-none items-center gap-3">
                <div className="flex flex-1 items-center gap-3">
                    <div className="flex size-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                        <Sparkles className="size-3.5 fill-current" />
                    </div>
                    <h1 className="text-base font-bold leading-tight">{APP_NAME}</h1>
                </div>

                <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={onClear} className="h-8 px-4">
                        Clear
                    </Button>
                    <Button size="sm" onClick={onCopyAll} className="h-8 bg-primary px-4 shadow-sm">
                        <ArrowDown className="size-4" />
                        Copy All
                    </Button>
                </div>
            </div>
        </header>
    );
}

export default TopBar;

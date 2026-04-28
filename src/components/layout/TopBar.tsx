import { useState } from "react";
import { ArrowDown, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { APP_NAME } from "@/lib/constants";

type TopBarProps = {
    saveStatus: string;
    onClear: () => void;
    onCopyAll: () => void;
    copyAllCopied?: boolean;
    copyAllError?: boolean;
};

function TopBar({
    saveStatus,
    onClear,
    onCopyAll,
    copyAllCopied = false,
    copyAllError = false,
}: TopBarProps) {
    const [isClearDialogOpen, setIsClearDialogOpen] = useState(false);

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
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsClearDialogOpen(true)}
                        className="h-8 px-4"
                    >
                        Clear
                    </Button>
                    <Button size="sm" onClick={onCopyAll} className="h-8 bg-primary px-4 shadow-sm">
                        <ArrowDown className="size-4" />
                        {copyAllCopied ? "Copied" : "Copy All"}
                    </Button>
                    {copyAllError && (
                        <span className="self-center text-xs text-red-600">Copy failed</span>
                    )}
                </div>
            </div>
            {isClearDialogOpen && (
                <div className="fixed inset-0 z-50 grid place-items-center bg-black/30 px-4">
                    <div className="w-full max-w-sm rounded-xl border bg-white p-5 shadow-xl">
                        <h2 className="text-base font-bold text-zinc-950">Clear draft?</h2>
                        <p className="mt-2 text-sm leading-6 text-muted-foreground">
                            This will remove your caption, footer, hashtags, settings, and custom platform edits from this browser.
                        </p>
                        <div className="mt-5 flex justify-end gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => setIsClearDialogOpen(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="button"
                                size="sm"
                                onClick={() => {
                                    onClear();
                                    setIsClearDialogOpen(false);
                                }}
                            >
                                Clear draft
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}

export default TopBar;

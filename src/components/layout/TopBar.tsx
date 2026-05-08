import { useState } from "react";
import { CopyCheck, Copy, Share2, Sparkles, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { APP_NAME } from "@/lib/constants";
import ShareModal from "@/components/sharing/ShareModal";
import { useModalA11y } from "@/hooks/useModalA11y";
import type { CaptionDocument } from "@/types/caption";

type TopBarProps = {
    saveStatus: string;
    document?: CaptionDocument;
    onClear: () => void;
    onCopyAll: () => void;
    copyAllCopied?: boolean;
    copyAllError?: boolean;
};

function TopBar({
    saveStatus = "Saved locally",
    document,
    onClear,
    onCopyAll,
    copyAllCopied = false,
    copyAllError = false,
}: TopBarProps) {
    const [isClearDialogOpen, setIsClearDialogOpen] = useState(false);
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);
    const clearDialogRef = useModalA11y(isClearDialogOpen, () => setIsClearDialogOpen(false));

    return (
        <header className="sticky top-0 z-20 w-full border-b bg-white/90 backdrop-blur-md px-5 py-2.5 transition-all">
            <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                    <div className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-tr from-primary to-indigo-600 text-white shadow-md shadow-primary/20">
                        <Sparkles className="size-4 fill-current" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-base font-extrabold tracking-tight text-zinc-900">{APP_NAME}</h1>
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-600 border border-emerald-200">
                                <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                {saveStatus}
                            </span>
                        </div>
                        <p className="text-[11px] text-muted-foreground hidden sm:block">
                            Write once • Format for WhatsApp, Telegram, YouTube, Instagram & LinkedIn
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {document ? (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setIsShareModalOpen(true)}
                            className="h-8 rounded-lg border-zinc-200 text-xs font-semibold hover:border-primary hover:text-primary transition"
                        >
                            <Share2 className="size-3.5 mr-1.5" />
                            Share
                        </Button>
                    ) : null}

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsClearDialogOpen(true)}
                        className="h-8 rounded-lg border-zinc-200 text-xs font-semibold hover:border-destructive hover:text-destructive transition"
                    >
                        <Trash2 className="size-3.5 sm:mr-1.5" />
                        <span className="hidden sm:inline">Clear</span>
                    </Button>

                    <Button
                        size="sm"
                        onClick={onCopyAll}
                        className="h-8 rounded-lg bg-primary px-3.5 text-xs font-semibold text-primary-foreground shadow-sm hover:opacity-90 transition"
                    >
                        {copyAllCopied ? (
                            <>
                                <CopyCheck className="size-3.5 mr-1.5" />
                                Copied All
                            </>
                        ) : (
                            <>
                                <Copy className="size-3.5 mr-1.5" />
                                Copy All
                            </>
                        )}
                    </Button>
                    {copyAllError && (
                        <span className="self-center text-xs text-red-600">Copy failed</span>
                    )}
                </div>
            </div>

            {document ? (
                <ShareModal
                    open={isShareModalOpen}
                    document={document}
                    onClose={() => setIsShareModalOpen(false)}
                />
            ) : null}

            {isClearDialogOpen && (
                <div
                    className="fixed inset-0 z-50 grid place-items-center bg-black/40 backdrop-blur-xs px-4"
                    onMouseDown={() => setIsClearDialogOpen(false)}
                    role="presentation"
                >
                    <div
                        ref={clearDialogRef}
                        tabIndex={-1}
                        className="w-full max-w-sm rounded-2xl border bg-white p-5 shadow-2xl outline-none"
                        onMouseDown={(event) => event.stopPropagation()}
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="clear-dialog-title"
                    >
                        <h2 id="clear-dialog-title" className="text-base font-bold text-zinc-950">Clear draft?</h2>
                        <p className="mt-2 text-xs leading-5 text-muted-foreground">
                            This will remove your caption, footer, hashtags, settings, and custom platform edits from this browser.
                        </p>
                        <div className="mt-5 flex justify-end gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => setIsClearDialogOpen(false)}
                                className="rounded-lg text-xs"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="button"
                                size="sm"
                                variant="destructive"
                                onClick={() => {
                                    onClear();
                                    setIsClearDialogOpen(false);
                                }}
                                className="rounded-lg text-xs"
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

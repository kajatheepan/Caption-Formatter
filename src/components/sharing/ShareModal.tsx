import { useState } from "react";
import { Check, Copy, Link as LinkIcon, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { CaptionDocument } from "@/types/caption";
import { getShareableUrl } from "@/lib/sharing/shareUrl";
import { useModalA11y } from "@/hooks/useModalA11y";

type ShareModalProps = {
    open: boolean;
    document: CaptionDocument;
    onClose: () => void;
};

export default function ShareModal({ open, document, onClose }: ShareModalProps) {
    const [copied, setCopied] = useState(false);
    const dialogRef = useModalA11y(open, onClose);

    if (!open) return null;

    const shareUrl = getShareableUrl(document);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            // ignore
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 grid place-items-center bg-black/40 backdrop-blur-xs px-4"
            onMouseDown={onClose}
            role="presentation"
        >
            <div
                ref={dialogRef}
                tabIndex={-1}
                className="w-full max-w-md rounded-2xl border bg-white p-6 shadow-2xl transition-all outline-none"
                onMouseDown={(event) => event.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-labelledby="share-modal-title"
            >
                <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <Share2 className="size-5" />
                    </div>
                    <div>
                        <h2 id="share-modal-title" className="text-base font-bold text-zinc-950">
                            Share Editable Caption
                        </h2>
                        <p className="text-xs text-muted-foreground">
                            Anyone with this link can view and edit this caption.
                        </p>
                    </div>
                </div>

                <div className="mt-5 space-y-3">
                    <label className="text-xs font-semibold text-zinc-700">Shareable link</label>
                    <div className="flex items-center gap-2">
                        <div className="relative flex-1">
                            <Input
                                readOnly
                                value={shareUrl}
                                className="h-10 pr-8 text-xs font-mono bg-zinc-50 rounded-lg text-zinc-700 select-all"
                            />
                            <LinkIcon className="absolute right-3 top-1/2 -translate-y-1/2 size-3.5 text-zinc-400" />
                        </div>
                        <Button
                            size="sm"
                            onClick={handleCopy}
                            className="h-10 px-4 bg-primary text-primary-foreground font-semibold shadow-xs"
                        >
                            {copied ? (
                                <>
                                    <Check className="size-4 mr-1.5" />
                                    Copied
                                </>
                            ) : (
                                <>
                                    <Copy className="size-4 mr-1.5" />
                                    Copy Link
                                </>
                            )}
                        </Button>
                    </div>
                </div>

                <div className="mt-6 flex justify-end">
                    <Button variant="outline" size="sm" onClick={onClose} className="rounded-lg">
                        Close
                    </Button>
                </div>
            </div>
        </div>
    );
}

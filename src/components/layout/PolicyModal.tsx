import { Button } from "@/components/ui/button";
import { ShieldCheck, FileText, X } from "lucide-react";

type PolicyModalProps = {
    type: "privacy" | "terms" | null;
    onClose: () => void;
};

export default function PolicyModal({ type, onClose }: PolicyModalProps) {
    if (!type) return null;

    const isPrivacy = type === "privacy";
    const title = isPrivacy ? "Privacy Policy" : "Terms of Use";
    const Icon = isPrivacy ? ShieldCheck : FileText;

    return (
        <div
            className="fixed inset-0 z-50 grid place-items-center bg-black/40 backdrop-blur-xs px-4"
            onMouseDown={onClose}
            role="presentation"
        >
            <div
                className="flex max-h-[85dvh] w-full max-w-lg flex-col rounded-2xl border bg-white p-6 shadow-2xl"
                onMouseDown={(event) => event.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-labelledby="policy-modal-title"
            >
                <div className="flex items-center justify-between border-b pb-4">
                    <div className="flex items-center gap-3">
                        <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                            <Icon className="size-5" />
                        </div>
                        <h2 id="policy-modal-title" className="text-base font-bold text-zinc-900">
                            {title}
                        </h2>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-lg p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600"
                    >
                        <X className="size-5" />
                    </button>
                </div>

                <div className="mt-4 overflow-y-auto space-y-4 text-xs text-zinc-600 leading-relaxed pr-1">
                    {isPrivacy ? (
                        <>
                            <p className="font-semibold text-zinc-800">Your privacy is 100% respected.</p>
                            <p>
                                CaptionForge operates entirely in your web browser. All your captions, footers, hashtags, and custom settings remain stored locally on your device using HTML5 LocalStorage.
                            </p>
                            <p>
                                We do not collect, track, or transmit your typed captions to any third-party analytics servers or external databases.
                            </p>
                            <p>
                                When you create a shared link, the caption data is encoded directly into the URL fragment hash on your machine.
                            </p>
                        </>
                    ) : (
                        <>
                            <p className="font-semibold text-zinc-800">Usage Terms</p>
                            <p>
                                CaptionForge is a free utility tool provided as-is for content creators, social media managers, and businesses.
                            </p>
                            <p>
                                You retain full ownership and rights to all captions and content you format using CaptionForge.
                            </p>
                            <p>
                                While we strive to match markdown specs for platforms like WhatsApp, Telegram, YouTube, Instagram, and LinkedIn, each social network may periodically update its character limits and renderer rules.
                            </p>
                        </>
                    )}
                </div>

                <div className="mt-6 flex justify-end border-t pt-4">
                    <Button size="sm" onClick={onClose} className="rounded-xl px-5 text-xs font-semibold">
                        Got it
                    </Button>
                </div>
            </div>
        </div>
    );
}

import { useEffect, useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { FormattedOutput } from "@/lib/formatter/types";

type CopyAllModalProps = {
    open: boolean;
    outputs: FormattedOutput[];
    onClose: () => void;
    copy: (text: string, html?: string) => Promise<boolean>;
};

export default function CopyAllModal({ open, outputs, onClose, copy }: CopyAllModalProps) {
    const firstPlatform = outputs[0]?.platform ?? null;
    const [copiedMap, setCopiedMap] = useState<Record<string, boolean>>({});
    const [globalCopied, setGlobalCopied] = useState(false);
    const [expandedPlatform, setExpandedPlatform] = useState<string | null>(firstPlatform);

    useEffect(() => {
        if (open) {
            setExpandedPlatform(firstPlatform);
        }
    }, [firstPlatform, open]);

    if (!open) return null;

    const handleCopy = async (output: FormattedOutput) => {
        const ok = await copy(output.text, output.html);
        if (ok) {
            setCopiedMap((m) => ({ ...m, [output.platform]: true }));
            setTimeout(() => setCopiedMap((m) => ({ ...m, [output.platform]: false })), 1200);
        }
    };

    const handleCopyAll = async () => {
        const combined = outputs.map((o) => `=== ${o.label} ===\n${o.text}`).join("\n\n");
        const ok = await copy(combined);
        if (ok) {
            setGlobalCopied(true);
            setTimeout(() => setGlobalCopied(false), 1200);
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 grid place-items-center bg-black/40 px-4"
            onMouseDown={onClose}
            role="presentation"
        >
            <div
                className="flex max-h-[90dvh] w-full max-w-3xl flex-col rounded-xl border bg-white p-5 shadow-xl"
                onMouseDown={(event) => event.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-labelledby="copy-outputs-title"
            >
                <div className="flex shrink-0 items-start justify-between gap-4">
                    <div>
                        <h2 id="copy-outputs-title" className="text-lg font-bold">Copy outputs</h2>
                        <p className="mt-1 text-sm text-muted-foreground">Copy raw platform markdown or copy all at once.</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline" onClick={onClose}>Close</Button>
                        <Button size="sm" onClick={handleCopyAll}>{globalCopied ? "Copied" : "Copy All"}</Button>
                    </div>
                </div>

                <div className="mt-4 grid gap-3 overflow-y-auto pr-1">
                    {outputs.map((output) => {
                        const isExpanded = expandedPlatform === output.platform;

                        return (
                            <div key={output.platform} className="rounded-xl border bg-white">
                                <div className="flex items-center justify-between gap-3 p-3">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setExpandedPlatform((currentPlatform) =>
                                                currentPlatform === output.platform ? null : output.platform
                                            )
                                        }
                                        className="flex min-w-0 flex-1 items-center gap-2 text-left"
                                        aria-expanded={isExpanded}
                                    >
                                        {isExpanded ? (
                                            <ChevronDown className="size-4 shrink-0 text-muted-foreground" />
                                        ) : (
                                            <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
                                        )}
                                        <span className="truncate text-sm font-medium">{output.label}</span>
                                        <span className="text-xs text-muted-foreground">
                                            {output.characterCount.toLocaleString()} chars
                                        </span>
                                    </button>
                                    <Button size="sm" variant="outline" onClick={() => void handleCopy(output)}>
                                        {copiedMap[output.platform] ? "Copied" : "Copy"}
                                    </Button>
                                </div>
                                {isExpanded ? (
                                    <div className="border-t p-3 pt-2">
                                        <pre className="max-h-72 overflow-auto rounded-lg bg-muted/40 p-3 text-sm leading-relaxed whitespace-pre-wrap">
                                            {output.text}
                                        </pre>
                                    </div>
                                ) : null}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

import { Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import useClipboard from "@/hooks/useClipboard";
import { cn } from "@/lib/utils";

type CopyButtonProps = {
    text: string;
    html?: string;
    disabled?: boolean;
    disabledMessage?: string;
    className?: string;
};

function CopyButton({ text, html, disabled = false, disabledMessage, className }: CopyButtonProps) {
    const { copy, copied, error } = useClipboard();

    return (
        <div className="flex flex-col items-end gap-1">
            <Button
                variant="outline"
                size="sm"
                disabled={disabled}
                title={disabled ? disabledMessage : undefined}
                onClick={() => {
                    if (disabled) {
                        return;
                    }

                    void copy(text, html);
                }}
                className={cn("h-8 gap-1.5 rounded-lg bg-white px-3 text-xs hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60", className)}
            >
                <Copy className="size-3.5" /> Copy
            </Button>
            {disabled && disabledMessage ? (
                <span className="max-w-40 text-right text-[11px] leading-4 text-destructive">
                    {disabledMessage}
                </span>
            ) : null}
            {copied && (
                <span className="mt-2 animate-bounce text-xs text-green-600">Copied!</span>
            )}
            {error && (
                <span className="mt-2 text-xs text-red-600">Copy failed</span>
            )}
        </div>
    );
}

export default CopyButton;

import { useState } from "react";
import { Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type CopyButtonProps = {
    text: string;
    className?: string;
};

function CopyButton({ text, className }: CopyButtonProps) {
    const [copied, setCopied] = useState(false);

    const copy = async () => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 1200);
        } catch {
            setCopied(false);
        }
    };

    return (
        <>
            <Button
                variant="outline"
                size="sm"
                onClick={copy}
                className={cn("h-8 gap-1.5 rounded-lg bg-white px-3 text-xs hover:bg-gray-100", className)}
            >
                <Copy className="size-3.5" /> Copy
            </Button>
            {copied && (
                <span className="mt-2 animate-bounce text-xs text-green-600">Copied!</span>
            )}
        </>
    );
}

export default CopyButton;

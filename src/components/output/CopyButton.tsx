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
                className={cn("flex items-center gap-2 hover:bg-gray-100", className)}
            >
                <Copy /> Copy
            </Button>
            {copied && (
                <span className="mt-2 animate-bounce text-xs text-green-600">Copied!</span>
            )}
        </>
    );
}

export default CopyButton;

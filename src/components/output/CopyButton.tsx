import { Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import useClipboard from "@/hooks/useClipboard";
import { cn } from "@/lib/utils";

type CopyButtonProps = {
    text: string;
    className?: string;
};

function CopyButton({ text, className }: CopyButtonProps) {
    const { copy, copied, error } = useClipboard();

    return (
        <>
            <Button
                variant="outline"
                size="sm"
                onClick={() => copy(text)}
                className={cn("h-8 gap-1.5 rounded-lg bg-white px-3 text-xs hover:bg-gray-100", className)}
            >
                <Copy className="size-3.5" /> Copy
            </Button>
            {copied && (
                <span className="mt-2 animate-bounce text-xs text-green-600">Copied!</span>
            )}
            {error && (
                <span className="mt-2 text-xs text-red-600">Copy failed</span>
            )}
        </>
    );
}

export default CopyButton;

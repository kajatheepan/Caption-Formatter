import { useState } from "react";
import { Copy } from "lucide-react";
import { Button } from "@/components/ui/button";

type CopyButtonProps = {
    text: string;
};

function CopyButton({ text }: CopyButtonProps) {
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
                onClick={copy}
                className="flex min-w-full items-center gap-2 hover:bg-gray-100"
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

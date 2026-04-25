import { useState } from "react";

function useClipboard(resetDelay = 1200) {
    const [copied, setCopied] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const copy = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setError(null);
            setTimeout(() => setCopied(false), resetDelay);
            return true;
        } catch (copyError) {
            setCopied(false);
            setError(copyError instanceof Error ? copyError : new Error("Copy failed"));
            return false;
        }
    };

    return { copy, copied, error };
}

export default useClipboard;

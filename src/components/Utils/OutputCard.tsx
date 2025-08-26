import { Button } from "@/components/ui/button";
import { Card, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Copy } from 'lucide-react';
import {useState} from "react";

export default function OutputCard({ platform, caption, footer }: { platform: string, caption: string, footer: string }) {
const [copied, setCopied] = useState(false);

const copy = (text: string) => {
navigator.clipboard.writeText(text);
setCopied(true);
setTimeout(() => setCopied(false), 1200);
};

return (
<Card className="w-full wrap-anywhere ">
    <CardTitle className="mx-4">
        {platform}
    </CardTitle>
    <CardContent className="mx-4 overflow-y-auto">
        <div style={{ whiteSpace: "pre-wrap" }}>
            {caption}
            <br />
            {footer}
        </div>
    </CardContent>
    <CardFooter className="mx-4 flex flex-col items-center">
        <Button variant="outline" onClick={()=> copy(caption + "\n\n" + footer)} className="min-w-full hover:bg-gray-100
            flex items-center gap-2" >
            <Copy /> Copy
        </Button>
        {copied && (
        <span className="text-green-600 text-xs mt-2 animate-bounce">Copied!</span>
        )}
    </CardFooter>
</Card>
)
}
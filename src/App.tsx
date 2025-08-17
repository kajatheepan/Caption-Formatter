import { useState } from "react";
import {Button} from "@/components/ui/button";
import {Card,CardTitle,CardContent,CardFooter} from "@/components/ui/card";
import {Textarea} from "@/components/ui/textarea";
import { Copy } from 'lucide-react';

function App(){
    const [caption, setCaption] = useState("");

    return(
        <div className="flex flex-col justify-center items-center h-screen w-full">
            <h1 className="text-2xl font-bold">Caption Formatter</h1>
            <Textarea placeholder="Enter caption with formatting: *bold*, _italic_, ~strikethrough~" className="w-1/2 mt-5 mb-3 max-h-1/2 text-wrap wrap-break-word" value={caption} onChange={(e) => setCaption(e.target.value)} />
            <div className="flex flex-row gap-4 mt-4 min-w-1/2 max-w-10/12 mx-20">
                <OutputCard platform="Whatsapp" caption={caption} />
                <OutputCard platform="Telegram" caption={ConvertToTelegram(caption)} />
                <OutputCard platform="Youtube" caption={ConvertToYoutube(caption)} />

            </div>
        </div>
    )
}

function OutputCard({platform, caption}:{platform:string, caption:string}){
    const copy = () => navigator.clipboard.writeText(caption);
    return(
        <Card className="w-full wrap-anywhere ">
            <CardTitle className="mx-4">
                {platform}
            </CardTitle>
            <CardContent className="mx-4">
                <div style={{ whiteSpace: "pre-wrap" }}>
                    {caption}
                </div>
            </CardContent>
            <CardFooter className="mx-4">
                <Button onClick={copy} className="min-w-full" ><Copy /> Copy</Button>
            </CardFooter>
        </Card>
    )
}

function ConvertToTelegram(input:String){
    let caption = input.replace(/\*([^\s].*?[^\s])\*/g, "**$1**");
    caption = caption.replace(/_([^\s].*?[^\s])_/g, "__$1__");
    caption = caption.replace(/~([^\s].*?[^\s])~/g, "~$1~");
    return caption;
}

function ConvertToYoutube(input:String){
    let caption = input.replace(/\*([^\s].*?[^\s])\*/g, "$1");
    caption = caption.replace(/_([^\s].*?[^\s])_/g, "$1");
    caption = caption.replace(/~([^\s].*?[^\s])~/g, "$1");
    return caption;
}

export default App;
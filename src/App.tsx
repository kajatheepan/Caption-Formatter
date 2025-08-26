import {useEffect, useRef, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import OutputCard from "@/components/Utils/OutputCard";
import { YoutubeFormatter, TelegramFormatter } from "./components/Utils/CaptionFormatters";
import { useLocalStorage } from "@/components/Utils/LocalStorage";

// Move debounce outside component to avoid recreation on every render
function debounce<T extends (...args: any[]) => void>(func: T, delay: number) {
    let timer: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
        clearTimeout(timer);
        timer = setTimeout(() => func(...args), delay);
    };
}

function App() {
    const { value: storedCaption, setStoredValue: setCaption } = useLocalStorage("caption", "");
    const { value: storedFooter, setStoredValue: setFooter } = useLocalStorage("footer", "");

    // Use local state for immediate UI updates
    const [caption, setCaptionState] = useState(storedCaption);
    const [footer, setFooterState] = useState(storedFooter);

    // Debounce only the saving to local storage
    const debouncedSetCaption = useRef(
        debounce((value: string) => setCaption(value), 1000)
    ).current;
    const debouncedSetFooter = useRef(
        debounce((value: string) => setFooter(value), 1000)
    ).current;

    // Sync local state to local storage with debounce
    useEffect(() => {
        debouncedSetCaption(caption?.toString());
    }, [caption, debouncedSetCaption]);

    useEffect(() => {
        debouncedSetFooter(footer?.toString());
    }, [footer, debouncedSetFooter]);

    // Update local state immediately on change
    const handleCaptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setCaptionState(e.target.value);
    };

    const handleFooterChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setFooterState(e.target.value);
    };

    return (
        <div className="flex flex-col justify-center items-center h-screen w-full">
            <h1 className="text-2xl font-bold">Caption Formatter</h1>
            <div className="w-1/2 mt-5 mb-3 max-h-1/2">
                <h3>Caption</h3>
                <Textarea
                    placeholder="Enter caption with formatting: *bold*, _italic_, ~strikethrough~"
                    className="text-wrap break-words"
                    value={caption?.toString()}
                    onChange={handleCaptionChange}
                />
                <h3 className="mt-2">Footer</h3>
                <Textarea
                    placeholder="Enter the footer of the caption"
                    className="text-wrap break-words mt-2"
                    value={footer?.toString()}
                    onChange={handleFooterChange}
                />
            </div>
            <div className="flex flex-row gap-4 mt-4 min-w-1/2 max-w-10/12 mx-20 max-h-1/2">
                <OutputCard platform="Whatsapp" caption={caption ? caption.toString() : ''} footer={footer ? footer.toString() : ''} />
                <OutputCard platform="Telegram" caption={caption ? TelegramFormatter(caption) : ''} footer={footer ? TelegramFormatter(footer) : ''} />
                <OutputCard platform="Youtube" caption={caption ? YoutubeFormatter(caption) : ''} footer={footer ? YoutubeFormatter(footer) : ''} />
            </div>
        </div>
    );
}

export default App;
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
        <div className="flex min-h-screen w-full flex-col items-center px-4 py-8">
            <h1 className="text-2xl font-bold">Caption Formatter</h1>
            <div className="mt-5 mb-3 w-full max-w-3xl">
                <h3>Caption</h3>
                <Textarea
                    placeholder="Enter caption with formatting: *bold*, _italic_, ~strikethrough~"
                    className="min-h-32 text-wrap break-words"
                    value={caption?.toString()}
                    onChange={handleCaptionChange}
                />
                <h3 className="mt-2">Footer</h3>
                <Textarea
                    placeholder="Enter the footer of the caption"
                    className="mt-2 min-h-24 text-wrap break-words"
                    value={footer?.toString()}
                    onChange={handleFooterChange}
                />
            </div>
            <div className="mt-4 grid w-full max-w-6xl grid-cols-1 gap-4 md:grid-cols-3">
                <OutputCard platform="Whatsapp" caption={caption ? caption.toString() : ''} footer={footer ? footer.toString() : ''} />
                <OutputCard platform="Telegram" caption={caption ? TelegramFormatter(caption) : ''} footer={footer ? TelegramFormatter(footer) : ''} />
                <OutputCard platform="Youtube" caption={caption ? YoutubeFormatter(caption) : ''} footer={footer ? YoutubeFormatter(footer) : ''} />
            </div>
        </div>
    );
}

export default App;

import { useEffect, useRef, useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import FooterInput from "@/components/inputs/FooterInput";
import CaptionEditor from "@/components/editor/CaptionEditor";
import PlatformTabs from "@/components/output/PlatformTabs";
import { TelegramFormatter, YoutubeFormatter } from "@/lib/formatter";
import { useLocalStorage } from "@/hooks/useLocalDraft";

function debounce<T extends (...args: string[]) => void>(func: T, delay: number) {
    let timer: NodeJS.Timeout;

    return (...args: Parameters<T>) => {
        clearTimeout(timer);
        timer = setTimeout(() => func(...args), delay);
    };
}

function HomePage() {
    const { value: storedCaption, setStoredValue: setCaption } = useLocalStorage("caption", "");
    const { value: storedFooter, setStoredValue: setFooter } = useLocalStorage("footer", "");

    const [caption, setCaptionState] = useState(storedCaption);
    const [footer, setFooterState] = useState(storedFooter);

    const debouncedSetCaption = useRef(
        debounce((value: string) => setCaption(value), 1000)
    ).current;
    const debouncedSetFooter = useRef(
        debounce((value: string) => setFooter(value), 1000)
    ).current;

    useEffect(() => {
        debouncedSetCaption(caption.toString());
    }, [caption, debouncedSetCaption]);

    useEffect(() => {
        debouncedSetFooter(footer.toString());
    }, [footer, debouncedSetFooter]);

    return (
        <AppLayout>
            <div className="mt-5 mb-3 w-full max-w-3xl">
                <CaptionEditor value={caption.toString()} onChange={setCaptionState} />
                <FooterInput value={footer.toString()} onChange={setFooterState} />
            </div>

            <PlatformTabs
                outputs={[
                    {
                        platform: "Whatsapp",
                        caption: caption.toString(),
                        footer: footer.toString(),
                    },
                    {
                        platform: "Telegram",
                        caption: caption ? TelegramFormatter(caption) : "",
                        footer: footer ? TelegramFormatter(footer) : "",
                    },
                    {
                        platform: "Youtube",
                        caption: caption ? YoutubeFormatter(caption) : "",
                        footer: footer ? YoutubeFormatter(footer) : "",
                    },
                ]}
            />
        </AppLayout>
    );
}

export default HomePage;

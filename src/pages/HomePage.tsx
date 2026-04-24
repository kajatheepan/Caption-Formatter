import { useEffect, useRef } from "react";
import AppLayout from "@/components/layout/AppLayout";
import FooterInput from "@/components/inputs/FooterInput";
import CaptionEditor from "@/components/editor/CaptionEditor";
import PlatformTabs from "@/components/output/PlatformTabs";
import { TelegramFormatter, YoutubeFormatter } from "@/lib/formatter";
import { useLocalStorage } from "@/hooks/useLocalDraft";
import useCaptionDocument from "@/hooks/useCaptionDocument";
import { PLATFORM_CONFIG } from "@/lib/constants";

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

    const { document, setCaption: setCaptionState, setFooter: setFooterState } = useCaptionDocument({
        caption: storedCaption,
        footer: storedFooter,
    });

    const debouncedSetCaption = useRef(
        debounce((value: string) => setCaption(value), 1000)
    ).current;
    const debouncedSetFooter = useRef(
        debounce((value: string) => setFooter(value), 1000)
    ).current;

    useEffect(() => {
        debouncedSetCaption(document.caption);
    }, [document.caption, debouncedSetCaption]);

    useEffect(() => {
        debouncedSetFooter(document.footer);
    }, [document.footer, debouncedSetFooter]);

    return (
        <AppLayout>
            <div className="mt-5 mb-3 w-full max-w-3xl">
                <CaptionEditor value={document.caption} onChange={setCaptionState} />
                <FooterInput value={document.footer} onChange={setFooterState} />
            </div>

            <PlatformTabs
                outputs={[
                    {
                        platform: "whatsapp",
                        label: PLATFORM_CONFIG.whatsapp.label,
                        caption: document.caption,
                        footer: document.footer,
                    },
                    {
                        platform: "telegram",
                        label: PLATFORM_CONFIG.telegram.label,
                        caption: document.caption ? TelegramFormatter(document.caption) : "",
                        footer: document.footer ? TelegramFormatter(document.footer) : "",
                    },
                    {
                        platform: "youtube",
                        label: PLATFORM_CONFIG.youtube.label,
                        caption: document.caption ? YoutubeFormatter(document.caption) : "",
                        footer: document.footer ? YoutubeFormatter(document.footer) : "",
                    },
                ]}
            />
        </AppLayout>
    );
}

export default HomePage;

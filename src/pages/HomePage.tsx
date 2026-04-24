import { useEffect, useRef, useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import FooterInput from "@/components/inputs/FooterInput";
import CaptionEditor from "@/components/editor/CaptionEditor";
import PlatformTabs from "@/components/output/PlatformTabs";
import { TelegramFormatter, YoutubeFormatter } from "@/lib/formatter";
import { useLocalStorage } from "@/hooks/useLocalDraft";
import type { CaptionDocument } from "@/types/caption";

function createCaptionDocument(caption: string, footer: string): CaptionDocument {
    return {
        id: null,
        title: "Untitled caption",
        caption,
        footer,
        hashtags: [],
        customPlatformText: {},
        settings: {
            includeFooter: true,
            attachHashtags: false,
            optimizeForPlatform: true,
            previewMode: true,
        },
    };
}

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

    const [document, setDocument] = useState<CaptionDocument>(() =>
        createCaptionDocument(storedCaption, storedFooter)
    );

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

    const setCaptionState = (caption: string) => {
        setDocument((currentDocument) => ({
            ...currentDocument,
            caption,
        }));
    };

    const setFooterState = (footer: string) => {
        setDocument((currentDocument) => ({
            ...currentDocument,
            footer,
        }));
    };

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
                        label: "Whatsapp",
                        caption: document.caption,
                        footer: document.footer,
                    },
                    {
                        platform: "telegram",
                        label: "Telegram",
                        caption: document.caption ? TelegramFormatter(document.caption) : "",
                        footer: document.footer ? TelegramFormatter(document.footer) : "",
                    },
                    {
                        platform: "youtube",
                        label: "Youtube",
                        caption: document.caption ? YoutubeFormatter(document.caption) : "",
                        footer: document.footer ? YoutubeFormatter(document.footer) : "",
                    },
                ]}
            />
        </AppLayout>
    );
}

export default HomePage;

import { useEffect, useRef } from "react";
import AppLayout from "@/components/layout/AppLayout";
import FooterInput from "@/components/inputs/FooterInput";
import CaptionEditor from "@/components/editor/CaptionEditor";
import PlatformTabs from "@/components/output/PlatformTabs";
import { formatForPlatform } from "@/lib/formatter";
import { useLocalStorage } from "@/hooks/useLocalDraft";
import useCaptionDocument from "@/hooks/useCaptionDocument";

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
                    formatForPlatform("whatsapp", document),
                    formatForPlatform("telegram", document),
                    formatForPlatform("youtube", document),
                ]}
            />
        </AppLayout>
    );
}

export default HomePage;

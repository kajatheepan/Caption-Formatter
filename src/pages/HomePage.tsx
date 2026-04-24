import { useEffect, useRef } from "react";
import AppLayout from "@/components/layout/AppLayout";
import FooterInput from "@/components/inputs/FooterInput";
import CaptionEditor from "@/components/editor/CaptionEditor";
import PlatformTabs from "@/components/output/PlatformTabs";
import { formatAllPlatforms } from "@/lib/formatter";
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

    const {
        document,
        setCaption: setCaptionState,
        setFooter: setFooterState,
        resetDocument,
    } = useCaptionDocument({
        caption: storedCaption,
        footer: storedFooter,
    });

    const outputs = formatAllPlatforms(document);

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

    const handleClear = () => {
        resetDocument();
        setCaption("");
        setFooter("");
    };

    const handleCopyAll = async () => {
        const text = outputs
            .map((output) => `=== ${output.label} ===\n${output.text}`)
            .join("\n\n");

        await navigator.clipboard.writeText(text);
    };

    return (
        <AppLayout
            saveStatus="Saved locally"
            onClear={handleClear}
            onCopyAll={handleCopyAll}
        >
            <div className="mt-5 mb-3 w-full max-w-3xl">
                <CaptionEditor value={document.caption} onChange={setCaptionState} />
                <FooterInput value={document.footer} onChange={setFooterState} />
            </div>

            <PlatformTabs outputs={outputs} />
        </AppLayout>
    );
}

export default HomePage;

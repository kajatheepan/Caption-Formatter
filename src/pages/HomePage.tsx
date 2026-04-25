import { useEffect, useRef } from "react";
import AppLayout from "@/components/layout/AppLayout";
import FooterInput from "@/components/inputs/FooterInput";
import CaptionEditor from "@/components/editor/CaptionEditor";
import PlatformTabs from "@/components/output/PlatformTabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
            <div className="mx-auto grid w-full max-w-6xl gap-6 lg:grid-cols-[380px_minmax(0,1fr)]">
                <section className="flex flex-col gap-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm uppercase tracking-wide text-muted-foreground">
                                Caption
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <CaptionEditor value={document.caption} onChange={setCaptionState} />
                            <FooterInput value={document.footer} onChange={setFooterState} />
                        </CardContent>
                    </Card>
                </section>

                <section className="flex min-w-0 flex-col gap-4">
                    <div className="flex items-center justify-between px-1">
                        <h2 className="text-lg font-bold">Platform Preview</h2>
                        <p className="text-sm text-muted-foreground">All formatted outputs</p>
                    </div>
                    <PlatformTabs outputs={outputs} />
                </section>
            </div>
        </AppLayout>
    );
}

export default HomePage;

import { useEffect, useRef, useState } from "react";
import { Sparkles } from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import FooterInput from "@/components/inputs/FooterInput";
import HashtagInput from "@/components/inputs/HashtagInput";
import SettingsPanel from "@/components/inputs/SettingsPanel";
import CaptionEditor from "@/components/editor/CaptionEditor";
import PlatformTabs from "@/components/output/PlatformTabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatAllPlatforms } from "@/lib/formatter";
import { cleanText } from "@/lib/formatter/cleanText";
import { cleanHashtags } from "@/lib/hashtags/cleanHashtags";
import useClipboard from "@/hooks/useClipboard";
import { useLocalStorage } from "@/hooks/useLocalDraft";
import useCaptionDocument from "@/hooks/useCaptionDocument";
import type { CaptionDocument } from "@/types/caption";
import type { Platform } from "@/types/platform";

const defaultSettings: CaptionDocument["settings"] = {
    includeFooter: true,
    attachHashtags: false,
    optimizeForPlatform: true,
    previewMode: true,
};

function parseStoredHashtags(value: string) {
    try {
        const parsedValue = JSON.parse(value);
        return Array.isArray(parsedValue)
            ? parsedValue.filter((item): item is string => typeof item === "string")
            : [];
    } catch {
        return [];
    }
}

function parseStoredSettings(value: string): CaptionDocument["settings"] {
    try {
        const parsedValue = JSON.parse(value) as Partial<CaptionDocument["settings"]>;

        return {
            ...defaultSettings,
            ...parsedValue,
        };
    } catch {
        return defaultSettings;
    }
}

function debounce<T extends (...args: string[]) => void>(func: T, delay: number) {
    let timer: ReturnType<typeof setTimeout>;

    return (...args: Parameters<T>) => {
        clearTimeout(timer);
        timer = setTimeout(() => func(...args), delay);
    };
}

function HomePage() {
    const { value: storedCaption, setStoredValue: setCaption } = useLocalStorage("caption", "");
    const { value: storedFooter, setStoredValue: setFooter } = useLocalStorage("footer", "");
    const { value: storedHashtags, setStoredValue: setStoredHashtags } = useLocalStorage("hashtags", "[]");
    const { value: storedSettings, setStoredValue: setStoredSettings } = useLocalStorage(
        "settings",
        JSON.stringify(defaultSettings)
    );
    const [activePlatform, setActivePlatform] = useState<Platform>("whatsapp");
    const {
        copy: copyAll,
        copied: copyAllCopied,
        error: copyAllError,
    } = useClipboard();

    const {
        document,
        setCaption: setCaptionState,
        setFooter: setFooterState,
        setHashtags,
        updateSettings,
        setCustomPlatformText,
        resetCustomPlatformText,
        resetDocument,
    } = useCaptionDocument({
        caption: storedCaption,
        footer: storedFooter,
        hashtags: parseStoredHashtags(storedHashtags),
        settings: parseStoredSettings(storedSettings),
    });

    const outputs = formatAllPlatforms(document);
    const showCleanFormatting = Boolean(document.caption.trim() || document.footer.trim());

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

    useEffect(() => {
        setStoredHashtags(JSON.stringify(document.hashtags));
    }, [document.hashtags, setStoredHashtags]);

    useEffect(() => {
        setStoredSettings(JSON.stringify(document.settings));
    }, [document.settings, setStoredSettings]);

    const handleClear = () => {
        resetDocument();
        setCaption("");
        setFooter("");
        setStoredHashtags("[]");
        setStoredSettings(JSON.stringify(defaultSettings));
    };

    const handleCopyAll = () => {
        const text = outputs
            .map((output) => `=== ${output.label} ===\n${output.text}`)
            .join("\n\n");

        void copyAll(text);
    };

    const handleCleanFormatting = () => {
        setCaptionState(cleanText(document.caption));
        setFooterState(cleanText(document.footer));
        setHashtags(cleanHashtags(document.hashtags));
    };

    return (
        <AppLayout
            saveStatus="Saved locally"
            onClear={handleClear}
            onCopyAll={handleCopyAll}
            copyAllCopied={copyAllCopied}
            copyAllError={Boolean(copyAllError)}
        >
            <div className="mx-auto grid w-full max-w-[1160px] gap-6 lg:grid-cols-[380px_minmax(0,1fr)]">
                <section className="flex flex-col gap-4">
                    <Card className="rounded-[14px] shadow-md shadow-black/5">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-[11px] uppercase tracking-[0.12em] text-zinc-400">
                                ✦ Caption
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 pt-0">
                            <CaptionEditor
                                value={document.caption}
                                onChange={setCaptionState}
                                onClear={() => setCaptionState("")}
                            />
                            <FooterInput value={document.footer} onChange={setFooterState} />
                            {showCleanFormatting && (
                                <div className="flex items-center justify-between gap-3 rounded-xl border bg-primary/5 px-3 py-3">
                                    <div>
                                        <p className="text-sm font-semibold text-zinc-800">Format cleanup</p>
                                        <p className="text-xs text-muted-foreground">
                                            Remove extra spaces and blank lines.
                                        </p>
                                    </div>
                                    <Button
                                        type="button"
                                        size="sm"
                                        onClick={handleCleanFormatting}
                                        className="h-9 shrink-0 rounded-lg px-3 text-xs"
                                    >
                                        <Sparkles className="size-3.5" />
                                        Clean
                                    </Button>
                                </div>
                            )}
                            <SettingsPanel
                                settings={document.settings}
                                onChange={updateSettings}
                            />
                        </CardContent>
                    </Card>

                    <Card className="rounded-[14px] shadow-md shadow-black/5">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-[11px] uppercase tracking-[0.12em] text-zinc-400">
                                # Hashtags
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-0">
                            <HashtagInput
                                hashtags={document.hashtags}
                                onChange={setHashtags}
                                attachHashtags={document.settings.attachHashtags}
                                onAttachHashtagsChange={(attachHashtags) =>
                                    updateSettings({ attachHashtags })
                                }
                            />
                        </CardContent>
                    </Card>
                </section>

                <section className="flex min-w-0 flex-col gap-4">
                    <div className="flex items-center justify-between px-1">
                        <h2 className="text-lg font-bold">Platform Preview</h2>
                        <p className="text-sm text-muted-foreground">Select one platform</p>
                    </div>
                    <PlatformTabs
                        outputs={outputs}
                        activePlatform={activePlatform}
                        onPlatformChange={setActivePlatform}
                        customPlatformText={document.customPlatformText}
                        onCustomPlatformTextChange={setCustomPlatformText}
                        onCustomPlatformTextReset={resetCustomPlatformText}
                    />
                </section>
            </div>
        </AppLayout>
    );
}

export default HomePage;

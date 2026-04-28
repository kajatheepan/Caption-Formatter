import { useEffect, useState } from "react";
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
import useLocalDraft from "@/hooks/useLocalDraft";
import useCaptionDocument from "@/hooks/useCaptionDocument";
import type { Platform } from "@/types/platform";

function HomePage() {
    const { draftDocument, saveDraft, clearDraft } = useLocalDraft();
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
    } = useCaptionDocument(draftDocument);

    const outputs = formatAllPlatforms(document);
    const showCleanFormatting = Boolean(document.caption.trim() || document.footer.trim());

    useEffect(() => {
        saveDraft(document);
    }, [document, saveDraft]);

    const handleClear = () => {
        resetDocument();
        clearDraft();
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

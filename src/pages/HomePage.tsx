import { useEffect, useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import FooterInput from "@/components/inputs/FooterInput";
import HashtagInput from "@/components/inputs/HashtagInput";
import SettingsPanel from "@/components/inputs/SettingsPanel";
import CaptionEditor from "@/components/editor/CaptionEditor";
import PlatformTabs from "@/components/output/PlatformTabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatAllPlatforms } from "@/lib/formatter";
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
        setEditorContent,
        setFooter: setFooterState,
        setHashtags,
        updateSettings,
        setCustomPlatformText,
        setCustomPlatformContent,
        resetCustomPlatformText,
        resetDocument,
    } = useCaptionDocument(draftDocument);

    const outputs = formatAllPlatforms(document);

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

    return (
        <AppLayout
            saveStatus="Saved locally"
            onClear={handleClear}
            onCopyAll={handleCopyAll}
            copyAllCopied={copyAllCopied}
            copyAllError={Boolean(copyAllError)}
        >
            <div className="mx-auto grid w-full max-w-[1440px] gap-6 lg:grid-cols-[minmax(560px,1.2fr)_minmax(420px,0.8fr)]">
                <section className="flex flex-col gap-4 lg:sticky lg:top-24 lg:self-start">
                    <Card className="rounded-[14px] shadow-md shadow-black/5">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-[11px] uppercase tracking-[0.12em] text-zinc-400">
                                ✦ Caption
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 pt-0">
                            <CaptionEditor
                                value={document.caption}
                                editorContent={document.editorContent}
                                onChange={setCaptionState}
                                onEditorContentChange={setEditorContent}
                                onClear={() => {
                                    setCaptionState("");
                                    setEditorContent(null);
                                }}
                            />
                            <FooterInput value={document.footer} onChange={setFooterState} />
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

                <section className="flex min-w-0 w-full flex-col gap-4 lg:sticky lg:top-24 lg:self-start">
                    <div className="flex items-center justify-between px-1">
                        <h2 className="text-lg font-bold">Platform Preview</h2>
                        <p className="text-sm text-muted-foreground">Select one platform</p>
                    </div>
                    <PlatformTabs
                        outputs={outputs}
                        activePlatform={activePlatform}
                        onPlatformChange={setActivePlatform}
                        customPlatformText={document.customPlatformText}
                        customPlatformContent={document.customPlatformContent}
                        onCustomPlatformTextChange={setCustomPlatformText}
                        onCustomPlatformContentChange={setCustomPlatformContent}
                        onCustomPlatformTextReset={resetCustomPlatformText}
                    />
                </section>
            </div>
        </AppLayout>
    );
}

export default HomePage;

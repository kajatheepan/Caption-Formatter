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
import CopyAllModal from "@/components/output/CopyAllModal";
import { decodeDocumentFromHash } from "@/lib/sharing/shareUrl";

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
        loadDocument,
    } = useCaptionDocument(draftDocument);

    useEffect(() => {
        if (window.location.hash) {
            const sharedData = decodeDocumentFromHash(window.location.hash);
            if (sharedData) {
                loadDocument(sharedData);
            }
        }
    }, [loadDocument]);

    const outputs = formatAllPlatforms(document);

    useEffect(() => {
        saveDraft(document);
    }, [document, saveDraft]);

    const handleClear = () => {
        resetDocument();
        clearDraft();
        if (window.location.hash) {
            history.replaceState(null, "", window.location.pathname);
        }
    };

    const [isCopyModalOpen, setIsCopyModalOpen] = useState(false);

    const handleCopyAll = () => {
        setIsCopyModalOpen(true);
    };

    return (
        <AppLayout
            document={document}
            saveStatus="Saved locally"
            onClear={handleClear}
            onCopyAll={handleCopyAll}
            copyAllCopied={copyAllCopied}
            copyAllError={Boolean(copyAllError)}
        >
            <CopyAllModal
                open={isCopyModalOpen}
                outputs={outputs}
                onClose={() => setIsCopyModalOpen(false)}
                copy={copyAll}
            />
            <div className="mx-auto grid w-full max-w-[1440px] gap-6 lg:grid-cols-[minmax(560px,1.2fr)_minmax(420px,0.8fr)]">
                <section className="flex flex-col gap-4 lg:sticky lg:top-20 lg:self-start">
                    <Card className="rounded-2xl border-zinc-200/80 shadow-sm transition-all hover:shadow-md">
                        <CardHeader className="pb-3 border-b bg-zinc-50/50 rounded-t-2xl">
                            <CardTitle as="h2" className="text-xs uppercase tracking-[0.14em] text-zinc-500 font-bold flex items-center gap-1.5">
                                <span className="size-2 rounded-full bg-primary" />
                                Caption Editor
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 pt-4">
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

                    <Card className="rounded-2xl border-zinc-200/80 shadow-sm transition-all hover:shadow-md">
                        <CardHeader className="pb-3 border-b bg-zinc-50/50 rounded-t-2xl">
                            <CardTitle as="h2" className="text-xs uppercase tracking-[0.14em] text-zinc-500 font-bold flex items-center gap-1.5">
                                <span className="size-2 rounded-full bg-indigo-500" />
                                Hashtag Manager
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-4">
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

                <section className="flex min-w-0 w-full flex-col gap-4 lg:sticky lg:top-20 lg:self-start">
                    <div className="flex items-center justify-between px-1">
                        <div>
                            <h2 className="text-lg font-extrabold tracking-tight text-zinc-900">Platform Preview</h2>
                            <p className="text-xs text-muted-foreground">Select a platform to preview or customize format</p>
                        </div>
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

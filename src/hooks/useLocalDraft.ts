import { useCallback, useRef, useState } from "react";
import type { CaptionDocument } from "@/types/caption";

const LOCAL_DRAFT_KEY = "caption-forge-draft";
const SAVE_DELAY_MS = 1000;

const defaultSettings: CaptionDocument["settings"] = {
    includeFooter: true,
    attachHashtags: false,
    optimizeForPlatform: true,
    previewMode: true,
};

function isStringArray(value: unknown): value is string[] {
    return Array.isArray(value) && value.every((item) => typeof item === "string");
}

function parseDraft(value: string | null): Partial<CaptionDocument> | undefined {
    if (!value) {
        return undefined;
    }

    try {
        const parsedValue = JSON.parse(value) as Partial<CaptionDocument>;

        return {
            caption: typeof parsedValue.caption === "string" ? parsedValue.caption : "",
            footer: typeof parsedValue.footer === "string" ? parsedValue.footer : "",
            hashtags: isStringArray(parsedValue.hashtags) ? parsedValue.hashtags : [],
            customPlatformText: parsedValue.customPlatformText ?? {},
            settings: {
                ...defaultSettings,
                ...parsedValue.settings,
            },
        };
    } catch {
        return undefined;
    }
}

function readDraft() {
    try {
        return parseDraft(window.localStorage.getItem(LOCAL_DRAFT_KEY));
    } catch {
        return undefined;
    }
}

function useLocalDraft() {
    const [draftDocument, setDraftDocument] = useState<Partial<CaptionDocument> | undefined>(
        () => readDraft()
    );
    const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const skipNextSave = useRef(false);

    const saveDraft = useCallback((document: CaptionDocument) => {
        if (skipNextSave.current) {
            skipNextSave.current = false;
            return;
        }

        if (saveTimer.current) {
            clearTimeout(saveTimer.current);
        }

        saveTimer.current = setTimeout(() => {
            const nextDraft: Partial<CaptionDocument> = {
                caption: document.caption,
                footer: document.footer,
                hashtags: document.hashtags,
                settings: document.settings,
                customPlatformText: document.customPlatformText,
            };

            try {
                window.localStorage.setItem(LOCAL_DRAFT_KEY, JSON.stringify(nextDraft));
                setDraftDocument(nextDraft);
            } catch (error) {
                console.error("Error saving local draft:", error);
            }
        }, SAVE_DELAY_MS);
    }, []);

    const clearDraft = useCallback(() => {
        skipNextSave.current = true;

        if (saveTimer.current) {
            clearTimeout(saveTimer.current);
        }

        try {
            window.localStorage.removeItem(LOCAL_DRAFT_KEY);
        } catch (error) {
            console.error("Error clearing local draft:", error);
        }

        setDraftDocument(undefined);
    }, []);

    return {
        draftDocument,
        saveDraft,
        clearDraft,
    };
}

export default useLocalDraft;

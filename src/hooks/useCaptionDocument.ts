import { useState } from "react";
import type { JSONContent } from "@tiptap/core";
import type { CaptionDocument } from "@/types/caption";
import type { Platform } from "@/types/platform";

const defaultDocument: CaptionDocument = {
    id: null,
    title: "Untitled caption",
    caption: "",
    editorContent: null,
    footer: "",
    hashtags: [],
    customPlatformText: {},
    settings: {
        includeFooter: true,
        attachHashtags: false,
        optimizeForPlatform: true,
        previewMode: true,
    },
};

function createDocument(initialDocument?: Partial<CaptionDocument>): CaptionDocument {
    return {
        ...defaultDocument,
        ...initialDocument,
        settings: {
            ...defaultDocument.settings,
            ...initialDocument?.settings,
        },
        hashtags: initialDocument?.hashtags ?? defaultDocument.hashtags,
        customPlatformText: initialDocument?.customPlatformText ?? defaultDocument.customPlatformText,
    };
}

function useCaptionDocument(initialDocument?: Partial<CaptionDocument>) {
    const [document, setDocument] = useState<CaptionDocument>(() =>
        createDocument(initialDocument)
    );

    const setCaption = (caption: string) => {
        setDocument((currentDocument) => ({
            ...currentDocument,
            caption,
        }));
    };

    const setFooter = (footer: string) => {
        setDocument((currentDocument) => ({
            ...currentDocument,
            footer,
        }));
    };

    const setEditorContent = (editorContent: JSONContent | null) => {
        setDocument((currentDocument) => ({
            ...currentDocument,
            editorContent,
        }));
    };

    const setHashtags = (hashtags: string[]) => {
        setDocument((currentDocument) => ({
            ...currentDocument,
            hashtags,
        }));
    };

    const addHashtag = (hashtag: string) => {
        setDocument((currentDocument) => ({
            ...currentDocument,
            hashtags: [...currentDocument.hashtags, hashtag],
        }));
    };

    const removeHashtag = (hashtag: string) => {
        setDocument((currentDocument) => ({
            ...currentDocument,
            hashtags: currentDocument.hashtags.filter((currentHashtag) => currentHashtag !== hashtag),
        }));
    };

    const updateSettings = (settings: Partial<CaptionDocument["settings"]>) => {
        setDocument((currentDocument) => ({
            ...currentDocument,
            settings: {
                ...currentDocument.settings,
                ...settings,
            },
        }));
    };

    const setCustomPlatformText = (platform: Platform, text: string) => {
        setDocument((currentDocument) => ({
            ...currentDocument,
            customPlatformText: {
                ...currentDocument.customPlatformText,
                [platform]: text,
            },
        }));
    };

    const resetCustomPlatformText = (platform: Platform) => {
        setDocument((currentDocument) => {
            const nextCustomPlatformText = { ...currentDocument.customPlatformText };
            delete nextCustomPlatformText[platform];

            return {
                ...currentDocument,
                customPlatformText: nextCustomPlatformText,
            };
        });
    };

    const resetDocument = () => {
        setDocument(createDocument());
    };

    const loadDocument = (nextDocument: Partial<CaptionDocument>) => {
        setDocument(createDocument(nextDocument));
    };

    return {
        document,
        setCaption,
        setEditorContent,
        setFooter,
        addHashtag,
        removeHashtag,
        setHashtags,
        updateSettings,
        setCustomPlatformText,
        resetCustomPlatformText,
        resetDocument,
        loadDocument,
    };
}

export default useCaptionDocument;

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
    customPlatformContent: {},
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
        customPlatformContent: initialDocument?.customPlatformContent ?? defaultDocument.customPlatformContent,
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

    const setCustomPlatformContent = (platform: Platform, content: JSONContent | null) => {
        setDocument((currentDocument) => ({
            ...currentDocument,
            customPlatformContent: content
                ? {
                    ...currentDocument.customPlatformContent,
                    [platform]: content,
                }
                : (() => {
                    const nextCustomPlatformContent = { ...currentDocument.customPlatformContent };
                    delete nextCustomPlatformContent[platform];
                    return nextCustomPlatformContent;
                })(),
        }));
    };

    const resetCustomPlatformText = (platform: Platform) => {
        setDocument((currentDocument) => {
            const nextCustomPlatformText = { ...currentDocument.customPlatformText };
            delete nextCustomPlatformText[platform];

            const nextCustomPlatformContent = { ...currentDocument.customPlatformContent };
            delete nextCustomPlatformContent[platform];

            return {
                ...currentDocument,
                customPlatformText: nextCustomPlatformText,
                customPlatformContent: nextCustomPlatformContent,
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
        setCustomPlatformContent,
        resetCustomPlatformText,
        resetDocument,
        loadDocument,
    };
}

export default useCaptionDocument;

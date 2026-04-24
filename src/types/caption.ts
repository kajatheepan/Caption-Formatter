import type { Platform } from "./platform";

export type CaptionDocument = {
    id?: string | null;
    title: string;
    caption: string;
    editorContent?: unknown;
    footer: string;
    hashtags: string[];
    customPlatformText: Partial<Record<Platform, string>>;
    settings: {
        includeFooter: boolean;
        attachHashtags: boolean;
        optimizeForPlatform: boolean;
        previewMode: boolean;
    };
    createdAt?: string;
    updatedAt?: string;
};

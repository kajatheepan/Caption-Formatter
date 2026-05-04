import type { JSONContent } from "@tiptap/core";
import type { Platform } from "./platform";

export type CaptionDocument = {
    id?: string | null;
    title: string;
    caption: string;
    editorContent?: JSONContent | null;
    footer: string;
    hashtags: string[];
    customPlatformText: Partial<Record<Platform, string>>;
    customPlatformContent: Partial<Record<Platform, JSONContent>>;
    settings: {
        includeFooter: boolean;
        attachHashtags: boolean;
        optimizeForPlatform: boolean;
        previewMode: boolean;
    };
    createdAt?: string;
    updatedAt?: string;
};

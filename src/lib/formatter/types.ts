import type { Platform } from "@/types/platform";
import type { FormattingNotice } from "./rich-text/formattingPolicy";

export type FormattedOutput = {
    platform: Platform;
    label: string;
    text: string;
    html?: string;
    characterCount: number;
    characterLimit: number;
    isOverLimit: boolean;
    formattingNotices?: FormattingNotice[];
};

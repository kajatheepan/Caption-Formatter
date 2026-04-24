import type { Platform } from "@/types/platform";

export type FormattedOutput = {
    platform: Platform;
    label: string;
    text: string;
    characterCount: number;
    characterLimit: number;
    isOverLimit: boolean;
};

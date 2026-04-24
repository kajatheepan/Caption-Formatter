export const APP_NAME = "CaptionForge";

export const PLATFORM_CONFIG = {
    whatsapp: {
        label: "WhatsApp",
        limit: 65536,
        badge: "Markdown",
    },
    telegram: {
        label: "Telegram",
        limit: 4096,
        badge: "Markdown",
    },
    youtube: {
        label: "YouTube",
        limit: 5000,
        badge: "Plain Text",
    },
    instagram: {
        label: "Instagram",
        limit: 2200,
        badge: "Structured",
    },
    twitter: {
        label: "X / Twitter",
        limit: 280,
        badge: "Plain Text",
    },
    linkedin: {
        label: "LinkedIn",
        limit: 3000,
        badge: "Structured",
    },
} as const;

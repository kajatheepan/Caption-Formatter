// Utility for converting styled text (bold, italic, bold-italic, monospace) into Unicode mathematical symbols
// for platforms like Instagram and LinkedIn that do not render native Markdown.

export function toUnicodeBold(text: string): string {
    return text.replace(/[a-zA-Z0-9]/g, (ch) => {
        const code = ch.charCodeAt(0);
        if (code >= 65 && code <= 90) return String.fromCodePoint(0x1d400 + (code - 65)); // A-Z Bold
        if (code >= 97 && code <= 122) return String.fromCodePoint(0x1d41a + (code - 97)); // a-z Bold
        if (code >= 48 && code <= 57) return String.fromCodePoint(0x1d7ce + (code - 48)); // 0-9 Bold
        return ch;
    });
}

export function toUnicodeItalic(text: string): string {
    return text.replace(/[a-zA-Z]/g, (ch) => {
        const code = ch.charCodeAt(0);
        if (code >= 65 && code <= 90) return String.fromCodePoint(0x1d434 + (code - 65)); // A-Z Italic
        if (code === 104) return "\u210e"; // 'h' in mathematical italic is Planck constant symbol
        if (code >= 97 && code <= 122) return String.fromCodePoint(0x1d44e + (code - 97)); // a-z Italic
        return ch;
    });
}

export function toUnicodeBoldItalic(text: string): string {
    return text.replace(/[a-zA-Z]/g, (ch) => {
        const code = ch.charCodeAt(0);
        if (code >= 65 && code <= 90) return String.fromCodePoint(0x1d468 + (code - 65)); // A-Z Bold-Italic
        if (code >= 97 && code <= 122) return String.fromCodePoint(0x1d482 + (code - 97)); // a-z Bold-Italic
        return ch;
    });
}

export function toUnicodeMonospace(text: string): string {
    return text.replace(/[a-zA-Z0-9]/g, (ch) => {
        const code = ch.charCodeAt(0);
        if (code >= 65 && code <= 90) return String.fromCodePoint(0x1d670 + (code - 65)); // A-Z Monospace
        if (code >= 97 && code <= 122) return String.fromCodePoint(0x1d68a + (code - 97)); // a-z Monospace
        if (code >= 48 && code <= 57) return String.fromCodePoint(0x1d7f6 + (code - 48)); // 0-9 Monospace
        return ch;
    });
}

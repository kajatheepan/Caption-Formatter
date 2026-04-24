export function TelegramFormatter(input: string) {
    let caption = input.replace(/\*([^\s].*?[^\s])\*/g, "**$1**");
    caption = caption.replace(/_([^\s].*?[^\s])_/g, "__$1__");
    caption = caption.replace(/~([^\s].*?[^\s])~/g, "~$1~");
    return caption;
}

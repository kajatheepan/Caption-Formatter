export function YoutubeFormatter(input: string) {
    let caption = input.replace(/\*([^\s].*?[^\s])\*/g, "$1");
    caption = caption.replace(/_([^\s].*?[^\s])_/g, "$1");
    caption = caption.replace(/~([^\s].*?[^\s])~/g, "$1");
    return caption;
}

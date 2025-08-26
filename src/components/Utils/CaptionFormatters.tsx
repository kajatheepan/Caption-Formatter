



function TelegramFormatter(input: String) {
    let caption = input.replace(/\*([^\s].*?[^\s])\*/g, "**$1**");
    caption = caption.replace(/_([^\s].*?[^\s])_/g, "__$1__");
    caption = caption.replace(/~([^\s].*?[^\s])~/g, "~$1~");
    return caption;
}

function YoutubeFormatter(input: String) {
    let caption = input.replace(/\*([^\s].*?[^\s])\*/g, "$1");
    caption = caption.replace(/_([^\s].*?[^\s])_/g, "$1");
    caption = caption.replace(/~([^\s].*?[^\s])~/g, "$1");
    return caption;
}

export { TelegramFormatter, YoutubeFormatter };
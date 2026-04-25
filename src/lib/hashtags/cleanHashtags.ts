export function cleanHashtags(input: string | string[]) {
    const words = Array.isArray(input) ? input.flatMap((item) => item.split(/[\s,]+/)) : input.split(/[\s,]+/);
    const seenHashtags = new Set<string>();
    const cleanedHashtags: string[] = [];

    for (const word of words) {
        const trimmedWord = word.trim().replace(/^#+/, "").toLowerCase();

        if (!trimmedWord) {
            continue;
        }

        const hashtag = `#${trimmedWord}`;

        if (seenHashtags.has(hashtag)) {
            continue;
        }

        seenHashtags.add(hashtag);
        cleanedHashtags.push(hashtag);
    }

    return cleanedHashtags;
}

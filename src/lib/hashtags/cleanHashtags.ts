export function cleanHashtags(input: string | string[]) {
    const words = Array.isArray(input) ? input : input.split(/\s+/);
    const seenHashtags = new Set<string>();
    const cleanedHashtags: string[] = [];

    for (const word of words) {
        const trimmedWord = word.trim();

        if (!trimmedWord) {
            continue;
        }

        const hashtag = trimmedWord.startsWith("#") ? trimmedWord : `#${trimmedWord}`;
        const normalizedHashtag = hashtag.toLowerCase();

        if (seenHashtags.has(normalizedHashtag)) {
            continue;
        }

        seenHashtags.add(normalizedHashtag);
        cleanedHashtags.push(hashtag);
    }

    return cleanedHashtags;
}

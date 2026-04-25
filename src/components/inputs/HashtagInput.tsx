import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cleanHashtags } from "@/lib/hashtags/cleanHashtags";

type HashtagInputProps = {
    hashtags: string[];
    onChange: (hashtags: string[]) => void;
};

function HashtagInput({ hashtags, onChange }: HashtagInputProps) {
    const [value, setValue] = useState("");

    const addHashtags = () => {
        const cleanedHashtags = cleanHashtags([...hashtags, value]);
        onChange(cleanedHashtags);
        setValue("");
    };

    const removeHashtag = (hashtag: string) => {
        onChange(hashtags.filter((currentHashtag) => currentHashtag !== hashtag));
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            addHashtags();
        }
    };

    return (
        <div className="space-y-3">
            <div className="flex gap-2">
                <Input
                    value={value}
                    onChange={(event) => setValue(event.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type hashtags, press Space or Enter"
                />
                <Button type="button" variant="outline" onClick={addHashtags}>
                    Add
                </Button>
            </div>

            {hashtags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {hashtags.map((hashtag) => (
                        <button
                            key={hashtag}
                            type="button"
                            onClick={() => removeHashtag(hashtag)}
                            className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary"
                        >
                            {hashtag}
                            <X className="size-3" />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

export default HashtagInput;

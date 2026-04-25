import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cleanHashtags } from "@/lib/hashtags/cleanHashtags";
import { AttachHashtagsToggle } from "./SettingsPanel";

type HashtagInputProps = {
    hashtags: string[];
    onChange: (hashtags: string[]) => void;
    attachHashtags: boolean;
    onAttachHashtagsChange: (checked: boolean) => void;
};

function HashtagInput({
    hashtags,
    onChange,
    attachHashtags,
    onAttachHashtagsChange,
}: HashtagInputProps) {
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
        <div className="space-y-4">
            <div className="flex gap-2">
                <Input
                    value={value}
                    onChange={(event) => setValue(event.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type hashtag, press Space or Enter..."
                    className="h-11 rounded-[10px] bg-[#f7f7f8] focus:bg-white"
                />
                <Button type="button" variant="outline" onClick={addHashtags} className="h-11">
                    Auto
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

            <div className="border-t pt-4">
                <AttachHashtagsToggle
                    checked={attachHashtags}
                    onChange={onAttachHashtagsChange}
                />
            </div>
        </div>
    );
}

export default HashtagInput;

import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import CharacterCounter from "./CharacterCounter";
import CopyButton from "./CopyButton";

type PlatformPreviewCardProps = {
    label: string;
    text: string;
    characterCount: number;
    characterLimit: number;
    isOverLimit: boolean;
};

function PlatformPreviewCard({
    label,
    text,
    characterCount,
    characterLimit,
    isOverLimit,
}: PlatformPreviewCardProps) {
    return (
        <Card className="w-full wrap-anywhere">
            <CardTitle className="mx-4">{label}</CardTitle>
            <CardContent className="mx-4 overflow-y-auto">
                <div style={{ whiteSpace: "pre-wrap" }}>{text}</div>
            </CardContent>
            <CardFooter className="mx-4 flex flex-col items-center">
                <CharacterCounter
                    count={characterCount}
                    limit={characterLimit}
                    isOverLimit={isOverLimit}
                />
                <CopyButton text={text} />
            </CardFooter>
        </Card>
    );
}

export default PlatformPreviewCard;

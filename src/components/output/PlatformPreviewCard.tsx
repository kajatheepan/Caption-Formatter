import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import CopyButton from "./CopyButton";

type PlatformPreviewCardProps = {
    label: string;
    text: string;
};

function PlatformPreviewCard({ label, text }: PlatformPreviewCardProps) {
    return (
        <Card className="w-full wrap-anywhere">
            <CardTitle className="mx-4">{label}</CardTitle>
            <CardContent className="mx-4 overflow-y-auto">
                <div style={{ whiteSpace: "pre-wrap" }}>{text}</div>
            </CardContent>
            <CardFooter className="mx-4 flex flex-col items-center">
                <CopyButton text={text} />
            </CardFooter>
        </Card>
    );
}

export default PlatformPreviewCard;

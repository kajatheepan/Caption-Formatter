import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import CopyButton from "./CopyButton";

type PlatformPreviewCardProps = {
    label: string;
    caption: string;
    footer: string;
};

function PlatformPreviewCard({ label, caption, footer }: PlatformPreviewCardProps) {
    return (
        <Card className="w-full wrap-anywhere">
            <CardTitle className="mx-4">{label}</CardTitle>
            <CardContent className="mx-4 overflow-y-auto">
                <div style={{ whiteSpace: "pre-wrap" }}>
                    {caption}
                    <br />
                    {footer}
                </div>
            </CardContent>
            <CardFooter className="mx-4 flex flex-col items-center">
                <CopyButton text={`${caption}\n\n${footer}`} />
            </CardFooter>
        </Card>
    );
}

export default PlatformPreviewCard;

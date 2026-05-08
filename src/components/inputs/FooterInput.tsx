import { useId } from "react";
import { Textarea } from "@/components/ui/textarea";

type FooterInputProps = {
    value: string;
    onChange: (value: string) => void;
};

function FooterInput({ value, onChange }: FooterInputProps) {
    const headingId = useId();

    return (
        <>
            <div className="border-t pt-4">
                <h3 id={headingId} className="text-[13px] font-medium text-zinc-700">
                    Footer <span className="font-normal text-muted-foreground">(optional)</span>
                </h3>
            </div>
            <Textarea
                aria-labelledby={headingId}
                placeholder="Add CTA, link, or sign-off..."
                className="min-h-16 resize-y rounded-[10px] bg-[#f7f7f8] text-wrap break-words leading-6 focus:bg-white"
                value={value}
                onChange={(event) => onChange(event.target.value)}
            />
        </>
    );
}

export default FooterInput;

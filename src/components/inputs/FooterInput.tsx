import { Textarea } from "@/components/ui/textarea";

type FooterInputProps = {
    value: string;
    onChange: (value: string) => void;
};

function FooterInput({ value, onChange }: FooterInputProps) {
    return (
        <>
            <h3 className="mt-2">Footer</h3>
            <Textarea
                placeholder="Enter the footer of the caption"
                className="mt-2 min-h-24 text-wrap break-words"
                value={value}
                onChange={(event) => onChange(event.target.value)}
            />
        </>
    );
}

export default FooterInput;

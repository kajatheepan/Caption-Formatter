import { Textarea } from "@/components/ui/textarea";

type CaptionEditorProps = {
    value: string;
    onChange: (value: string) => void;
};

function CaptionEditor({ value, onChange }: CaptionEditorProps) {
    return (
        <>
            <h3 className="text-[13px] font-medium text-zinc-700">Main Caption</h3>
            <Textarea
                placeholder="Write your caption here..."
                className="min-h-32 resize-y rounded-[10px] bg-[#f7f7f8] text-wrap break-words leading-6 focus:bg-white"
                value={value}
                onChange={(event) => onChange(event.target.value)}
            />
        </>
    );
}

export default CaptionEditor;

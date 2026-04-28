import { Textarea } from "@/components/ui/textarea";

type CaptionEditorProps = {
    value: string;
    onChange: (value: string) => void;
    onClear?: () => void;
};

function CaptionEditor({ value, onChange, onClear }: CaptionEditorProps) {
    return (
        <>
            <div className="flex items-center justify-between gap-3">
                <h3 className="text-[13px] font-medium text-zinc-700">Main Caption</h3>
                {value.trim() && onClear && (
                    <button
                        type="button"
                        onClick={onClear}
                        className="text-xs font-semibold text-primary"
                    >
                        Clear caption
                    </button>
                )}
            </div>
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

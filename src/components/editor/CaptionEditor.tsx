import { Textarea } from "@/components/ui/textarea";

type CaptionEditorProps = {
    value: string;
    onChange: (value: string) => void;
};

function CaptionEditor({ value, onChange }: CaptionEditorProps) {
    return (
        <>
            <h3 className="text-sm font-semibold text-muted-foreground">Main Caption</h3>
            <Textarea
                placeholder="Enter caption with formatting: *bold*, _italic_, ~strikethrough~"
                className="min-h-32 text-wrap break-words"
                value={value}
                onChange={(event) => onChange(event.target.value)}
            />
        </>
    );
}

export default CaptionEditor;

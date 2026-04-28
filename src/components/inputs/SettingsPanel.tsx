import type { CaptionDocument } from "@/types/caption";

type SettingsPanelProps = {
    settings: CaptionDocument["settings"];
    onChange: (settings: Partial<CaptionDocument["settings"]>) => void;
};

type SettingRowProps = {
    label: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
};

function SettingRow({ label, checked, onChange }: SettingRowProps) {
    return (
        <label className="flex cursor-pointer items-center gap-2 text-[13px] font-medium text-zinc-700">
            <span className="relative inline-flex h-5 w-9 items-center">
                <input
                    type="checkbox"
                    checked={checked}
                    onChange={(event) => onChange(event.target.checked)}
                    className="peer sr-only"
                />
                <span className="absolute inset-0 rounded-full bg-zinc-300 transition peer-checked:bg-primary" />
                <span className="absolute left-0.5 size-4 rounded-full bg-white shadow-sm transition peer-checked:translate-x-4" />
            </span>
            <span>{label}</span>
        </label>
    );
}

type AttachHashtagsToggleProps = {
    checked: boolean;
    onChange: (checked: boolean) => void;
};

export function AttachHashtagsToggle({ checked, onChange }: AttachHashtagsToggleProps) {
    return (
        <label className="flex cursor-pointer items-center gap-2 text-[13px] font-medium text-zinc-700">
            <span className="relative inline-flex h-5 w-9 items-center">
                <input
                    type="checkbox"
                    checked={checked}
                    onChange={(event) => onChange(event.target.checked)}
                    className="peer sr-only"
                />
                <span className="absolute inset-0 rounded-full bg-zinc-300 transition peer-checked:bg-primary" />
                <span className="absolute left-0.5 size-4 rounded-full bg-white shadow-sm transition peer-checked:translate-x-4" />
            </span>
            <span>Attach hashtags to caption</span>
        </label>
    );
}

function SettingsPanel({ settings, onChange }: SettingsPanelProps) {
    return (
        <div className="flex flex-wrap gap-5 border-t pt-4">
            <SettingRow
                label="Include Footer"
                checked={settings.includeFooter}
                onChange={(includeFooter) => onChange({ includeFooter })}
            />
        </div>
    );
}

export default SettingsPanel;

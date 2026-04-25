import type { CaptionDocument } from "@/types/caption";

type SettingsPanelProps = {
    settings: CaptionDocument["settings"];
    onChange: (settings: Partial<CaptionDocument["settings"]>) => void;
};

type SettingRowProps = {
    label: string;
    description: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
};

function SettingRow({ label, description, checked, onChange }: SettingRowProps) {
    return (
        <label className="flex items-center justify-between gap-4 rounded-lg border bg-background px-3 py-2">
            <span>
                <span className="block text-sm font-semibold">{label}</span>
                <span className="block text-xs text-muted-foreground">{description}</span>
            </span>
            <input
                type="checkbox"
                checked={checked}
                onChange={(event) => onChange(event.target.checked)}
                className="size-4 accent-primary"
            />
        </label>
    );
}

function SettingsPanel({ settings, onChange }: SettingsPanelProps) {
    return (
        <div className="space-y-3">
            <SettingRow
                label="Include Footer"
                description="Append footer to formatted outputs"
                checked={settings.includeFooter}
                onChange={(includeFooter) => onChange({ includeFooter })}
            />
            <SettingRow
                label="Attach Hashtags"
                description="Add hashtags to the end of outputs"
                checked={settings.attachHashtags}
                onChange={(attachHashtags) => onChange({ attachHashtags })}
            />
            <SettingRow
                label="Optimize for Platform"
                description="Keep platform-specific formatting enabled"
                checked={settings.optimizeForPlatform}
                onChange={(optimizeForPlatform) => onChange({ optimizeForPlatform })}
            />
            <SettingRow
                label="Preview Mode"
                description="Show formatted output in preview cards"
                checked={settings.previewMode}
                onChange={(previewMode) => onChange({ previewMode })}
            />
        </div>
    );
}

export default SettingsPanel;

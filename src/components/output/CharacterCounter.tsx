type CharacterCounterProps = {
    count: number;
    limit: number;
    isOverLimit: boolean;
};

function CharacterCounter({ count, limit, isOverLimit }: CharacterCounterProps) {
    const percentage = Math.min((count / limit) * 100, 100);
    const status = isOverLimit
        ? "error"
        : percentage > 90
            ? "danger"
            : percentage >= 70
                ? "warning"
                : "normal";
    const barColor = {
        normal: "bg-primary",
        warning: "bg-amber-400",
        danger: "bg-orange-500",
        error: "bg-red-500",
    }[status];
    const textColor = {
        normal: "text-muted-foreground",
        warning: "text-amber-600",
        danger: "text-orange-600",
        error: "text-red-600",
    }[status];
    const statusLabel = {
        normal: "Normal",
        warning: "Warning",
        danger: "Danger",
        error: "Over limit",
    }[status];

    return (
        <div className="w-full">
            <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                <div
                    className={`h-full rounded-full ${barColor}`}
                    style={{ width: `${percentage}%` }}
                />
            </div>
            <div className="mt-1 flex justify-between text-xs">
                <span className={`font-medium ${textColor}`}>
                    {count} chars · {statusLabel}
                </span>
                <span className="text-muted-foreground">Limit: {limit.toLocaleString()}</span>
            </div>
        </div>
    );
}

export default CharacterCounter;

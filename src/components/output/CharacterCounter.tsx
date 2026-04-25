type CharacterCounterProps = {
    count: number;
    limit: number;
    isOverLimit: boolean;
};

function CharacterCounter({ count, limit, isOverLimit }: CharacterCounterProps) {
    const percentage = Math.min((count / limit) * 100, 100);
    const barColor = isOverLimit
        ? "bg-red-500"
        : percentage > 80
            ? "bg-amber-500"
            : "bg-primary";

    return (
        <div className="w-full">
            <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                <div
                    className={`h-full rounded-full ${barColor}`}
                    style={{ width: `${percentage}%` }}
                />
            </div>
            <div className="mt-1 flex justify-between text-xs text-muted-foreground">
                <span className={isOverLimit ? "font-semibold text-red-600" : ""}>
                    {count} chars
                    {isOverLimit ? " - over limit" : ""}
                </span>
                <span>Limit: {limit.toLocaleString()}</span>
            </div>
        </div>
    );
}

export default CharacterCounter;

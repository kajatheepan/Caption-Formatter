type CharacterCounterProps = {
    count: number;
    limit: number;
    isOverLimit: boolean;
};

function CharacterCounter({ count, limit, isOverLimit }: CharacterCounterProps) {
    return (
        <p className={isOverLimit ? "text-sm text-red-600" : "text-sm text-muted-foreground"}>
            {count}/{limit} characters
            {isOverLimit ? " - over limit" : ""}
        </p>
    );
}

export default CharacterCounter;

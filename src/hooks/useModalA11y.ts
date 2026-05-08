import { useEffect, useRef } from "react";

const FOCUSABLE_SELECTOR =
    'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Wires a dialog element up to the WAI-ARIA modal dialog pattern:
 * focuses the dialog on open, traps Tab focus inside it, closes on
 * Escape, and restores focus to the trigger element on close.
 */
export function useModalA11y(open: boolean, onClose: () => void) {
    const dialogRef = useRef<HTMLDivElement | null>(null);
    const previouslyFocusedRef = useRef<HTMLElement | null>(null);
    const onCloseRef = useRef(onClose);
    onCloseRef.current = onClose;

    useEffect(() => {
        if (!open) return;

        previouslyFocusedRef.current = document.activeElement as HTMLElement | null;
        dialogRef.current?.focus();

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                event.preventDefault();
                onCloseRef.current();
                return;
            }

            if (event.key !== "Tab" || !dialogRef.current) {
                return;
            }

            const focusable = dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
            if (focusable.length === 0) {
                event.preventDefault();
                return;
            }

            const first = focusable[0];
            const last = focusable[focusable.length - 1];

            if (event.shiftKey && document.activeElement === first) {
                event.preventDefault();
                last.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault();
                first.focus();
            }
        };

        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            previouslyFocusedRef.current?.focus();
        };
    }, [open]);

    return dialogRef;
}

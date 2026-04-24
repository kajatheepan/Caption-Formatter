import { useState } from "react";

export function useLocalStorage(key: string, initValue: string) {
    const [value, setValue] = useState(() => {
        try {
            const item = window.localStorage.getItem(key);
            return item ? item : initValue;
        } catch {
            return initValue;
        }
    });

    const setStoredValue = (newValue: string) => {
        try {
            setValue(newValue);
            window.localStorage.setItem(key, newValue);
        } catch (error) {
            console.error("Error setting localStorage item:", error);
        }
    };

    return { value, setStoredValue };
}

import { useState,  useCallback } from "react";

export function useDebounce<T>(callback: (value: T) => void, delay: number) {
    const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);

    const debouncedCallback = useCallback(
        (value: T) => {
            if (timer) clearTimeout(timer);
            const newTimer = setTimeout(() => {
                callback(value);
            }, delay);
            setTimer(newTimer);
        },
        [callback, delay, timer]
    );

    return debouncedCallback;
}

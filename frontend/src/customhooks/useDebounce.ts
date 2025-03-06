import { useCallback, useRef } from "react";

export function useDebounce<T>(callback: (value: T) => void, delay: number) {
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const debouncedCallback = useCallback((value: T) => {
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => {
            callback(value);
        }, delay);
    }, [callback, delay]);

    return debouncedCallback;
}

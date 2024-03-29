import { useSettings } from "@/services/settings";
import { getColorForTheme } from "@/styles/colors";
import { themeMode } from "@/styles/theme";
import { useEffect, useMemo, useState } from "react";

// Matching the default tailwind breakpoints.
const breakpoints = {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    '2xl': 1536 
};

export const useIsPhone = () => !aboveBreakpoint('md');

export const aboveBreakpoint = (breakpoint: keyof typeof breakpoints) =>
    useMediaQuery(`(min-width: ${breakpoints[breakpoint]}px)`);

export const useMediaQuery = (query: string) => {
    const mq = useMemo(() => globalThis.matchMedia?.(query), [query]);
    const [value, setValue] = useState<boolean>(mq?.matches);

    useEffect(() => {
        const updateValue = () => setValue(mq.matches);
        mq.addEventListener('change', updateValue);
        updateValue();
        return () => mq.removeEventListener('change', updateValue);
    }, [mq]);

    return value;
}

export const usePrefersDark = () => useMediaQuery('(prefers-color-scheme: dark)');

export const useTheme = () => {
    const settings = useSettings();
    usePrefersDark();

    return themeMode(settings);
}
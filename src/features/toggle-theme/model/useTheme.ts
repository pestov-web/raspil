import { useCallback, useLayoutEffect, useState } from 'react';
import { theme, type Theme, toggleThemeValue } from '~shared/lib';

const resolveInitialTheme = (): Theme => {
    if (typeof window === 'undefined') {
        return 'light';
    }

    const preferred = theme.getCurrent();
    theme.apply(preferred);
    return preferred;
};

export const useTheme = () => {
    const [currentTheme, setCurrentTheme] = useState<Theme>(resolveInitialTheme);

    useLayoutEffect(() => {
        theme.persist(currentTheme);
    }, [currentTheme]);

    const toggle = useCallback(() => {
        setCurrentTheme((prev) => toggleThemeValue(prev));
    }, []);

    const setTheme = useCallback((next: Theme) => {
        setCurrentTheme(next);
    }, []);

    return {
        theme: currentTheme,
        isDark: currentTheme === 'dark',
        toggle,
        setTheme,
    };
};

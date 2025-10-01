export type Theme = 'light' | 'dark';

const THEME_STORAGE_KEY = 'raspil:theme';

const resolvePreferredTheme = (): Theme => {
    if (typeof window === 'undefined') {
        return 'light';
    }

    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === 'light' || stored === 'dark') {
        return stored;
    }

    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return prefersDark ? 'dark' : 'light';
};

const applyThemeClass = (theme: Theme) => {
    if (typeof document === 'undefined') {
        return;
    }

    const root = document.documentElement;
    const body = document.body;

    const applyToElement = (element: HTMLElement | null) => {
        if (!element) return;
        element.classList.toggle('dark', theme === 'dark');
        element.dataset.theme = theme;
        element.style.colorScheme = theme;
    };

    applyToElement(root);
    applyToElement(body);
};

export const theme = {
    storageKey: THEME_STORAGE_KEY,
    getCurrent(): Theme {
        return resolvePreferredTheme();
    },
    persist(next: Theme) {
        if (typeof window === 'undefined') {
            return;
        }

        applyThemeClass(next);
        window.localStorage.setItem(THEME_STORAGE_KEY, next);
    },
    apply(themeValue: Theme) {
        applyThemeClass(themeValue);
    },
};

export const toggleThemeValue = (value: Theme): Theme => (value === 'dark' ? 'light' : 'dark');

import { MoonStar, Sun } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../model/useTheme';

type ThemeToggleProps = {
    className?: string;
};

export const ThemeToggle = ({ className = '' }: ThemeToggleProps) => {
    const { theme, toggle, isDark } = useTheme();
    const { t } = useTranslation('translation', { keyPrefix: 'theme' });

    return (
        <button
            type='button'
            onClick={toggle}
            className={`inline-flex items-center justify-center rounded-full border border-gray-200 p-2 text-gray-700 transition hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800 ${className}`}
            aria-pressed={isDark}
            aria-label={theme === 'dark' ? t('switchToLight') : t('switchToDark')}
            title={theme === 'dark' ? t('switchToLight') : t('switchToDark')}
        >
            {isDark ? <MoonStar size={18} /> : <Sun size={18} />}
        </button>
    );
};

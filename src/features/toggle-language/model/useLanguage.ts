import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { changeLanguage, SUPPORTED_LANGUAGES } from '~shared/lib';
import type { SupportedLanguage } from '~shared/lib';

const normalizeLanguage = (value: string): SupportedLanguage => {
    const directMatch = SUPPORTED_LANGUAGES.find((language) => language === value);
    if (directMatch) {
        return directMatch;
    }

    const partialMatch = SUPPORTED_LANGUAGES.find((language) => value.startsWith(language));
    if (partialMatch) {
        return partialMatch;
    }

    return SUPPORTED_LANGUAGES[0]!;
};

export const useLanguage = () => {
    const { i18n, t } = useTranslation();
    const current = normalizeLanguage(i18n.language);

    const languages = useMemo(
        () =>
            SUPPORTED_LANGUAGES.map((code) => ({
                code,
                shortLabel: t(`language.short.${code}`),
                fullLabel: t(`language.full.${code}`),
            })),
        [t]
    );

    const setLanguage = useCallback((language: SupportedLanguage) => {
        changeLanguage(language);
    }, []);

    return { currentLanguage: current, languages, setLanguage };
};

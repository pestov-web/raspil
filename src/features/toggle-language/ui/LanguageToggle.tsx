import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { Languages } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../model/useLanguage';

interface LanguageToggleProps {
    className?: string;
}

const baseButtonClasses =
    'inline-flex items-center justify-center gap-2 rounded-full border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800';

export const LanguageToggle = ({ className = '' }: LanguageToggleProps) => {
    const { t } = useTranslation('translation', { keyPrefix: 'language' });
    const { currentLanguage, languages, setLanguage } = useLanguage();

    const currentLabels = languages.find((item) => item.code === currentLanguage);
    const currentShort = currentLabels?.shortLabel ?? currentLanguage.toUpperCase();

    return (
        <Menu as='div' className={`relative ${className}`}>
            <Menu.Button
                type='button'
                className={baseButtonClasses}
                aria-label={t('switcherLabel')}
                title={t('current', { language: currentLabels?.fullLabel ?? currentShort })}
            >
                <Languages size={16} />
                <span className='font-semibold'>{currentShort}</span>
            </Menu.Button>

            <Transition
                as={Fragment}
                enter='transition duration-150 ease-out'
                enterFrom='opacity-0 translate-y-1'
                enterTo='opacity-100 translate-y-0'
                leave='transition duration-100 ease-in'
                leaveFrom='opacity-100 translate-y-0'
                leaveTo='opacity-0 translate-y-1'
            >
                <Menu.Items className='absolute right-0 z-20 mt-2 w-40 origin-top-right rounded-xl border border-gray-200 bg-white p-1 shadow-lg ring-1 ring-black/5 dark:border-slate-700 dark:bg-slate-900'>
                    {languages.map((language) => (
                        <Menu.Item key={language.code}>
                            {({ active }) => (
                                <button
                                    type='button'
                                    onClick={() => setLanguage(language.code)}
                                    className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition ${
                                        active
                                            ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-200'
                                            : 'text-gray-700 dark:text-slate-200'
                                    } ${language.code === currentLanguage ? 'font-semibold' : ''}`}
                                >
                                    <span>{language.fullLabel}</span>
                                    <span className='text-xs uppercase text-gray-500 dark:text-slate-400'>
                                        {language.shortLabel}
                                    </span>
                                </button>
                            )}
                        </Menu.Item>
                    ))}
                </Menu.Items>
            </Transition>
        </Menu>
    );
};

import i18n from 'i18next';
import type { Resource } from 'i18next';
import { initReactI18next } from 'react-i18next';

export const SUPPORTED_LANGUAGES = ['ru', 'en'] as const;
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];
export const LANGUAGE_STORAGE_KEY = 'raspil:language';

const resources = {
    ru: {
        translation: {
            common: {
                appName: 'Raspil',
                cancel: 'Отмена',
                close: 'Закрыть',
                save: 'Сохранить',
                copy: 'Скопировать',
                confirm: 'Подтвердить',
                create: 'Создать',
                load: 'Загрузить',
                delete: 'Удалить',
                currency: '{{amount}} ₽',
                unnamedSession: 'Без названия',
                personFallback: 'Человек {{id}}',
            },
            language: {
                switcherLabel: 'Язык интерфейса',
                switchTo: 'Переключить на {{language}}',
                current: 'Текущий язык: {{language}}',
                short: {
                    ru: 'RU',
                    en: 'EN',
                },
                full: {
                    ru: 'Русский',
                    en: 'English',
                },
            },
            theme: {
                switchToLight: 'Переключить на светлую тему',
                switchToDark: 'Переключить на тёмную тему',
            },
            app: {
                title: 'Калькулятор расходов',
                subtitle: 'Простой способ честно разделить общие траты',
                currentSession: 'Текущая сессия',
                autoSaveBadge: 'Черновик сохраняется автоматически',
            },
            people: {
                add: 'Добавить человека',
                calculate: 'Рассчитать',
                invalidExpenses: 'Исправьте выделенные суммы, чтобы выполнить расчет.',
                invalidExpensesShort: 'Исправьте ошибки в суммах, чтобы выполнить расчет',
                nameLabel: 'Имя',
                namePlaceholder: 'Введите имя',
                expensesLabel: 'Потратил',
                expensesPlaceholder: '0',
                expensesError: 'Введите неотрицательное число',
                resultLabel: 'Результат',
                resultZero: '0 ₽',
                resultDebtor: 'Должен: {{amount}} ₽',
                resultCreditor: 'Вернуть: {{amount}} ₽',
            },
            stats: {
                total: 'Общие расходы',
                perPerson: 'На каждого',
            },
            summary: {
                title: 'Сводка расчетов',
                total: 'Общие расходы',
                perPerson: 'На каждого',
                transfersRequired: 'Переводов нужно',
                transfersHeading: 'Кто кому переводит:',
                transfersNone: 'Переводы не требуются — балансы уже выровнены.',
                transfersCaption: 'Список ниже',
                transfersCaptionEmpty: 'Не требуется',
                debtorsTitle: 'Должны доплатить:',
                creditorsTitle: 'Нужно вернуть:',
            },
            actions: {
                sessionMenu: 'Сессия',
                exportMenu: 'Экспорт & шаринг',
                manageSessions: 'Управление сессиями',
                saveSession: 'Сохранить сессию',
                newSession: 'Новая сессия',
                shareLink: 'Поделиться ссылкой',
                showQr: 'Показать QR-код',
                showQrShort: 'Показать QR',
                exportPdf: 'Экспорт в PDF',
                exportCsv: 'Экспорт в CSV',
                menuTitle: 'Действия',
                openMenu: 'Меню действий',
                closeMenu: 'Закрыть меню',
            },
            dialogs: {
                saveSession: {
                    title: 'Сохранить сессию',
                    description: 'Укажите понятное название, чтобы потом легко найти расчет.',
                    nameLabel: 'Название сессии',
                    namePlaceholder: 'Например, Поездка в Казань',
                },
                newSession: {
                    title: 'Создать новую сессию?',
                    description: 'Текущий расчет сохранится автоматически, и вы начнете с чистого листа.',
                    confirm: 'Создать',
                },
                share: {
                    title: 'Поделиться расчетом',
                    description: 'Скопируйте ссылку вручную, если автоматическое копирование не сработало.',
                    copy: 'Скопировать',
                },
                qr: {
                    title: 'Поделиться через QR-код',
                    description: 'Отсканируйте код на другом устройстве, чтобы открыть расчет.',
                    generateError: 'Не удалось сформировать QR-код.',
                    copy: 'Скопировать ссылку',
                },
            },
            share: {
                title: 'Распил расходов',
                summary: 'Общие расходы: {{total}} ₽\nНа каждого: {{perPerson}} ₽',
                menuSuccess: 'Ссылка на расчет отправлена через системное меню',
                clipboardSuccess: 'Ссылка на расчет скопирована в буфер обмена',
                clipboardError: 'Не удалось скопировать ссылку автоматически. Скопируйте ссылку вручную.',
                dialogCopySuccess: 'Ссылка скопирована в буфер обмена',
                dialogCopyError: 'Не удалось скопировать ссылку. Попробуйте вручную.',
                qrCopySuccess: 'Ссылка скопирована',
                qrCopyError: 'Не удалось скопировать ссылку.',
                receivedSessionName: 'Полученный расчет',
            },
            save: {
                success: 'Сессия сохранена',
                nameRequired: 'Введите название сессии',
            },
            load: {
                success: 'Сессия "{{name}}" загружена',
            },
            newSession: {
                name: 'Новый расчет',
                description: 'Автоматически созданная сессия',
                created: 'Создана новая сессия',
            },
            currentSession: {
                name: 'Текущий расчет',
                description: 'Автоматически сохраненная сессия',
            },
            errors: {
                invalidExpenses: 'Исправьте ошибки в суммах, чтобы выполнить расчет',
                exportNoPeople: 'Сначала добавьте участников для экспорта',
                exportCsv: 'Не удалось экспортировать CSV. Попробуйте ещё раз.',
                exportPdf: 'Не удалось экспортировать PDF. Попробуйте ещё раз.',
                clipboard: 'Не удалось скопировать ссылку.',
                importRead: 'Не удалось прочитать файл. Проверьте формат и попробуйте снова.',
                importFailed: 'Ошибка импорта: {{message}}',
            },
            success: {
                exportCsv: 'CSV-файл сохранен',
                exportPdf: 'PDF-файл сохранен',
                import: 'Импортировано {{count}} сессий',
            },
            sessionManager: {
                title: 'Управление сессиями',
                exportAll: 'Экспорт всех',
                import: 'Импорт',
                count: 'Сессий: {{count}}',
                loading: 'Загрузка сессий...',
                emptyTitle: 'Нет сохраненных сессий',
                emptyDescription: 'Создайте расчет и сохраните его как сессию',
                peopleCount: '{{count}} чел.',
                load: 'Загрузить',
                deleteConfirmTitle: 'Удалить сессию "{{name}}"?',
                deleteConfirmDescription: 'Это действие нельзя отменить.',
                deleteConfirmAction: 'Удалить',
                deleteSuccess: 'Сессия "{{name}}" удалена',
            },
            shareSessionPage: {
                loading: 'Подготавливаем расчет...',
                title: 'Импорт расчета',
                noData: 'Не найдено данных для расчета. Убедитесь, что вы открыли корректную ссылку.',
                success: 'Расчет «{{name}}» готов! Перенаправляем на главную...',
                error: 'Не удалось распознать ссылку. Проверьте, не была ли она повреждена.',
                back: 'На главную',
            },
            exportDoc: {
                browserOnly: 'Экспорт доступен только в браузере',
                descriptionLabel: 'Описание',
                dateLabel: 'Дата экспорта: {{date}}',
                summaryCards: {
                    total: 'Общие расходы',
                    perPerson: 'На каждого',
                    transfers: 'Переводов нужно',
                    transfersCaption: 'Список ниже',
                    transfersCaptionEmpty: 'Не требуется',
                },
                participantsTitle: 'Участники и балансы',
                participants: {
                    name: 'Участник',
                    expenses: 'Расходы',
                    duty: 'Обязанность',
                },
                transfers: {
                    title: 'Рекомендованные переводы',
                    heading: 'Переводы между участниками',
                    payer: 'Плательщик',
                    receiver: 'Получатель',
                    amount: 'Сумма',
                    none: 'Переводы не требуются — балансы уже выровнены.',
                },
                csv: {
                    session: 'Расчет',
                    description: 'Описание',
                    total: 'Общие расходы',
                    perPerson: 'На каждого',
                    transfersCount: 'Переводов нужно',
                    name: 'Имя',
                    expenses: 'Расходы',
                    duty: 'Обязанность',
                },
                footer: 'Сгенерировано в Raspil — калькуляторе совместных расходов',
            },
        },
    },
    en: {
        translation: {
            common: {
                appName: 'Raspil',
                cancel: 'Cancel',
                close: 'Close',
                save: 'Save',
                copy: 'Copy',
                confirm: 'Confirm',
                create: 'Create',
                load: 'Load',
                delete: 'Delete',
                currency: '{{amount}} ₽',
                unnamedSession: 'Untitled session',
                personFallback: 'Person {{id}}',
            },
            language: {
                switcherLabel: 'Interface language',
                switchTo: 'Switch to {{language}}',
                current: 'Current language: {{language}}',
                short: {
                    ru: 'RU',
                    en: 'EN',
                },
                full: {
                    ru: 'Русский',
                    en: 'English',
                },
            },
            theme: {
                switchToLight: 'Switch to light theme',
                switchToDark: 'Switch to dark theme',
            },
            app: {
                title: 'Expense calculator',
                subtitle: 'Split shared costs fairly in seconds',
                currentSession: 'Current session',
                autoSaveBadge: 'Draft is saved automatically',
            },
            people: {
                add: 'Add person',
                calculate: 'Calculate',
                invalidExpenses: 'Fix the highlighted amounts before calculating.',
                invalidExpensesShort: 'Fix amount errors before calculating',
                nameLabel: 'Name',
                namePlaceholder: 'Enter a name',
                expensesLabel: 'Spent',
                expensesPlaceholder: '0',
                expensesError: 'Enter a non-negative number',
                resultLabel: 'Balance',
                resultZero: '0 ₽',
                resultDebtor: 'Should pay: {{amount}} ₽',
                resultCreditor: 'Should receive: {{amount}} ₽',
            },
            stats: {
                total: 'Total expenses',
                perPerson: 'Per person',
            },
            summary: {
                title: 'Expense summary',
                total: 'Total expenses',
                perPerson: 'Per person',
                transfersRequired: 'Transfers needed',
                transfersHeading: 'Who pays whom:',
                transfersNone: 'No transfers needed — balances are already settled.',
                transfersCaption: 'List below',
                transfersCaptionEmpty: 'Not required',
                debtorsTitle: 'Need to pay:',
                creditorsTitle: 'Need to receive:',
            },
            actions: {
                sessionMenu: 'Session',
                exportMenu: 'Export & sharing',
                manageSessions: 'Manage sessions',
                saveSession: 'Save session',
                newSession: 'New session',
                shareLink: 'Share link',
                showQr: 'Show QR code',
                showQrShort: 'Show QR',
                exportPdf: 'Export to PDF',
                exportCsv: 'Export to CSV',
                menuTitle: 'Actions',
                openMenu: 'Actions menu',
                closeMenu: 'Close menu',
            },
            dialogs: {
                saveSession: {
                    title: 'Save session',
                    description: 'Pick a clear name so you can find the calculation later.',
                    nameLabel: 'Session name',
                    namePlaceholder: 'Trip to Kazan, for example',
                },
                newSession: {
                    title: 'Start a new session?',
                    description: 'The current calculation will be saved automatically and you will start fresh.',
                    confirm: 'Create',
                },
                share: {
                    title: 'Share calculation',
                    description: 'Copy the link manually if automatic copying fails.',
                    copy: 'Copy link',
                },
                qr: {
                    title: 'Share via QR code',
                    description: 'Scan the code on another device to open the calculation.',
                    generateError: 'Failed to generate the QR code.',
                    copy: 'Copy link',
                },
            },
            share: {
                title: 'Raspil expenses',
                summary: 'Total expenses: {{total}} ₽\nPer person: {{perPerson}} ₽',
                menuSuccess: 'Share link was sent via the system dialog',
                clipboardSuccess: 'Share link copied to clipboard',
                clipboardError: "Couldn't copy the link automatically. Copy it manually.",
                dialogCopySuccess: 'Link copied to clipboard',
                dialogCopyError: "Couldn't copy the link. Try again manually.",
                qrCopySuccess: 'Link copied',
                qrCopyError: "Couldn't copy the link.",
                receivedSessionName: 'Shared calculation',
            },
            save: {
                success: 'Session saved',
                nameRequired: 'Enter a session name',
            },
            load: {
                success: 'Session "{{name}}" loaded',
            },
            newSession: {
                name: 'New calculation',
                description: 'Automatically created session',
                created: 'Started a new session',
            },
            currentSession: {
                name: 'Current calculation',
                description: 'Automatically saved session',
            },
            errors: {
                invalidExpenses: 'Fix amount errors before calculating',
                exportNoPeople: 'Add participants before exporting',
                exportCsv: 'Failed to export CSV. Try again.',
                exportPdf: 'Failed to export PDF. Try again.',
                clipboard: "Couldn't copy the link.",
                importRead: "Couldn't read the file. Check the format and try again.",
                importFailed: 'Import error: {{message}}',
            },
            success: {
                exportCsv: 'CSV file saved',
                exportPdf: 'PDF file saved',
                import: 'Imported {{count}} sessions',
            },
            sessionManager: {
                title: 'Manage sessions',
                exportAll: 'Export all',
                import: 'Import',
                count: 'Sessions: {{count}}',
                loading: 'Loading sessions...',
                emptyTitle: 'No saved sessions yet',
                emptyDescription: 'Create a calculation and save it as a session',
                peopleCount: '{{count}} people',
                load: 'Load',
                deleteConfirmTitle: 'Delete session "{{name}}"?',
                deleteConfirmDescription: "This action can't be undone.",
                deleteConfirmAction: 'Delete',
                deleteSuccess: 'Session "{{name}}" deleted',
            },
            shareSessionPage: {
                loading: 'Preparing the calculation...',
                title: 'Importing calculation',
                noData: 'No calculation data found. Make sure the link is correct.',
                success: 'Calculation "{{name}}" is ready! Redirecting to the home page...',
                error: "Couldn't parse the link. It might be damaged.",
                back: 'Back to home',
            },
            exportDoc: {
                browserOnly: 'Export is only available in the browser',
                descriptionLabel: 'Description',
                dateLabel: 'Export date: {{date}}',
                summaryCards: {
                    total: 'Total expenses',
                    perPerson: 'Per person',
                    transfers: 'Transfers needed',
                    transfersCaption: 'List below',
                    transfersCaptionEmpty: 'Not required',
                },
                participantsTitle: 'Participants and balances',
                participants: {
                    name: 'Participant',
                    expenses: 'Expenses',
                    duty: 'Balance',
                },
                transfers: {
                    title: 'Suggested transfers',
                    heading: 'Transfers between participants',
                    payer: 'Payer',
                    receiver: 'Receiver',
                    amount: 'Amount',
                    none: 'No transfers needed — balances are already settled.',
                },
                csv: {
                    session: 'Calculation',
                    description: 'Description',
                    total: 'Total expenses',
                    perPerson: 'Per person',
                    transfersCount: 'Transfers needed',
                    name: 'Name',
                    expenses: 'Expenses',
                    duty: 'Balance',
                },
                footer: 'Generated with Raspil — the shared expenses calculator',
            },
        },
    },
} satisfies Resource;

const detectInitialLanguage = (): SupportedLanguage => {
    if (typeof window === 'undefined') {
        return 'ru';
    }

    try {
        const stored = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
        if (stored && SUPPORTED_LANGUAGES.includes(stored as SupportedLanguage)) {
            return stored as SupportedLanguage;
        }
    } catch (error) {
        console.warn('Failed to read stored language', error);
    }

    const browserLanguage = window.navigator.language?.slice(0, 2).toLowerCase();
    if (browserLanguage && SUPPORTED_LANGUAGES.includes(browserLanguage as SupportedLanguage)) {
        return browserLanguage as SupportedLanguage;
    }

    return 'ru';
};

const updateDocumentLanguage = (language: SupportedLanguage) => {
    if (typeof document === 'undefined') {
        return;
    }

    document.documentElement.lang = language;
    document.documentElement.setAttribute('data-language', language);
};

void i18n.use(initReactI18next).init({
    resources,
    lng: detectInitialLanguage(),
    fallbackLng: 'ru',
    supportedLngs: SUPPORTED_LANGUAGES,
    interpolation: {
        escapeValue: false,
    },
    returnObjects: true,
});

updateDocumentLanguage(i18n.language as SupportedLanguage);

i18n.on('languageChanged', (lng: string) => {
    if (!SUPPORTED_LANGUAGES.includes(lng as SupportedLanguage)) {
        return;
    }

    updateDocumentLanguage(lng as SupportedLanguage);

    if (typeof window === 'undefined') {
        return;
    }

    try {
        window.localStorage.setItem(LANGUAGE_STORAGE_KEY, lng);
    } catch (error) {
        console.warn('Failed to persist language preference', error);
    }
});

export const changeLanguage = (language: SupportedLanguage) => {
    if (SUPPORTED_LANGUAGES.includes(language)) {
        void i18n.changeLanguage(language);
    }
};

export default i18n;

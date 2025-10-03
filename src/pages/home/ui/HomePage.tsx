import { Fragment, useEffect, useMemo, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Users } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import type { Person } from '~entities/person';
import { createPerson } from '~entities/person';
import type { Session } from '~entities/session';
import { createSession, updateSession } from '~entities/session';
import {
    calculateDuties,
    getPerPersonShare,
    getTotalExpenses,
    createShareUrl,
    storage,
    isValidExpenseInput,
    SHARE_QUERY_PARAM,
} from '~shared/lib';
import { ExpenseStats } from '~widgets/expense-calculator';
import { PeopleManagerControls } from '~widgets/people-manager';
import { ExpenseSummary } from '~widgets/expense-summary';
import { PeopleTable } from '~widgets/people-table';
import { SessionControls } from '~widgets/session-controls';
import { SessionManagerModal } from '~widgets/session-manager';
import { useToast, ConfirmDialog } from '~shared/ui';
import { ThemeToggle } from '~features/toggle-theme';

export const HomePage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [people, setPeople] = useState<Person[]>([{ id: 1, name: '', expenses: '', duty: 0 }]);
    useEffect(() => {
        if (location.pathname !== '/') {
            return;
        }

        const params = new URLSearchParams(location.search);
        const encoded = params.get(SHARE_QUERY_PARAM);
        if (!encoded) {
            return;
        }

        navigate(`/share?${SHARE_QUERY_PARAM}=${encoded}`, { replace: true });
    }, [location.pathname, location.search, navigate]);

    const [currentSession, setCurrentSession] = useState<Session | null>(null);
    const [showSessionManager, setShowSessionManager] = useState(false);
    const toast = useToast();
    const [isSaveDialogOpen, setSaveDialogOpen] = useState(false);
    const [sessionNameDraft, setSessionNameDraft] = useState('');
    const [isNewSessionConfirmOpen, setNewSessionConfirmOpen] = useState(false);
    const [isShareDialogOpen, setShareDialogOpen] = useState(false);
    const [shareDialogLink, setShareDialogLink] = useState<string | null>(null);

    const hasInvalidExpenses = useMemo(() => people.some((person) => !isValidExpenseInput(person.expenses)), [people]);

    useEffect(() => {
        const savedSession = storage.loadCurrentSession();
        if (savedSession) {
            setCurrentSession(savedSession);
            setPeople(savedSession.people);
        } else {
            const newSession = createSession({
                name: 'Текущий расчет',
                description: 'Автоматически сохраненная сессия',
            });
            setCurrentSession(newSession);
        }
    }, []);

    useEffect(() => {
        setCurrentSession((previous) => {
            if (!previous) {
                return previous;
            }

            const updatedSession = updateSession(previous, {
                people,
                totalExpenses: getTotalExpenses(people),
                isCalculated: people.some((p) => p.duty !== 0),
            });

            storage.saveCurrentSession(updatedSession);
            return updatedSession;
        });
    }, [people]);

    useEffect(() => {
        if (currentSession) {
            setSessionNameDraft(currentSession.name);
        }
    }, [currentSession]);

    const addPerson = () => {
        const newPerson = createPerson({ name: '', expenses: '' }, people);
        setPeople([...people, newPerson]);
    };

    const removePerson = (id: number) => {
        if (people.length > 1) {
            setPeople(people.filter((p) => p.id !== id));
        }
    };

    const updatePerson = (id: number, field: string, value: string) => {
        setPeople(people.map((p) => (p.id === id ? { ...p, [field]: value } : p)));
    };

    const handleCalculateDuties = () => {
        if (hasInvalidExpenses) {
            toast.error('Исправьте ошибки в суммах, чтобы выполнить расчет');
            return;
        }
        const updatedPeople = calculateDuties(people);
        setPeople(updatedPeople);
    };

    const handleSaveSession = () => {
        if (!currentSession) return;
        setSessionNameDraft(currentSession.name);
        setSaveDialogOpen(true);
    };

    const confirmSaveSession = () => {
        if (!currentSession) return;
        const name = sessionNameDraft.trim();
        if (!name) {
            toast.error('Введите название сессии');
            return;
        }

        const sessionToSave = updateSession(currentSession, {
            name,
            people,
            isCalculated: people.some((p) => p.duty !== 0),
        });

        storage.saveNamedSession(sessionToSave);
        setCurrentSession(sessionToSave);
        setSessionNameDraft(name);
        toast.success('Сессия сохранена');
        setSaveDialogOpen(false);
    };

    const handleLoadSession = (sessionId: string) => {
        const savedSessions = storage.loadSavedSessions();
        const sessionToLoad = savedSessions.find((s) => s.id === sessionId);

        if (sessionToLoad) {
            setCurrentSession(sessionToLoad);
            setPeople(sessionToLoad.people);
            setShowSessionManager(false);
            toast.success(`Сессия "${sessionToLoad.name}" загружена`);
        }
    };

    const handleDeleteSession = (sessionId: string) => {
        storage.deleteNamedSession(sessionId);
    };

    const handleNewSession = () => {
        setNewSessionConfirmOpen(true);
    };

    const confirmNewSession = () => {
        const newSession = createSession({
            name: 'Новый расчет',
            description: 'Автоматически созданная сессия',
            people: [{ id: 1, name: '', expenses: '', duty: 0 }],
        });

        setCurrentSession(newSession);
        setPeople(newSession.people);
        setNewSessionConfirmOpen(false);
        toast.info('Создана новая сессия');
    };

    const cancelNewSession = () => {
        setNewSessionConfirmOpen(false);
    };

    const handleShareSession = async () => {
        if (!currentSession) return;

        const sessionToShare = updateSession(currentSession, {
            people,
            totalExpenses: getTotalExpenses(people),
            isCalculated: people.some((p) => p.duty !== 0),
        });
        setCurrentSession(sessionToShare);
        storage.saveCurrentSession(sessionToShare);

        const shareUrl = createShareUrl(sessionToShare);
        const summary = `Общие расходы: ${getTotalExpenses(people).toFixed(2)} ₽\nНа каждого: ${getPerPersonShare(
            people
        ).toFixed(2)} ₽`;

        if (navigator.share) {
            try {
                await navigator.share({
                    title: sessionToShare.name || 'Распил расходов',
                    text: summary,
                    url: shareUrl,
                });
                toast.success('Ссылка на расчет отправлена через системное меню');
                return;
            } catch (error) {
                console.warn('Web Share API failed, fallback to clipboard.', error);
            }
        }

        try {
            await navigator.clipboard.writeText(shareUrl);
            toast.success('Ссылка на расчет скопирована в буфер обмена');
        } catch (error) {
            console.error('Failed to copy share link:', error);
            setShareDialogLink(shareUrl);
            setShareDialogOpen(true);
            toast.error('Не удалось скопировать ссылку автоматически. Скопируйте ссылку вручную.');
        }
    };

    const closeShareDialog = () => {
        setShareDialogOpen(false);
        setShareDialogLink(null);
    };

    const handleCopyShareDialogLink = async () => {
        if (!shareDialogLink) return;
        try {
            await navigator.clipboard.writeText(shareDialogLink);
            toast.success('Ссылка скопирована в буфер обмена');
            closeShareDialog();
        } catch (error) {
            console.error('Failed to copy share link from dialog:', error);
            toast.error('Не удалось скопировать ссылку. Попробуйте вручную.');
        }
    };

    const totalExpenses = getTotalExpenses(people);
    const perPersonShare = getPerPersonShare(people);

    return (
        <div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 transition-colors dark:from-slate-950 dark:to-slate-900'>
            <header className='mx-auto mb-6 flex max-w-4xl flex-col items-start gap-4 rounded-2xl border border-transparent bg-white/80 px-6 py-4 shadow-xl backdrop-blur transition-colors dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-100 md:flex-row md:items-center md:justify-between'>
                <div className='flex items-center gap-3'>
                    <Users className='text-indigo-600 dark:text-indigo-400' size={32} />
                    <div>
                        <h1 className='text-2xl font-bold text-gray-800 dark:text-slate-100'>Калькулятор расходов</h1>
                        <p className='text-sm text-gray-600 dark:text-slate-400'>
                            Простой способ честно разделить общие траты
                        </p>
                    </div>
                </div>

                <ThemeToggle className='w-full justify-center md:w-auto' />
            </header>

            <div className='mx-auto max-w-4xl text-gray-900 transition-colors dark:text-slate-100'>
                <div className='rounded-2xl border border-transparent bg-white p-6 shadow-xl transition-colors dark:border-slate-800 dark:bg-slate-900'>
                    <div className='mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
                        {currentSession && (
                            <div className='flex items-start justify-between gap-3 rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm text-gray-600 transition-colors dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-300 md:flex-1'>
                                <div>
                                    <p className='font-medium text-gray-800 dark:text-slate-100'>Текущая сессия</p>
                                    <p className='text-sm'>{currentSession.name}</p>
                                </div>
                                <span className='rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-200'>
                                    Черновик сохраняется автоматически
                                </span>
                            </div>
                        )}

                        <div className='flex items-center justify-end gap-2 text-sm self-stretch md:self-auto'>
                            <SessionControls
                                onOpenManager={() => setShowSessionManager(true)}
                                onSaveSession={handleSaveSession}
                                onNewSession={handleNewSession}
                                onShareSession={handleShareSession}
                            />
                        </div>
                    </div>

                    <ExpenseStats people={people} totalExpenses={totalExpenses} perPersonShare={perPersonShare} />

                    <PeopleTable people={people} updatePerson={updatePerson} removePerson={removePerson} />

                    <PeopleManagerControls
                        onAddPerson={addPerson}
                        onCalculateDuties={handleCalculateDuties}
                        hasInvalidExpenses={hasInvalidExpenses}
                    />

                    <ExpenseSummary people={people} totalExpenses={totalExpenses} perPersonShare={perPersonShare} />
                </div>
            </div>

            <SessionManagerModal
                isOpen={showSessionManager}
                onClose={() => setShowSessionManager(false)}
                onLoadSession={handleLoadSession}
                onDeleteSession={handleDeleteSession}
            />

            <Transition show={isSaveDialogOpen} as={Fragment} appear>
                <Dialog as='div' className='relative z-50' onClose={() => setSaveDialogOpen(false)}>
                    <Transition.Child
                        as={Fragment}
                        enter='duration-200 ease-out'
                        enterFrom='opacity-0'
                        enterTo='opacity-100'
                        leave='duration-150 ease-in'
                        leaveFrom='opacity-100'
                        leaveTo='opacity-0'
                    >
                        <div className='fixed inset-0 bg-black/30 backdrop-blur-sm' />
                    </Transition.Child>

                    <div className='fixed inset-0 flex items-center justify-center p-4'>
                        <Transition.Child
                            as={Fragment}
                            enter='duration-200 ease-out'
                            enterFrom='opacity-0 scale-95'
                            enterTo='opacity-100 scale-100'
                            leave='duration-150 ease-in'
                            leaveFrom='opacity-100 scale-100'
                            leaveTo='opacity-0 scale-95'
                        >
                            <Dialog.Panel className='w-full max-w-md rounded-2xl bg-white p-6 shadow-xl transition-colors dark:border dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100'>
                                <Dialog.Title className='text-lg font-semibold text-gray-900 dark:text-slate-100'>
                                    Сохранить сессию
                                </Dialog.Title>
                                <Dialog.Description className='mt-2 text-sm text-gray-600 dark:text-slate-400'>
                                    Укажите понятное название, чтобы потом легко найти расчет.
                                </Dialog.Description>

                                <form
                                    className='mt-4 space-y-4'
                                    onSubmit={(event) => {
                                        event.preventDefault();
                                        confirmSaveSession();
                                    }}
                                >
                                    <div>
                                        <label
                                            htmlFor='session-name'
                                            className='text-sm font-medium text-gray-700 dark:text-slate-300'
                                        >
                                            Название сессии
                                        </label>
                                        <input
                                            id='session-name'
                                            value={sessionNameDraft}
                                            onChange={(event) => setSessionNameDraft(event.target.value)}
                                            className='mt-2 w-full rounded-xl border border-gray-200 px-3 py-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100'
                                            placeholder='Например, Поездка в Казань'
                                            autoFocus
                                        />
                                    </div>

                                    <div className='flex justify-end gap-3 pt-2'>
                                        <button
                                            type='button'
                                            onClick={() => setSaveDialogOpen(false)}
                                            className='rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800'
                                        >
                                            Отмена
                                        </button>
                                        <button
                                            type='submit'
                                            className='rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700'
                                        >
                                            Сохранить
                                        </button>
                                    </div>
                                </form>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </Dialog>
            </Transition>

            <ConfirmDialog
                open={isNewSessionConfirmOpen}
                onClose={cancelNewSession}
                onConfirm={confirmNewSession}
                title='Создать новую сессию?'
                description='Текущий расчет сохранится автоматически, и вы начнете с чистого листа.'
                confirmText='Создать'
            />

            <Transition show={isShareDialogOpen} as={Fragment} appear>
                <Dialog as='div' className='relative z-50' onClose={closeShareDialog}>
                    <Transition.Child
                        as={Fragment}
                        enter='duration-200 ease-out'
                        enterFrom='opacity-0'
                        enterTo='opacity-100'
                        leave='duration-150 ease-in'
                        leaveFrom='opacity-100'
                        leaveTo='opacity-0'
                    >
                        <div className='fixed inset-0 bg-black/30 backdrop-blur-sm' />
                    </Transition.Child>

                    <div className='fixed inset-0 flex items-center justify-center p-4'>
                        <Transition.Child
                            as={Fragment}
                            enter='duration-200 ease-out'
                            enterFrom='opacity-0 scale-95'
                            enterTo='opacity-100 scale-100'
                            leave='duration-150 ease-in'
                            leaveFrom='opacity-100 scale-100'
                            leaveTo='opacity-0 scale-95'
                        >
                            <Dialog.Panel className='w-full max-w-md rounded-2xl bg-white p-6 shadow-xl transition-colors dark:border dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100'>
                                <Dialog.Title className='text-lg font-semibold text-gray-900 dark:text-slate-100'>
                                    Поделиться расчетом
                                </Dialog.Title>
                                <Dialog.Description className='mt-2 text-sm text-gray-600 dark:text-slate-400'>
                                    Скопируйте ссылку вручную, если автоматическое копирование не сработало.
                                </Dialog.Description>

                                <div className='mt-4 space-y-4'>
                                    <div className='break-all rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm text-gray-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100'>
                                        {shareDialogLink}
                                    </div>
                                    <div className='flex justify-end gap-3'>
                                        <button
                                            type='button'
                                            onClick={closeShareDialog}
                                            className='rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800'
                                        >
                                            Закрыть
                                        </button>
                                        <button
                                            type='button'
                                            onClick={handleCopyShareDialogLink}
                                            className='inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700'
                                        >
                                            Скопировать
                                        </button>
                                    </div>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </Dialog>
            </Transition>
        </div>
    );
};

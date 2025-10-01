import { Fragment, useEffect, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Users } from 'lucide-react';
import type { Person } from '~entities/person';
import { createPerson } from '~entities/person';
import type { Session } from '~entities/session';
import { createSession, updateSession } from '~entities/session';
import { calculateDuties, getPerPersonShare, getTotalExpenses, createShareUrl, storage } from '~shared/lib';
import { ExpenseStats } from '~widgets/expense-calculator';
import { PeopleManagerControls } from '~widgets/people-manager';
import { ExpenseSummary } from '~widgets/expense-summary';
import { PeopleTable } from '~widgets/people-table';
import { SessionControls } from '~widgets/session-controls';
import { SessionManagerModal } from '~widgets/session-manager';
import { useToast, ConfirmDialog } from '~shared/ui';

export const HomePage = () => {
    const [people, setPeople] = useState<Person[]>([{ id: 1, name: '', expenses: '', duty: 0 }]);
    const [currentSession, setCurrentSession] = useState<Session | null>(null);
    const [showSessionManager, setShowSessionManager] = useState(false);
    const toast = useToast();
    const [isSaveDialogOpen, setSaveDialogOpen] = useState(false);
    const [sessionNameDraft, setSessionNameDraft] = useState('');
    const [isNewSessionConfirmOpen, setNewSessionConfirmOpen] = useState(false);
    const [isShareDialogOpen, setShareDialogOpen] = useState(false);
    const [shareDialogLink, setShareDialogLink] = useState<string | null>(null);

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
        if (currentSession) {
            const updatedSession = updateSession(currentSession, {
                people,
                totalExpenses: getTotalExpenses(people),
                isCalculated: people.some((p) => p.duty !== 0),
            });
            setCurrentSession(updatedSession);
            storage.saveCurrentSession(updatedSession);
        }
    }, [people]);

    useEffect(() => {
        if (currentSession) {
            setSessionNameDraft(currentSession.name);
        }
    }, [currentSession?.name]);

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
        <div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4'>
            <div className='max-w-4xl mx-auto'>
                <div className='bg-white rounded-2xl shadow-xl p-6 mb-6'>
                    <div className='flex items-center justify-between mb-6'>
                        <div className='flex items-center gap-3'>
                            <Users className='text-indigo-600' size={32} />
                            <div>
                                <h1 className='text-3xl font-bold text-gray-800'>Калькулятор расходов</h1>
                                {currentSession && (
                                    <p className='text-sm text-gray-600 mt-1'>Сессия: {currentSession.name}</p>
                                )}
                            </div>
                        </div>

                        <SessionControls
                            onOpenManager={() => setShowSessionManager(true)}
                            onSaveSession={handleSaveSession}
                            onNewSession={handleNewSession}
                            onShareSession={handleShareSession}
                        />
                    </div>

                    <ExpenseStats people={people} totalExpenses={totalExpenses} perPersonShare={perPersonShare} />

                    <PeopleTable people={people} updatePerson={updatePerson} removePerson={removePerson} />

                    <PeopleManagerControls
                        people={people}
                        onAddPerson={addPerson}
                        onCalculateDuties={handleCalculateDuties}
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
                            <Dialog.Panel className='w-full max-w-md rounded-2xl bg-white p-6 shadow-xl'>
                                <Dialog.Title className='text-lg font-semibold text-gray-900'>
                                    Сохранить сессию
                                </Dialog.Title>
                                <Dialog.Description className='mt-2 text-sm text-gray-600'>
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
                                        <label htmlFor='session-name' className='text-sm font-medium text-gray-700'>
                                            Название сессии
                                        </label>
                                        <input
                                            id='session-name'
                                            value={sessionNameDraft}
                                            onChange={(event) => setSessionNameDraft(event.target.value)}
                                            className='mt-2 w-full rounded-xl border border-gray-200 px-3 py-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200'
                                            placeholder='Например, Поездка в Казань'
                                            autoFocus
                                        />
                                    </div>

                                    <div className='flex justify-end gap-3 pt-2'>
                                        <button
                                            type='button'
                                            onClick={() => setSaveDialogOpen(false)}
                                            className='rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-50'
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
                            <Dialog.Panel className='w-full max-w-md rounded-2xl bg-white p-6 shadow-xl'>
                                <Dialog.Title className='text-lg font-semibold text-gray-900'>
                                    Поделиться расчетом
                                </Dialog.Title>
                                <Dialog.Description className='mt-2 text-sm text-gray-600'>
                                    Скопируйте ссылку вручную, если автоматическое копирование не сработало.
                                </Dialog.Description>

                                <div className='mt-4 space-y-4'>
                                    <div className='rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm text-gray-700 break-all'>
                                        {shareDialogLink}
                                    </div>
                                    <div className='flex justify-end gap-3'>
                                        <button
                                            type='button'
                                            onClick={closeShareDialog}
                                            className='rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-50'
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

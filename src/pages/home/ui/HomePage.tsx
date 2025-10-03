import { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Users } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { useTranslation } from 'react-i18next';
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
    exportSessionAsCsv,
    exportSessionAsPdf,
} from '~shared/lib';
import { ExpenseStats } from '~widgets/expense-calculator';
import { PeopleManagerControls } from '~widgets/people-manager';
import { ExpenseSummary } from '~widgets/expense-summary';
import { PeopleTable } from '~widgets/people-table';
import { SessionControls } from '~widgets/session-controls';
import { SessionManagerModal } from '~widgets/session-manager';
import { useToast, ConfirmDialog } from '~shared/ui';
import { ThemeToggle } from '~features/toggle-theme';
import { LanguageToggle } from '~features/toggle-language';

export const HomePage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { t } = useTranslation();
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
    const [isQrDialogOpen, setQrDialogOpen] = useState(false);
    const [qrShareLink, setQrShareLink] = useState<string | null>(null);

    const hasInvalidExpenses = useMemo(() => people.some((person) => !isValidExpenseInput(person.expenses)), [people]);

    useEffect(() => {
        const savedSession = storage.loadCurrentSession();
        if (savedSession) {
            setCurrentSession(savedSession);
            setPeople(savedSession.people);
            return;
        }

        const newSession = createSession({
            name: t('currentSession.name'),
            description: t('currentSession.description'),
        });
        setCurrentSession(newSession);
        setPeople(newSession.people);
    }, [t]);

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
            toast.error(t('errors.invalidExpenses'));
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
            toast.error(t('save.nameRequired'));
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
        toast.success(t('save.success'));
        setSaveDialogOpen(false);
    };

    const handleLoadSession = (sessionId: string) => {
        const savedSessions = storage.loadSavedSessions();
        const sessionToLoad = savedSessions.find((s) => s.id === sessionId);

        if (sessionToLoad) {
            setCurrentSession(sessionToLoad);
            setPeople(sessionToLoad.people);
            setShowSessionManager(false);
            toast.success(t('load.success', { name: sessionToLoad.name }));
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
            name: t('newSession.name'),
            description: t('newSession.description'),
            people: [{ id: 1, name: '', expenses: '', duty: 0 }],
        });

        setCurrentSession(newSession);
        setPeople(newSession.people);
        setNewSessionConfirmOpen(false);
        toast.info(t('newSession.created'));
    };

    const cancelNewSession = () => {
        setNewSessionConfirmOpen(false);
    };

    const syncSessionForShare = useCallback(() => {
        if (!currentSession) {
            return null;
        }

        const total = getTotalExpenses(people);
        const updated = updateSession(currentSession, {
            people,
            totalExpenses: total,
            isCalculated: people.some((p) => p.duty !== 0),
        });

        setCurrentSession(updated);
        storage.saveCurrentSession(updated);

        return {
            session: updated,
            shareUrl: createShareUrl(updated),
            total,
            perPersonShare: getPerPersonShare(people),
        };
    }, [currentSession, people]);

    const handleShareSession = async () => {
        const shareContext = syncSessionForShare();
        if (!shareContext) {
            return;
        }

        const { shareUrl, total, perPersonShare } = shareContext;
        const summary = t('share.summary', {
            total: total.toFixed(2),
            perPerson: perPersonShare.toFixed(2),
        });

        if (navigator.share) {
            try {
                await navigator.share({
                    title: shareContext.session.name || t('share.title'),
                    text: summary,
                    url: shareUrl,
                });
                toast.success(t('share.menuSuccess'));
                return;
            } catch (error) {
                console.warn('Web Share API failed, fallback to clipboard.', error);
            }
        }

        try {
            await navigator.clipboard.writeText(shareUrl);
            toast.success(t('share.clipboardSuccess'));
        } catch (error) {
            console.error('Failed to copy share link:', error);
            setShareDialogLink(shareUrl);
            setShareDialogOpen(true);
            toast.error(t('share.clipboardError'));
        }
    };

    const handleShowQrCode = () => {
        const shareContext = syncSessionForShare();
        if (!shareContext) {
            return;
        }

        setQrShareLink(shareContext.shareUrl);
        setQrDialogOpen(true);
    };

    const handleExportCsv = () => {
        const shareContext = syncSessionForShare();
        if (!shareContext) {
            toast.error(t('errors.exportNoPeople'));
            return;
        }

        try {
            exportSessionAsCsv({
                session: shareContext.session,
                people,
                totalExpenses: shareContext.total,
                perPersonShare: shareContext.perPersonShare,
            });
            toast.success(t('success.exportCsv'));
        } catch (error) {
            console.error('Failed to export CSV:', error);
            toast.error(t('errors.exportCsv'));
        }
    };

    const handleExportPdf = () => {
        const shareContext = syncSessionForShare();
        if (!shareContext) {
            toast.error(t('errors.exportNoPeople'));
            return;
        }

        try {
            exportSessionAsPdf({
                session: shareContext.session,
                people,
                totalExpenses: shareContext.total,
                perPersonShare: shareContext.perPersonShare,
            });
            toast.success(t('success.exportPdf'));
        } catch (error) {
            console.error('Failed to export PDF:', error);
            toast.error(t('errors.exportPdf'));
        }
    };

    const closeShareDialog = () => {
        setShareDialogOpen(false);
        setShareDialogLink(null);
    };

    const closeQrDialog = () => {
        setQrDialogOpen(false);
        setQrShareLink(null);
    };

    const handleCopyShareDialogLink = async () => {
        if (!shareDialogLink) return;
        try {
            await navigator.clipboard.writeText(shareDialogLink);
            toast.success(t('share.dialogCopySuccess'));
            closeShareDialog();
        } catch (error) {
            console.error('Failed to copy share link from dialog:', error);
            toast.error(t('share.dialogCopyError'));
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
                        <h1 className='text-2xl font-bold text-gray-800 dark:text-slate-100'>{t('app.title')}</h1>
                        <p className='text-sm text-gray-600 dark:text-slate-400'>{t('app.subtitle')}</p>
                    </div>
                </div>

                <div className='flex w-full flex-col gap-2 md:w-auto md:flex-row'>
                    <LanguageToggle className='w-full justify-center md:w-auto' />
                    <ThemeToggle className='w-full justify-center md:w-auto' />
                </div>
            </header>

            <div className='mx-auto max-w-4xl text-gray-900 transition-colors dark:text-slate-100'>
                <div className='rounded-2xl border border-transparent bg-white p-6 shadow-xl transition-colors dark:border-slate-800 dark:bg-slate-900'>
                    <div className='mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
                        {currentSession && (
                            <div className='flex items-start justify-between gap-3 rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm text-gray-600 transition-colors dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-300 md:flex-1'>
                                <div>
                                    <p className='font-medium text-gray-800 dark:text-slate-100'>
                                        {t('app.currentSession')}
                                    </p>
                                    <p className='text-sm'>{currentSession.name}</p>
                                </div>
                                <span className='rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-200'>
                                    {t('app.autoSaveBadge')}
                                </span>
                            </div>
                        )}

                        <div className='flex items-center justify-end gap-2 text-sm self-stretch md:self-auto'>
                            <SessionControls
                                onOpenManager={() => setShowSessionManager(true)}
                                onSaveSession={handleSaveSession}
                                onNewSession={handleNewSession}
                                onShareSession={handleShareSession}
                                onShowShareQr={handleShowQrCode}
                                onExportCsv={handleExportCsv}
                                onExportPdf={handleExportPdf}
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
                                    {t('dialogs.saveSession.title')}
                                </Dialog.Title>
                                <Dialog.Description className='mt-2 text-sm text-gray-600 dark:text-slate-400'>
                                    {t('dialogs.saveSession.description')}
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
                                            {t('dialogs.saveSession.nameLabel')}
                                        </label>
                                        <input
                                            id='session-name'
                                            value={sessionNameDraft}
                                            onChange={(event) => setSessionNameDraft(event.target.value)}
                                            className='mt-2 w-full rounded-xl border border-gray-200 px-3 py-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100'
                                            placeholder={t('dialogs.saveSession.namePlaceholder')}
                                            autoFocus
                                        />
                                    </div>

                                    <div className='flex justify-end gap-3 pt-2'>
                                        <button
                                            type='button'
                                            onClick={() => setSaveDialogOpen(false)}
                                            className='rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800'
                                        >
                                            {t('common.cancel')}
                                        </button>
                                        <button
                                            type='submit'
                                            className='rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700'
                                        >
                                            {t('common.save')}
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
                title={t('dialogs.newSession.title')}
                description={t('dialogs.newSession.description')}
                confirmText={t('dialogs.newSession.confirm')}
                cancelText={t('common.cancel')}
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
                                    {t('dialogs.share.title')}
                                </Dialog.Title>
                                <Dialog.Description className='mt-2 text-sm text-gray-600 dark:text-slate-400'>
                                    {t('dialogs.share.description')}
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
                                            {t('common.close')}
                                        </button>
                                        <button
                                            type='button'
                                            onClick={handleCopyShareDialogLink}
                                            className='inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700'
                                        >
                                            {t('dialogs.share.copy')}
                                        </button>
                                    </div>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </Dialog>
            </Transition>

            <Transition show={isQrDialogOpen} as={Fragment} appear>
                <Dialog as='div' className='relative z-50' onClose={closeQrDialog}>
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
                            <Dialog.Panel className='w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl transition-colors dark:border dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100'>
                                <Dialog.Title className='text-lg font-semibold text-gray-900 dark:text-slate-100'>
                                    {t('dialogs.qr.title')}
                                </Dialog.Title>
                                <Dialog.Description className='mt-2 text-sm text-gray-600 dark:text-slate-400'>
                                    {t('dialogs.qr.description')}
                                </Dialog.Description>

                                <div className='mt-6 flex justify-center'>
                                    {qrShareLink ? (
                                        <div className='rounded-2xl border border-gray-200 bg-white p-4 shadow-inner dark:border-slate-700 dark:bg-slate-800'>
                                            <QRCodeSVG value={qrShareLink} size={224} includeMargin />
                                        </div>
                                    ) : (
                                        <p className='text-sm text-gray-500 dark:text-slate-400'>
                                            {t('dialogs.qr.generateError')}
                                        </p>
                                    )}
                                </div>

                                <div className='mt-6 flex justify-between items-center gap-3'>
                                    <div className='text-xs text-gray-500 break-all dark:text-slate-500'>
                                        {qrShareLink}
                                    </div>
                                    <button
                                        type='button'
                                        onClick={() => {
                                            if (!qrShareLink) return;
                                            void navigator.clipboard
                                                .writeText(qrShareLink)
                                                .then(() => toast.success(t('share.qrCopySuccess')))
                                                .catch((error) => {
                                                    console.error('Failed to copy QR link:', error);
                                                    toast.error(t('share.qrCopyError'));
                                                });
                                        }}
                                        className='rounded-xl border border-gray-200 px-3 py-2 text-xs font-medium text-gray-600 transition hover:bg-gray-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800'
                                    >
                                        {t('dialogs.qr.copy')}
                                    </button>
                                </div>

                                <div className='mt-6 flex justify-end'>
                                    <button
                                        type='button'
                                        onClick={closeQrDialog}
                                        className='rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700'
                                    >
                                        {t('common.close')}
                                    </button>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </Dialog>
            </Transition>
        </div>
    );
};

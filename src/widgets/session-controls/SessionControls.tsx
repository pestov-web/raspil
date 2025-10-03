import { Fragment, useState } from 'react';
import { Dialog, Popover, Transition } from '@headlessui/react';
import {
    Menu,
    Settings2,
    Save,
    PlusCircle,
    X,
    Share2,
    QrCode,
    FileDown,
    FileSpreadsheet,
    ChevronDown,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface SessionControlsProps {
    onOpenManager: () => void;
    onSaveSession: () => void;
    onNewSession: () => void;
    onShareSession: () => void | Promise<void>;
    onShowShareQr: () => void;
    onExportCsv: () => void;
    onExportPdf: () => void;
}

export const SessionControls = ({
    onOpenManager,
    onSaveSession,
    onNewSession,
    onShareSession,
    onShowShareQr,
    onExportCsv,
    onExportPdf,
}: SessionControlsProps) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { t } = useTranslation();

    const runAction = async (action: () => void | Promise<void>, onComplete?: () => void) => {
        try {
            await action();
        } finally {
            onComplete?.();
        }
    };

    return (
        <div className='flex items-center gap-2'>
            <div className='hidden md:flex items-center gap-2'>
                <Popover className='relative'>
                    {({ close }) => (
                        <>
                            <Popover.Button className='flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600'>
                                {t('actions.sessionMenu')}
                                <ChevronDown size={16} className='opacity-80' />
                            </Popover.Button>
                            <Transition
                                as={Fragment}
                                enter='transition duration-150 ease-out'
                                enterFrom='opacity-0 translate-y-1'
                                enterTo='opacity-100 translate-y-0'
                                leave='transition duration-100 ease-in'
                                leaveFrom='opacity-100 translate-y-0'
                                leaveTo='opacity-0 translate-y-1'
                            >
                                <Popover.Panel className='absolute right-0 z-30 mt-2 w-56 rounded-xl border border-purple-200 bg-white p-2 shadow-xl dark:border-purple-900/40 dark:bg-slate-900'>
                                    <button
                                        onClick={() => runAction(onOpenManager, close)}
                                        className='flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm text-purple-700 transition hover:bg-purple-50 dark:text-purple-200 dark:hover:bg-purple-900/40'
                                    >
                                        <Settings2 size={16} />
                                        {t('actions.manageSessions')}
                                    </button>
                                    <button
                                        onClick={() => runAction(onSaveSession, close)}
                                        className='flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm text-blue-700 transition hover:bg-blue-50 dark:text-blue-200 dark:hover:bg-blue-900/40'
                                    >
                                        <Save size={16} />
                                        {t('actions.saveSession')}
                                    </button>
                                    <button
                                        onClick={() => runAction(onNewSession, close)}
                                        className='flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm text-green-700 transition hover:bg-green-50 dark:text-emerald-200 dark:hover:bg-emerald-900/40'
                                    >
                                        <PlusCircle size={16} />
                                        {t('actions.newSession')}
                                    </button>
                                </Popover.Panel>
                            </Transition>
                        </>
                    )}
                </Popover>

                <Popover className='relative'>
                    {({ close }) => (
                        <>
                            <Popover.Button className='flex items-center gap-2 rounded-lg bg-slate-800 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-900 dark:bg-slate-700 dark:hover:bg-slate-600'>
                                {t('actions.exportMenu')}
                                <ChevronDown size={16} className='opacity-80' />
                            </Popover.Button>
                            <Transition
                                as={Fragment}
                                enter='transition duration-150 ease-out'
                                enterFrom='opacity-0 translate-y-1'
                                enterTo='opacity-100 translate-y-0'
                                leave='transition duration-100 ease-in'
                                leaveFrom='opacity-100 translate-y-0'
                                leaveTo='opacity-0 translate-y-1'
                            >
                                <Popover.Panel className='absolute right-0 z-30 mt-2 w-64 rounded-xl border border-slate-200 bg-white p-2 shadow-xl dark:border-slate-700 dark:bg-slate-900'>
                                    <button
                                        onClick={() => runAction(onShareSession, close)}
                                        className='flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm text-amber-700 transition hover:bg-amber-50 dark:text-amber-200 dark:hover:bg-amber-900/40'
                                    >
                                        <Share2 size={16} />
                                        {t('actions.shareLink')}
                                    </button>
                                    <button
                                        onClick={() => runAction(onShowShareQr, close)}
                                        className='flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm text-indigo-700 transition hover:bg-indigo-50 dark:text-indigo-200 dark:hover:bg-indigo-900/40'
                                    >
                                        <QrCode size={16} />
                                        {t('actions.showQr')}
                                    </button>
                                    <div className='my-1 h-px bg-slate-200 dark:bg-slate-700' />
                                    <button
                                        onClick={() => runAction(onExportPdf, close)}
                                        className='flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800/40'
                                    >
                                        <FileDown size={16} />
                                        {t('actions.exportPdf')}
                                    </button>
                                    <button
                                        onClick={() => runAction(onExportCsv, close)}
                                        className='flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800/40'
                                    >
                                        <FileSpreadsheet size={16} />
                                        {t('actions.exportCsv')}
                                    </button>
                                </Popover.Panel>
                            </Transition>
                        </>
                    )}
                </Popover>
            </div>

            <div className='md:hidden'>
                <button
                    onClick={() => setIsMobileMenuOpen(true)}
                    className='p-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors dark:bg-indigo-500 dark:hover:bg-indigo-600'
                    aria-label={t('actions.openMenu')}
                >
                    <Menu size={20} />
                </button>
            </div>

            <Transition show={isMobileMenuOpen} as={Fragment}>
                <Dialog as='div' className='relative z-50 md:hidden' onClose={setIsMobileMenuOpen}>
                    <Transition.Child
                        as={Fragment}
                        enter='transition-opacity duration-150'
                        enterFrom='opacity-0'
                        enterTo='opacity-100'
                        leave='transition-opacity duration-150'
                        leaveFrom='opacity-100'
                        leaveTo='opacity-0'
                    >
                        <div className='fixed inset-0 bg-black/40 dark:bg-black/60' aria-hidden='true' />
                    </Transition.Child>

                    <div className='fixed inset-0 flex items-end justify-center p-4'>
                        <Transition.Child
                            as={Fragment}
                            enter='transform transition duration-200'
                            enterFrom='translate-y-full'
                            enterTo='translate-y-0'
                            leave='transform transition duration-200'
                            leaveFrom='translate-y-0'
                            leaveTo='translate-y-full'
                        >
                            <Dialog.Panel className='w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl transition-colors dark:bg-slate-900 dark:text-slate-100'>
                                <div className='flex items-center justify-between mb-4'>
                                    <Dialog.Title className='text-lg font-semibold text-gray-800 dark:text-slate-100'>
                                        {t('actions.menuTitle')}
                                    </Dialog.Title>
                                    <button
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className='rounded-full p-2 text-gray-500 transition-colors hover:bg-gray-100 dark:text-slate-400 dark:hover:bg-slate-800'
                                        aria-label={t('actions.closeMenu')}
                                    >
                                        <X size={18} />
                                    </button>
                                </div>

                                <div className='grid gap-3'>
                                    <button
                                        onClick={() => runAction(onOpenManager, () => setIsMobileMenuOpen(false))}
                                        className='flex w-full items-center gap-3 rounded-xl bg-purple-50 px-4 py-3 text-purple-700 transition-colors hover:bg-purple-100 dark:bg-purple-900/30 dark:text-purple-200 dark:hover:bg-purple-900/50'
                                    >
                                        <Settings2 size={18} />
                                        {t('actions.manageSessions')}
                                    </button>
                                    <button
                                        onClick={() => runAction(onSaveSession, () => setIsMobileMenuOpen(false))}
                                        className='flex w-full items-center gap-3 rounded-xl bg-blue-50 px-4 py-3 text-blue-700 transition-colors hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-200 dark:hover:bg-blue-900/50'
                                    >
                                        <Save size={18} />
                                        {t('actions.saveSession')}
                                    </button>
                                    <button
                                        onClick={() => runAction(onNewSession, () => setIsMobileMenuOpen(false))}
                                        className='flex w-full items-center gap-3 rounded-xl bg-green-50 px-4 py-3 text-green-700 transition-colors hover:bg-green-100 dark:bg-emerald-900/30 dark:text-emerald-200 dark:hover:bg-emerald-900/50'
                                    >
                                        <PlusCircle size={18} />
                                        {t('actions.newSession')}
                                    </button>
                                    <button
                                        onClick={() => runAction(onShareSession, () => setIsMobileMenuOpen(false))}
                                        className='flex w-full items-center gap-3 rounded-xl bg-amber-50 px-4 py-3 text-amber-700 transition-colors hover:bg-amber-100 dark:bg-amber-900/30 dark:text-amber-200 dark:hover:bg-amber-900/50'
                                    >
                                        <Share2 size={18} />
                                        {t('actions.shareLink')}
                                    </button>
                                    <button
                                        onClick={() => runAction(onShowShareQr, () => setIsMobileMenuOpen(false))}
                                        className='flex w-full items-center gap-3 rounded-xl bg-indigo-50 px-4 py-3 text-indigo-700 transition-colors hover:bg-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-200 dark:hover:bg-indigo-900/50'
                                    >
                                        <QrCode size={18} />
                                        {t('actions.showQrShort')}
                                    </button>
                                    <button
                                        onClick={() => runAction(onExportPdf, () => setIsMobileMenuOpen(false))}
                                        className='flex w-full items-center gap-3 rounded-xl bg-slate-100 px-4 py-3 text-slate-700 transition-colors hover:bg-slate-200 dark:bg-slate-800/40 dark:text-slate-200 dark:hover:bg-slate-800/60'
                                    >
                                        <FileDown size={18} />
                                        {t('actions.exportPdf')}
                                    </button>
                                    <button
                                        onClick={() => runAction(onExportCsv, () => setIsMobileMenuOpen(false))}
                                        className='flex w-full items-center gap-3 rounded-xl bg-slate-50 px-4 py-3 text-slate-700 transition-colors hover:bg-slate-100 dark:bg-slate-800/30 dark:text-slate-200 dark:hover:bg-slate-800/50'
                                    >
                                        <FileSpreadsheet size={18} />
                                        {t('actions.exportCsv')}
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

import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Menu, Settings2, Save, PlusCircle, X, Share2 } from 'lucide-react';

interface SessionControlsProps {
    onOpenManager: () => void;
    onSaveSession: () => void;
    onNewSession: () => void;
    onShareSession: () => void | Promise<void>;
}

export const SessionControls = ({
    onOpenManager,
    onSaveSession,
    onNewSession,
    onShareSession,
}: SessionControlsProps) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleAction = async (action: () => void | Promise<void>) => {
        try {
            await action();
        } finally {
            setIsMobileMenuOpen(false);
        }
    };

    return (
        <div className='flex items-center gap-2'>
            <div className='hidden md:flex items-center gap-2'>
                <button
                    onClick={() => handleAction(onOpenManager)}
                    className='px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm dark:bg-purple-500 dark:hover:bg-purple-600'
                >
                    Управление
                </button>
                <button
                    onClick={() => handleAction(onSaveSession)}
                    className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm dark:bg-blue-500 dark:hover:bg-blue-600'
                >
                    Сохранить
                </button>
                <button
                    onClick={() => handleAction(onNewSession)}
                    className='px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm dark:bg-emerald-500 dark:hover:bg-emerald-600'
                >
                    Новая
                </button>
                <button
                    onClick={() => handleAction(onShareSession)}
                    className='px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors text-sm dark:bg-amber-400 dark:text-slate-900 dark:hover:bg-amber-500'
                >
                    Поделиться
                </button>
            </div>

            <div className='md:hidden'>
                <button
                    onClick={() => setIsMobileMenuOpen(true)}
                    className='p-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors dark:bg-indigo-500 dark:hover:bg-indigo-600'
                    aria-label='Меню действий'
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
                                        Действия
                                    </Dialog.Title>
                                    <button
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className='rounded-full p-2 text-gray-500 transition-colors hover:bg-gray-100 dark:text-slate-400 dark:hover:bg-slate-800'
                                        aria-label='Закрыть меню'
                                    >
                                        <X size={18} />
                                    </button>
                                </div>

                                <div className='grid gap-3'>
                                    <button
                                        onClick={() => handleAction(onOpenManager)}
                                        className='flex w-full items-center gap-3 rounded-xl bg-purple-50 px-4 py-3 text-purple-700 transition-colors hover:bg-purple-100 dark:bg-purple-900/30 dark:text-purple-200 dark:hover:bg-purple-900/50'
                                    >
                                        <Settings2 size={18} />
                                        Управление сессиями
                                    </button>
                                    <button
                                        onClick={() => handleAction(onSaveSession)}
                                        className='flex w-full items-center gap-3 rounded-xl bg-blue-50 px-4 py-3 text-blue-700 transition-colors hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-200 dark:hover:bg-blue-900/50'
                                    >
                                        <Save size={18} />
                                        Сохранить сессию
                                    </button>
                                    <button
                                        onClick={() => handleAction(onNewSession)}
                                        className='flex w-full items-center gap-3 rounded-xl bg-green-50 px-4 py-3 text-green-700 transition-colors hover:bg-green-100 dark:bg-emerald-900/30 dark:text-emerald-200 dark:hover:bg-emerald-900/50'
                                    >
                                        <PlusCircle size={18} />
                                        Новая сессия
                                    </button>
                                    <button
                                        onClick={() => handleAction(onShareSession)}
                                        className='flex w-full items-center gap-3 rounded-xl bg-amber-50 px-4 py-3 text-amber-700 transition-colors hover:bg-amber-100 dark:bg-amber-900/30 dark:text-amber-200 dark:hover:bg-amber-900/50'
                                    >
                                        <Share2 size={18} />
                                        Поделиться ссылкой
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

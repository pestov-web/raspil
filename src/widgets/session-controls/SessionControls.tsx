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
                    className='px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm'
                >
                    Управление
                </button>
                <button
                    onClick={() => handleAction(onSaveSession)}
                    className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm'
                >
                    Сохранить
                </button>
                <button
                    onClick={() => handleAction(onNewSession)}
                    className='px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm'
                >
                    Новая
                </button>
                <button
                    onClick={() => handleAction(onShareSession)}
                    className='px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors text-sm'
                >
                    Поделиться
                </button>
            </div>

            <div className='md:hidden'>
                <button
                    onClick={() => setIsMobileMenuOpen(true)}
                    className='p-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors'
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
                        <div className='fixed inset-0 bg-black/40' aria-hidden='true' />
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
                            <Dialog.Panel className='w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl'>
                                <div className='flex items-center justify-between mb-4'>
                                    <Dialog.Title className='text-lg font-semibold text-gray-800'>
                                        Действия
                                    </Dialog.Title>
                                    <button
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className='p-2 rounded-full text-gray-500 hover:bg-gray-100 transition-colors'
                                        aria-label='Закрыть меню'
                                    >
                                        <X size={18} />
                                    </button>
                                </div>

                                <div className='grid gap-3'>
                                    <button
                                        onClick={() => handleAction(onOpenManager)}
                                        className='flex items-center gap-3 w-full px-4 py-3 rounded-xl bg-purple-50 text-purple-700 hover:bg-purple-100 transition-colors'
                                    >
                                        <Settings2 size={18} />
                                        Управление сессиями
                                    </button>
                                    <button
                                        onClick={() => handleAction(onSaveSession)}
                                        className='flex items-center gap-3 w-full px-4 py-3 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors'
                                    >
                                        <Save size={18} />
                                        Сохранить сессию
                                    </button>
                                    <button
                                        onClick={() => handleAction(onNewSession)}
                                        className='flex items-center gap-3 w-full px-4 py-3 rounded-xl bg-green-50 text-green-700 hover:bg-green-100 transition-colors'
                                    >
                                        <PlusCircle size={18} />
                                        Новая сессия
                                    </button>
                                    <button
                                        onClick={() => handleAction(onShareSession)}
                                        className='flex items-center gap-3 w-full px-4 py-3 rounded-xl bg-amber-50 text-amber-700 hover:bg-amber-100 transition-colors'
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

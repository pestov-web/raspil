import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';

interface ConfirmDialogProps {
    open: boolean;
    title: string;
    description?: string;
    confirmText?: string;
    cancelText?: string;
    tone?: 'default' | 'danger';
    onConfirm: () => void;
    onClose: () => void;
}

export const ConfirmDialog = ({
    open,
    title,
    description,
    confirmText = 'Подтвердить',
    cancelText = 'Отмена',
    tone = 'default',
    onConfirm,
    onClose,
}: ConfirmDialogProps) => {
    const confirmClasses =
        tone === 'danger'
            ? 'bg-red-600 hover:bg-red-700 focus-visible:ring-red-500 dark:bg-red-500 dark:hover:bg-red-600 dark:focus-visible:ring-red-400'
            : 'bg-indigo-600 hover:bg-indigo-700 focus-visible:ring-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-600 dark:focus-visible:ring-indigo-400';

    return (
        <Transition show={open} as={Fragment} appear>
            <Dialog as='div' className='relative z-[60]' onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter='ease-out duration-150'
                    enterFrom='opacity-0'
                    enterTo='opacity-100'
                    leave='ease-in duration-100'
                    leaveFrom='opacity-100'
                    leaveTo='opacity-0'
                >
                    <div className='fixed inset-0 bg-black/30 dark:bg-black/60' />
                </Transition.Child>

                <div className='fixed inset-0 overflow-y-auto'>
                    <div className='flex min-h-full items-center justify-center p-4 text-center'>
                        <Transition.Child
                            as={Fragment}
                            enter='ease-out duration-150'
                            enterFrom='opacity-0 translate-y-1 scale-95'
                            enterTo='opacity-100 translate-y-0 scale-100'
                            leave='ease-in duration-100'
                            leaveFrom='opacity-100 translate-y-0 scale-100'
                            leaveTo='opacity-0 translate-y-1 scale-95'
                        >
                            <Dialog.Panel className='w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all dark:bg-slate-900 dark:text-slate-100'>
                                <Dialog.Title
                                    as='h3'
                                    className='text-lg font-semibold leading-6 text-gray-900 dark:text-slate-100'
                                >
                                    {title}
                                </Dialog.Title>
                                {description && (
                                    <p className='mt-2 text-sm text-gray-600 dark:text-slate-300'>{description}</p>
                                )}

                                <div className='mt-6 flex justify-end gap-3'>
                                    <button
                                        type='button'
                                        onClick={onClose}
                                        className='inline-flex justify-center rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800 dark:focus-visible:ring-indigo-400 dark:focus-visible:ring-offset-slate-900'
                                    >
                                        {cancelText}
                                    </button>
                                    <button
                                        type='button'
                                        onClick={onConfirm}
                                        className={`inline-flex justify-center rounded-lg px-4 py-2 text-sm font-semibold text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900 ${confirmClasses}`}
                                    >
                                        {confirmText}
                                    </button>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
};

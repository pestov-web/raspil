import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { Transition } from '@headlessui/react';
import { CheckCircle2, Info, XCircle } from 'lucide-react';
import type { ReactNode } from 'react';

export type ToastVariant = 'success' | 'error' | 'info';

export interface ToastOptions {
    title?: string;
    description: string;
    variant?: ToastVariant;
    duration?: number;
}

interface ToastDetails extends ToastOptions {
    id: number;
}

interface ToastContextValue {
    addToast: (toast: ToastOptions) => void;
    removeToast: (id: number) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

const getVariantStyles = (variant: ToastVariant = 'info') => {
    switch (variant) {
        case 'success':
            return {
                icon: <CheckCircle2 className='text-emerald-600' size={20} />,
                border: 'border-emerald-500',
            };
        case 'error':
            return {
                icon: <XCircle className='text-rose-600' size={20} />,
                border: 'border-rose-500',
            };
        default:
            return {
                icon: <Info className='text-indigo-600' size={20} />,
                border: 'border-indigo-500',
            };
    }
};

interface ToastProviderProps {
    children: ReactNode;
}

export const ToastProvider = ({ children }: ToastProviderProps) => {
    const [toasts, setToasts] = useState<ToastDetails[]>([]);

    const removeToast = useCallback((id: number) => {
        setToasts((current) => current.filter((toast) => toast.id !== id));
    }, []);

    const addToast = useCallback(
        ({ duration = 4000, ...toast }: ToastOptions) => {
            setToasts((current) => {
                const id = Date.now() + Math.floor(Math.random() * 1000);
                const next: ToastDetails = { id, ...toast };
                window.setTimeout(() => removeToast(id), duration);
                return [...current, next];
            });
        },
        [removeToast]
    );

    const value = useMemo(() => ({ addToast, removeToast }), [addToast, removeToast]);

    return (
        <ToastContext.Provider value={value}>
            {children}
            <div className='pointer-events-none fixed top-4 right-4 z-[70] flex flex-col gap-3'>
                {toasts.map((toast) => {
                    const { icon, border } = getVariantStyles(toast.variant);
                    return (
                        <Transition
                            key={toast.id}
                            appear
                            show
                            enter='transform transition duration-200'
                            enterFrom='translate-y-2 opacity-0 scale-95'
                            enterTo='translate-y-0 opacity-100 scale-100'
                            leave='transform transition duration-150'
                            leaveFrom='translate-y-0 opacity-100 scale-100'
                            leaveTo='translate-y-1 opacity-0 scale-95'
                        >
                            <div
                                className={`pointer-events-auto flex w-80 items-start gap-3 rounded-xl border-l-4 ${border} bg-white p-4 shadow-xl`}
                            >
                                <div className='mt-0.5'>{icon}</div>
                                <div className='flex-1'>
                                    {toast.title && (
                                        <p className='text-sm font-semibold text-gray-900'>{toast.title}</p>
                                    )}
                                    <p className='text-sm text-gray-700'>{toast.description}</p>
                                </div>
                            </div>
                        </Transition>
                    );
                })}
            </div>
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }

    const { addToast } = context;

    return {
        show: addToast,
        success: (description: string, options?: Omit<ToastOptions, 'description' | 'variant'>) =>
            addToast({ description, variant: 'success', ...options }),
        error: (description: string, options?: Omit<ToastOptions, 'description' | 'variant'>) =>
            addToast({ description, variant: 'error', ...options }),
        info: (description: string, options?: Omit<ToastOptions, 'description' | 'variant'>) =>
            addToast({ description, variant: 'info', ...options }),
    };
};

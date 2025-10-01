import { createContext, useContext } from 'react';

export type ToastVariant = 'success' | 'error' | 'info';

export interface ToastOptions {
    title?: string;
    description: string;
    variant?: ToastVariant;
    duration?: number;
}

export interface ToastContextValue {
    addToast: (toast: ToastOptions) => void;
    removeToast: (id: number) => void;
}

export const ToastContext = createContext<ToastContextValue | undefined>(undefined);

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

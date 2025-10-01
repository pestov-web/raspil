import React, { useState, useEffect } from 'react';
import { X, Trash2, Download, Upload, Calendar, Users, DollarSign } from 'lucide-react';
import type { SessionMetadata } from '~entities/session';
import { formatSessionDate } from '~entities/session';
import { storage } from '~shared/lib/storage';
import { useToast, ConfirmDialog } from '~shared/ui';

interface SessionManagerModalProps {
    isOpen: boolean;
    onClose: () => void;
    onLoadSession: (sessionId: string) => void;
    onDeleteSession: (sessionId: string) => void;
}

export const SessionManagerModal: React.FC<SessionManagerModalProps> = ({
    isOpen,
    onClose,
    onLoadSession,
    onDeleteSession,
}) => {
    const [sessions, setSessions] = useState<SessionMetadata[]>([]);
    const [loading, setLoading] = useState(false);
    const [pendingDelete, setPendingDelete] = useState<SessionMetadata | null>(null);
    const toast = useToast();

    useEffect(() => {
        if (isOpen) {
            loadSessions();
        }
    }, [isOpen]);

    const loadSessions = () => {
        setLoading(true);
        try {
            const metadata = storage.getSavedSessionsMetadata();
            setSessions(metadata);
        } catch (error) {
            console.error('Failed to load sessions:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleExportAll = () => {
        try {
            const exportData = storage.exportAllData();
            const blob = new Blob([JSON.stringify(exportData, null, 2)], {
                type: 'application/json',
            });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `raspil-backup-${new Date().toISOString().split('T')[0]}.json`;
            a.click();
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Export failed:', error);
        }
    };

    const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const importData = JSON.parse(e.target?.result as string);
                const result = storage.importData(importData);

                if (result.success) {
                    toast.success(`Импортировано ${result.imported} сессий`);
                    loadSessions();
                } else {
                    toast.error(`Ошибка импорта: ${result.errors.join(', ')}`);
                }
            } catch (error) {
                toast.error('Не удалось прочитать файл. Проверьте формат и попробуйте снова.');
                console.error('Import failed:', error);
            }
        };
        reader.readAsText(file);
        // Очищаем input для возможности повторного выбора того же файла
        event.target.value = '';
    };

    const requestDelete = (session: SessionMetadata) => {
        setPendingDelete(session);
    };

    const confirmDelete = () => {
        if (!pendingDelete) return;

        onDeleteSession(pendingDelete.id);
        setSessions((prev) => prev.filter((s) => s.id !== pendingDelete.id));
        toast.success(`Сессия "${pendingDelete.name}" удалена`);
        setPendingDelete(null);
    };

    const cancelDelete = () => {
        setPendingDelete(null);
    };

    if (!isOpen) return null;

    return (
        <>
            <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm dark:bg-black/60'>
                <div className='max-h-[80vh] w-full max-w-4xl overflow-hidden rounded-2xl border border-transparent bg-white shadow-xl transition-colors dark:border-slate-800 dark:bg-slate-900'>
                    {/* Header */}
                    <div className='flex items-center justify-between border-b border-gray-200 p-6 dark:border-slate-800'>
                        <h2 className='text-2xl font-bold text-gray-800 dark:text-slate-100'>Управление сессиями</h2>
                        <button
                            onClick={onClose}
                            className='rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 dark:text-slate-400 dark:hover:bg-slate-800'
                        >
                            <X size={24} />
                        </button>
                    </div>

                    {/* Actions Bar */}
                    <div className='flex items-center gap-4 border-b border-gray-200 bg-gray-50 p-4 dark:border-slate-800 dark:bg-slate-800/40'>
                        <button
                            onClick={handleExportAll}
                            className='flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-white transition-colors hover:bg-green-700'
                        >
                            <Download size={18} />
                            Экспорт всех
                        </button>

                        <label className='flex cursor-pointer items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700'>
                            <Upload size={18} />
                            Импорт
                            <input type='file' accept='.json' onChange={handleImport} className='hidden' />
                        </label>

                        <div className='ml-auto text-sm text-gray-600 dark:text-slate-300'>
                            Сессий: {sessions.length}
                        </div>
                    </div>

                    {/* Sessions List */}
                    <div className='max-h-96 overflow-y-auto p-6'>
                        {loading ? (
                            <div className='py-8 text-center'>
                                <div className='text-gray-500 dark:text-slate-400'>Загрузка сессий...</div>
                            </div>
                        ) : sessions.length === 0 ? (
                            <div className='py-8 text-center'>
                                <div className='mb-4 text-gray-500 dark:text-slate-400'>Нет сохраненных сессий</div>
                                <div className='text-sm text-gray-400 dark:text-slate-500'>
                                    Создайте расчет и сохраните его как сессию
                                </div>
                            </div>
                        ) : (
                            <div className='grid gap-4'>
                                {sessions.map((session, index) => (
                                    <div
                                        key={session.id}
                                        className='rounded-xl border border-gray-100 bg-gray-50 p-4 transition hover:bg-gray-100 dark:border-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 animate-fade-in-up'
                                        style={{ animationDelay: `${index * 60}ms` }}
                                    >
                                        <div className='flex items-center justify-between'>
                                            <div className='flex-1'>
                                                <h3 className='mb-1 text-lg font-semibold text-gray-800 dark:text-slate-100'>
                                                    {session.name}
                                                </h3>
                                                {session.description && (
                                                    <p className='mb-2 text-sm text-gray-600 dark:text-slate-400'>
                                                        {session.description}
                                                    </p>
                                                )}

                                                <div className='flex items-center gap-4 text-sm text-gray-500 dark:text-slate-400'>
                                                    <div className='flex items-center gap-1'>
                                                        <Calendar size={14} />
                                                        {formatSessionDate(session.updatedAt)}
                                                    </div>
                                                    <div className='flex items-center gap-1'>
                                                        <Users size={14} />
                                                        {session.peopleCount} чел.
                                                    </div>
                                                    <div className='flex items-center gap-1'>
                                                        <DollarSign size={14} />
                                                        {session.totalExpenses.toFixed(2)} ₽
                                                    </div>
                                                </div>
                                            </div>

                                            <div className='flex items-center gap-2'>
                                                <button
                                                    onClick={() => onLoadSession(session.id)}
                                                    className='rounded-lg bg-indigo-600 px-4 py-2 text-white transition-colors hover:bg-indigo-700'
                                                >
                                                    Загрузить
                                                </button>
                                                <button
                                                    onClick={() => requestDelete(session)}
                                                    className='rounded-lg p-2 text-red-500 transition-colors hover:bg-red-100 dark:text-rose-300 dark:hover:bg-rose-900/30'
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <ConfirmDialog
                open={Boolean(pendingDelete)}
                onClose={cancelDelete}
                onConfirm={confirmDelete}
                title={pendingDelete ? `Удалить сессию "${pendingDelete.name}"?` : 'Удалить сессию?'}
                description='Это действие нельзя отменить.'
                confirmText='Удалить'
                tone='danger'
            />
        </>
    );
};

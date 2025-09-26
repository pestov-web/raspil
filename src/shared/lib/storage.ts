import type { Session, SessionMetadata, SessionExport } from '~entities/session';

const STORAGE_KEYS = {
    CURRENT_SESSION: 'raspil_current_session',
    SAVED_SESSIONS: 'raspil_saved_sessions',
    APP_SETTINGS: 'raspil_app_settings',
} as const;

/**
 * LocalStorage утилиты для безопасной работы с данными
 */
export const storage = {
    /**
     * Сохраняет текущую сессию (автосохранение)
     */
    saveCurrentSession: (session: Session): void => {
        try {
            localStorage.setItem(STORAGE_KEYS.CURRENT_SESSION, JSON.stringify(session));
        } catch (error) {
            console.warn('Failed to save current session:', error);
        }
    },

    /**
     * Загружает текущую сессию
     */
    loadCurrentSession: (): Session | null => {
        try {
            const data = localStorage.getItem(STORAGE_KEYS.CURRENT_SESSION);
            if (!data) return null;

            const session = JSON.parse(data);
            // Конвертируем строки дат обратно в Date объекты
            session.createdAt = new Date(session.createdAt);
            session.updatedAt = new Date(session.updatedAt);

            return session;
        } catch (error) {
            console.warn('Failed to load current session:', error);
            return null;
        }
    },

    /**
     * Очищает текущую сессию
     */
    clearCurrentSession: (): void => {
        try {
            localStorage.removeItem(STORAGE_KEYS.CURRENT_SESSION);
        } catch (error) {
            console.warn('Failed to clear current session:', error);
        }
    },

    /**
     * Сохраняет именованную сессию
     */
    saveNamedSession: (session: Session): void => {
        try {
            const savedSessions = storage.loadSavedSessions();
            const existingIndex = savedSessions.findIndex((s) => s.id === session.id);

            if (existingIndex >= 0) {
                savedSessions[existingIndex] = session;
            } else {
                savedSessions.push(session);
            }

            localStorage.setItem(STORAGE_KEYS.SAVED_SESSIONS, JSON.stringify(savedSessions));
        } catch (error) {
            console.warn('Failed to save named session:', error);
        }
    },

    /**
     * Загружает все сохраненные сессии
     */
    loadSavedSessions: (): Session[] => {
        try {
            const data = localStorage.getItem(STORAGE_KEYS.SAVED_SESSIONS);
            if (!data) return [];

            const sessions: Session[] = JSON.parse(data);
            // Конвертируем строки дат обратно в Date объекты
            return sessions.map((session) => ({
                ...session,
                createdAt: new Date(session.createdAt),
                updatedAt: new Date(session.updatedAt),
            }));
        } catch (error) {
            console.warn('Failed to load saved sessions:', error);
            return [];
        }
    },

    /**
     * Получает метаданные сохраненных сессий (для списка)
     */
    getSavedSessionsMetadata: (): SessionMetadata[] => {
        const sessions = storage.loadSavedSessions();
        return sessions.map((session) => ({
            id: session.id,
            name: session.name,
            description: session.description,
            createdAt: session.createdAt,
            updatedAt: session.updatedAt,
            totalExpenses: session.totalExpenses,
            peopleCount: session.people.length,
        }));
    },

    /**
     * Удаляет сохраненную сессию
     */
    deleteNamedSession: (sessionId: string): void => {
        try {
            const savedSessions = storage.loadSavedSessions();
            const filtered = savedSessions.filter((s) => s.id !== sessionId);
            localStorage.setItem(STORAGE_KEYS.SAVED_SESSIONS, JSON.stringify(filtered));
        } catch (error) {
            console.warn('Failed to delete named session:', error);
        }
    },

    /**
     * Экспортирует все данные
     */
    exportAllData: (): SessionExport => {
        const sessions = storage.loadSavedSessions();
        const currentSession = storage.loadCurrentSession();

        return {
            version: '1.0.0',
            exportedAt: new Date(),
            sessions: currentSession ? [...sessions, currentSession] : sessions,
        };
    },

    /**
     * Импортирует данные из экспорта
     */
    importData: (exportData: SessionExport): { success: boolean; imported: number; errors: string[] } => {
        const result = { success: true, imported: 0, errors: [] as string[] };

        try {
            const existingSessions = storage.loadSavedSessions();
            let imported = 0;

            for (const session of exportData.sessions) {
                try {
                    // Проверяем, не существует ли уже сессия с таким ID
                    if (!existingSessions.find((s) => s.id === session.id)) {
                        storage.saveNamedSession(session);
                        imported++;
                    }
                } catch (error) {
                    result.errors.push(`Failed to import session "${session.name}": ${error}`);
                }
            }

            result.imported = imported;
        } catch (error) {
            result.success = false;
            result.errors.push(`Failed to import data: ${error}`);
        }

        return result;
    },

    /**
     * Получает размер занимаемый данными в localStorage
     */
    getStorageSize: (): { current: number; saved: number; total: number } => {
        const currentSize = localStorage.getItem(STORAGE_KEYS.CURRENT_SESSION)?.length || 0;
        const savedSize = localStorage.getItem(STORAGE_KEYS.SAVED_SESSIONS)?.length || 0;

        return {
            current: currentSize,
            saved: savedSize,
            total: currentSize + savedSize,
        };
    },

    /**
     * Очищает все данные приложения
     */
    clearAllData: (): void => {
        try {
            Object.values(STORAGE_KEYS).forEach((key) => {
                localStorage.removeItem(key);
            });
        } catch (error) {
            console.warn('Failed to clear all data:', error);
        }
    },
};

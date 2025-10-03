import type { Session, SessionInput } from '../model/types';
import { getTotalExpenses, i18n } from '~shared/lib';

/**
 * Создает новую сессию
 */
export const createSession = (input: SessionInput): Session => {
    const now = new Date();
    const id = generateSessionId();

    return {
        id,
        name: input.name,
        description: input.description,
        people: input.people || [{ id: 1, name: '', expenses: '', duty: 0 }],
        createdAt: now,
        updatedAt: now,
        totalExpenses: input.people ? getTotalExpenses(input.people) : 0,
        isCalculated: false,
    };
};

/**
 * Обновляет сессию
 */
export const updateSession = (session: Session, updates: Partial<Omit<Session, 'id' | 'createdAt'>>): Session => {
    const updatedSession = {
        ...session,
        ...updates,
        updatedAt: new Date(),
    };

    // Пересчитываем общие расходы если изменились люди
    if (updates.people) {
        updatedSession.totalExpenses = getTotalExpenses(updates.people);
    }

    return updatedSession;
};

/**
 * Генерирует уникальный ID для сессии
 */
export const generateSessionId = (): string => {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Валидирует сессию
 */
export const validateSession = (session: Session): boolean => {
    return !!(session.id && session.name.trim() && session.people.length > 0 && session.createdAt && session.updatedAt);
};

/**
 * Форматирует дату для отображения
 */
export const formatSessionDate = (date: Date): string => {
    const locale = i18n.language.startsWith('en') ? 'en-US' : 'ru-RU';
    return new Intl.DateTimeFormat(locale, {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    }).format(new Date(date));
};

/**
 * Получает краткое описание сессии
 */
export const getSessionSummary = (session: Session): string => {
    const peopleCount = session.people.length;
    const totalExpenses = session.totalExpenses;

    const peopleLabel = i18n.t('sessionManager.peopleCount', { count: peopleCount });
    return `${peopleLabel}, ${totalExpenses.toFixed(2)} ₽`;
};

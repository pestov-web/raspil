import type { Person } from '~entities/person';

/**
 * Рассчитывает обязательства для каждого человека
 * Логика: доля на человека - потраченная сумма = обязательство
 */
export const calculateDuties = (people: Person[]): Person[] => {
    const totalExpenses = people.reduce((sum, person) => {
        const expense = parseFloat(person.expenses) || 0;
        return sum + expense;
    }, 0);

    const perPersonShare = totalExpenses / people.length;

    return people.map((person) => {
        const expense = parseFloat(person.expenses) || 0;
        const duty = perPersonShare - expense;
        return { ...person, duty: Math.round(duty * 100) / 100 };
    });
};

/**
 * Подсчитывает общие расходы
 */
export const getTotalExpenses = (people: Person[]): number => {
    return people.reduce((sum, person) => {
        const expense = parseFloat(person.expenses) || 0;
        return sum + expense;
    }, 0);
};

/**
 * Рассчитывает долю на каждого человека
 */
export const getPerPersonShare = (people: Person[]): number => {
    const total = getTotalExpenses(people);
    return people.length > 0 ? Math.round((total / people.length) * 100) / 100 : 0;
};

/**
 * Фильтрует людей, которые должны доплатить
 */
export const getDebtors = (people: Person[]): Person[] => {
    return people.filter((p) => p.duty > 0);
};

/**
 * Фильтрует людей, которым нужно вернуть
 */
export const getCreditors = (people: Person[]): Person[] => {
    return people.filter((p) => p.duty < 0);
};

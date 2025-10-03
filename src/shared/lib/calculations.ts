import type { Person } from '~entities/person';

const roundToCents = (value: number): number => Math.round(value * 100) / 100;
const MIN_TRANSFER_AMOUNT = 0.01;

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
        return { ...person, duty: roundToCents(duty) };
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
    return people.length > 0 ? roundToCents(total / people.length) : 0;
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

export interface TransferPlan {
    debtor: Person;
    creditor: Person;
    amount: number;
}

export const calculateTransfers = (people: Person[]): TransferPlan[] => {
    const debtors = getDebtors(people)
        .map((person) => ({ person, remaining: roundToCents(person.duty ?? 0) }))
        .filter((entry) => entry.remaining > MIN_TRANSFER_AMOUNT)
        .sort((a, b) => b.remaining - a.remaining);

    const creditors = getCreditors(people)
        .map((person) => ({ person, remaining: roundToCents(Math.abs(person.duty ?? 0)) }))
        .filter((entry) => entry.remaining > MIN_TRANSFER_AMOUNT)
        .sort((a, b) => b.remaining - a.remaining);

    const transfers: TransferPlan[] = [];
    let debtorIndex = 0;
    let creditorIndex = 0;

    while (debtorIndex < debtors.length && creditorIndex < creditors.length) {
        const debtor = debtors[debtorIndex];
        const creditor = creditors[creditorIndex];

        const amount = Math.min(debtor.remaining, creditor.remaining);

        if (amount > MIN_TRANSFER_AMOUNT) {
            transfers.push({
                debtor: debtor.person,
                creditor: creditor.person,
                amount: roundToCents(amount),
            });
        }

        debtor.remaining = roundToCents(debtor.remaining - amount);
        creditor.remaining = roundToCents(creditor.remaining - amount);

        if (debtor.remaining <= MIN_TRANSFER_AMOUNT) {
            debtorIndex++;
        }
        if (creditor.remaining <= MIN_TRANSFER_AMOUNT) {
            creditorIndex++;
        }
    }

    return transfers;
};

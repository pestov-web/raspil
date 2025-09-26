import type { Person, PersonInput } from '../model/types';

/**
 * Создает нового человека с уникальным ID
 */
export const createPerson = (input: PersonInput, existingPeople: Person[]): Person => {
    const id = input.id ?? Math.max(...existingPeople.map((p) => p.id), 0) + 1;

    return {
        id,
        name: input.name,
        expenses: input.expenses,
        duty: 0,
    };
};

/**
 * Обновляет поля человека
 */
export const updatePerson = (person: Person, field: keyof Pick<Person, 'name' | 'expenses'>, value: string): Person => {
    return { ...person, [field]: value };
};

/**
 * Проверяет, может ли человек быть удален (не последний в списке)
 */
export const canRemovePerson = (people: Person[]): boolean => {
    return people.length > 1;
};
/**
 * Безопасное извлечение числового значения расходов
 */
export const getExpenseValue = (expenses: string): number => {
    const parsed = parseFloat(expenses);
    return isNaN(parsed) ? 0 : parsed;
};

/**
 * Форматирует обязательство для отображения
 */
export const formatDuty = (duty: number): string => {
    if (duty === 0) return '0 ₽';
    if (duty > 0) return `Должен: ${duty.toFixed(2)} ₽`;
    return `Вернуть: ${Math.abs(duty).toFixed(2)} ₽`;
};

/**
 * Определяет статус человека по обязательствам
 */
export const getPersonStatus = (duty: number): 'debtor' | 'creditor' | 'even' => {
    if (duty > 0) return 'debtor';
    if (duty < 0) return 'creditor';
    return 'even';
};

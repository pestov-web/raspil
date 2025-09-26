import { describe, it, expect } from 'vitest';
import { calculateDuties, getTotalExpenses, getPerPersonShare, getDebtors, getCreditors } from '~shared/lib';
import type { Person } from '~entities/person';

describe('Expense Calculator Utils', () => {
    const mockPeople: Person[] = [
        { id: 1, name: 'Alice', expenses: '100', duty: 0 },
        { id: 2, name: 'Bob', expenses: '50', duty: 0 },
        { id: 3, name: 'Charlie', expenses: '0', duty: 0 },
    ];

    describe('calculateDuties', () => {
        it('should calculate correct duties', () => {
            const result = calculateDuties(mockPeople);

            // Total: 150, per person: 50
            // Alice: 50 - 100 = -50 (should receive)
            // Bob: 50 - 50 = 0 (even)
            // Charlie: 50 - 0 = 50 (owes)

            expect(result[0].duty).toBe(-50);
            expect(result[1].duty).toBe(0);
            expect(result[2].duty).toBe(50);
        });

        it('should handle empty expenses', () => {
            const people = [
                { id: 1, name: 'Alice', expenses: '', duty: 0 },
                { id: 2, name: 'Bob', expenses: '100', duty: 0 },
            ];

            const result = calculateDuties(people);
            expect(result[0].duty).toBe(50); // Should owe 50
            expect(result[1].duty).toBe(-50); // Should receive 50
        });
    });

    describe('getTotalExpenses', () => {
        it('should sum all expenses correctly', () => {
            expect(getTotalExpenses(mockPeople)).toBe(150);
        });

        it('should handle invalid expenses', () => {
            const people = [
                { id: 1, name: 'Alice', expenses: 'abc', duty: 0 },
                { id: 2, name: 'Bob', expenses: '50', duty: 0 },
            ];

            expect(getTotalExpenses(people)).toBe(50);
        });
    });

    describe('getPerPersonShare', () => {
        it('should calculate per person share', () => {
            expect(getPerPersonShare(mockPeople)).toBe(50);
        });

        it('should handle empty array', () => {
            expect(getPerPersonShare([])).toBe(0);
        });
    });

    describe('getDebts and getCredits', () => {
        it('should filter debts and credits correctly', () => {
            const calculatedPeople = calculateDuties(mockPeople);

            const debts = getDebtors(calculatedPeople);
            const credits = getCreditors(calculatedPeople);
            expect(debts).toHaveLength(1);
            expect(debts[0].name).toBe('Charlie');

            expect(credits).toHaveLength(1);
            expect(credits[0].name).toBe('Alice');
        });
    });
});

import React from 'react';
import type { Person } from '~entities/person';
import { StatCard } from '~shared/ui';

interface ExpenseStatsProps {
    people: Person[];
    totalExpenses: number;
    perPersonShare: number;
}

export const ExpenseStats: React.FC<ExpenseStatsProps> = ({ people: _people, totalExpenses, perPersonShare }) => {
    return (
        <div className='grid md:grid-cols-2 gap-6 mb-6'>
            <StatCard
                title='Общие расходы'
                value={`${totalExpenses.toFixed(2)} ₽`}
                className='bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 dark:from-emerald-900/40 dark:to-emerald-800/30 dark:text-emerald-200'
            />
            <StatCard
                title='На каждого'
                value={`${perPersonShare.toFixed(2)} ₽`}
                className='bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 dark:from-indigo-900/40 dark:to-cyan-900/30 dark:text-cyan-200'
            />
        </div>
    );
};

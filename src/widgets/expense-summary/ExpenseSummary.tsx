import React from 'react';
import { ArrowRight, TrendingUp, TrendingDown } from 'lucide-react';
import type { Person } from '~entities/person';
import { getDebtors, getCreditors } from '~shared/lib';

interface DebtorCreditorPair {
    debtor: Person;
    creditor: Person;
    amount: number;
}

interface ExpenseSummaryProps {
    people: Person[];
    totalExpenses: number;
    perPersonShare: number;
}

export const ExpenseSummary: React.FC<ExpenseSummaryProps> = ({ people, totalExpenses, perPersonShare }) => {
    const debts = getDebtors(people);
    const credits = getCreditors(people);

    // Оптимальные переводы между участниками
    const calculateOptimalTransfers = (): DebtorCreditorPair[] => {
        const debtorQueue = debts
            .map((person) => ({ person, remaining: person.duty }))
            .sort((a, b) => b.remaining - a.remaining);
        const creditorQueue = credits
            .map((person) => ({ person, remaining: Math.abs(person.duty) }))
            .sort((a, b) => b.remaining - a.remaining);

        const transfers: DebtorCreditorPair[] = [];
        let debtIndex = 0;
        let creditIndex = 0;

        while (debtIndex < debtorQueue.length && creditIndex < creditorQueue.length) {
            const debtor = debtorQueue[debtIndex];
            const creditor = creditorQueue[creditIndex];

            const amount = Math.min(debtor.remaining, creditor.remaining);

            if (amount > 0.01) {
                // Игнорируем копейки
                transfers.push({ debtor: debtor.person, creditor: creditor.person, amount });
            }

            debtor.remaining -= amount;
            creditor.remaining -= amount;

            if (debtor.remaining <= 0.01) debtIndex++;
            if (creditor.remaining <= 0.01) creditIndex++;
        }

        return transfers;
    };

    const transfers = calculateOptimalTransfers();

    if (totalExpenses === 0) return null;

    return (
        <div className='mt-6 space-y-4'>
            {/* Общая статистика */}
            <div className='bg-blue-50 rounded-xl p-4'>
                <h3 className='text-lg font-semibold text-blue-800 mb-3 flex items-center gap-2'>
                    <TrendingUp size={20} />
                    Сводка расчетов
                </h3>

                <div className='grid md:grid-cols-3 gap-4 text-sm mb-4'>
                    <div className='text-center'>
                        <div className='text-2xl font-bold text-blue-700'>{totalExpenses.toFixed(2)} ₽</div>
                        <div className='text-blue-600'>Общие расходы</div>
                    </div>
                    <div className='text-center'>
                        <div className='text-2xl font-bold text-blue-700'>{perPersonShare.toFixed(2)} ₽</div>
                        <div className='text-blue-600'>На каждого</div>
                    </div>
                    <div className='text-center'>
                        <div className='text-2xl font-bold text-blue-700'>{transfers.length}</div>
                        <div className='text-blue-600'>Переводов нужно</div>
                    </div>
                </div>
            </div>

            {/* Оптимальные переводы */}
            {transfers.length > 0 && (
                <div className='bg-green-50 rounded-xl p-4'>
                    <h4 className='font-semibold text-green-800 mb-3 flex items-center gap-2'>
                        <ArrowRight size={20} />
                        Кто кому переводит:
                    </h4>
                    <div className='space-y-2'>
                        {transfers.map((transfer, index) => (
                            <div
                                key={index}
                                className='flex items-center justify-between bg-white rounded-lg p-3 shadow-sm'
                            >
                                <div className='flex items-center gap-3'>
                                    <span className='font-medium text-gray-800'>
                                        {transfer.debtor.name || `Человек ${transfer.debtor.id}`}
                                    </span>
                                    <ArrowRight size={16} className='text-green-600' />
                                    <span className='font-medium text-gray-800'>
                                        {transfer.creditor.name || `Человек ${transfer.creditor.id}`}
                                    </span>
                                </div>
                                <span className='font-bold text-green-700'>{transfer.amount.toFixed(2)} ₽</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Детализация долгов/возвратов */}
            <div className='grid md:grid-cols-2 gap-4'>
                {debts.length > 0 && (
                    <div className='bg-red-50 rounded-xl p-4'>
                        <h4 className='font-semibold text-red-700 mb-2 flex items-center gap-2'>
                            <TrendingDown size={18} />
                            Должны доплатить:
                        </h4>
                        {debts.map((person) => (
                            <div key={person.id} className='flex justify-between'>
                                <span>{person.name || `Человек ${person.id}`}:</span>
                                <span className='font-semibold text-red-600'>{person.duty.toFixed(2)} ₽</span>
                            </div>
                        ))}
                    </div>
                )}

                {credits.length > 0 && (
                    <div className='bg-green-50 rounded-xl p-4'>
                        <h4 className='font-semibold text-green-700 mb-2 flex items-center gap-2'>
                            <TrendingUp size={18} />
                            Нужно вернуть:
                        </h4>
                        {credits.map((person) => (
                            <div key={person.id} className='flex justify-between'>
                                <span>{person.name || `Человек ${person.id}`}:</span>
                                <span className='font-semibold text-green-600'>
                                    {Math.abs(person.duty).toFixed(2)} ₽
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

import React from 'react';
import { ArrowRight, TrendingUp, TrendingDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { Person } from '~entities/person';
import { getDebtors, getCreditors, calculateTransfers } from '~shared/lib';

interface ExpenseSummaryProps {
    people: Person[];
    totalExpenses: number;
    perPersonShare: number;
}

export const ExpenseSummary: React.FC<ExpenseSummaryProps> = ({ people, totalExpenses, perPersonShare }) => {
    const debts = getDebtors(people);
    const credits = getCreditors(people);
    const transfers = calculateTransfers(people);
    const { t } = useTranslation();

    if (totalExpenses === 0) return null;

    return (
        <div className='mt-6 space-y-4'>
            {/* Общая статистика */}
            <div className='rounded-xl bg-blue-50 p-4 dark:bg-slate-800'>
                <h3 className='mb-3 flex items-center gap-2 text-lg font-semibold text-blue-800 dark:text-blue-200'>
                    <TrendingUp size={20} />
                    {t('summary.title')}
                </h3>

                <div className='mb-4 grid gap-4 text-sm md:grid-cols-3'>
                    <div className='text-center'>
                        <div className='text-2xl font-bold text-blue-700 dark:text-blue-200'>
                            {totalExpenses.toFixed(2)} ₽
                        </div>
                        <div className='text-blue-600 dark:text-blue-300'>{t('summary.total')}</div>
                    </div>
                    <div className='text-center'>
                        <div className='text-2xl font-bold text-blue-700 dark:text-blue-200'>
                            {perPersonShare.toFixed(2)} ₽
                        </div>
                        <div className='text-blue-600 dark:text-blue-300'>{t('summary.perPerson')}</div>
                    </div>
                    <div className='text-center'>
                        <div className='text-2xl font-bold text-blue-700 dark:text-blue-200'>{transfers.length}</div>
                        <div className='text-blue-600 dark:text-blue-300'>{t('summary.transfersRequired')}</div>
                    </div>
                </div>
            </div>

            {/* Оптимальные переводы */}
            {transfers.length > 0 && (
                <div className='rounded-xl bg-green-50 p-4 dark:bg-emerald-900/30'>
                    <h4 className='mb-3 flex items-center gap-2 font-semibold text-green-800 dark:text-emerald-200'>
                        <ArrowRight size={20} />
                        {t('summary.transfersHeading')}
                    </h4>
                    <div className='space-y-2'>
                        {transfers.map((transfer, index) => (
                            <div
                                key={index}
                                className='flex items-center justify-between rounded-lg bg-white p-3 shadow-sm dark:bg-slate-900'
                            >
                                <div className='flex items-center gap-3'>
                                    <span className='font-medium text-gray-800 dark:text-slate-100'>
                                        {transfer.debtor.name?.trim()
                                            ? transfer.debtor.name
                                            : t('common.personFallback', { id: transfer.debtor.id })}
                                    </span>
                                    <ArrowRight size={16} className='text-green-600 dark:text-emerald-300' />
                                    <span className='font-medium text-gray-800 dark:text-slate-100'>
                                        {transfer.creditor.name?.trim()
                                            ? transfer.creditor.name
                                            : t('common.personFallback', { id: transfer.creditor.id })}
                                    </span>
                                </div>
                                <span className='font-bold text-green-700 dark:text-emerald-300'>
                                    {transfer.amount.toFixed(2)} ₽
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Детализация долгов/возвратов */}
            <div className='grid gap-4 md:grid-cols-2'>
                {debts.length > 0 && (
                    <div className='rounded-xl bg-red-50 p-4 dark:bg-rose-900/30'>
                        <h4 className='mb-2 flex items-center gap-2 font-semibold text-red-700 dark:text-rose-200'>
                            <TrendingDown size={18} />
                            {t('summary.debtorsTitle')}
                        </h4>
                        {debts.map((person) => (
                            <div key={person.id} className='flex justify-between'>
                                <span>
                                    {person.name?.trim() ? person.name : t('common.personFallback', { id: person.id })}
                                    {': '}
                                </span>
                                <span className='font-semibold text-red-600 dark:text-rose-300'>
                                    {person.duty.toFixed(2)} ₽
                                </span>
                            </div>
                        ))}
                    </div>
                )}

                {credits.length > 0 && (
                    <div className='rounded-xl bg-green-50 p-4 dark:bg-emerald-900/30'>
                        <h4 className='mb-2 flex items-center gap-2 font-semibold text-green-700 dark:text-emerald-200'>
                            <TrendingUp size={18} />
                            {t('summary.creditorsTitle')}
                        </h4>
                        {credits.map((person) => (
                            <div key={person.id} className='flex justify-between'>
                                <span>
                                    {person.name?.trim() ? person.name : t('common.personFallback', { id: person.id })}
                                    {': '}
                                </span>
                                <span className='font-semibold text-green-600 dark:text-emerald-300'>
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

import { MinusCircle } from 'lucide-react';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import type { Person } from '~entities/person';
import { isValidExpenseInput } from '~shared/lib';

interface PeopleTableProps {
    people: Person[];
    updatePerson: (id: number, field: string, value: string) => void;
    removePerson: (id: number) => void;
}

export const PeopleTable: React.FC<PeopleTableProps> = ({ people, updatePerson, removePerson }) => {
    const { t } = useTranslation();

    return (
        <div className='space-y-4'>
            {people.map((person, index) => {
                const isExpenseInvalid = !isValidExpenseInput(person.expenses);
                return (
                    <div
                        key={person.id}
                        className='rounded-xl border border-gray-200 bg-gray-50 p-4 shadow-sm transition dark:border-slate-700 dark:bg-slate-800 animate-fade-in-up'
                        style={{ animationDelay: `${index * 60}ms` }}
                    >
                        <div className='grid md:grid-cols-4 gap-4 items-end'>
                            <div>
                                <label className='mb-2 block text-sm font-medium text-gray-700 dark:text-slate-300'>
                                    {t('people.nameLabel')}
                                </label>
                                <input
                                    type='text'
                                    placeholder={t('people.namePlaceholder')}
                                    value={person.name}
                                    onChange={(e) => updatePerson(person.id, 'name', e.target.value)}
                                    className='w-full rounded-lg border border-gray-300 px-3 py-2 outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100'
                                />
                            </div>
                            <div>
                                <label className='mb-2 block text-sm font-medium text-gray-700 dark:text-slate-300'>
                                    {t('people.expensesLabel')}
                                </label>
                                <input
                                    type='number'
                                    placeholder={t('people.expensesPlaceholder')}
                                    value={person.expenses}
                                    onChange={(e) => updatePerson(person.id, 'expenses', e.target.value)}
                                    className={`w-full rounded-lg border px-3 py-2 outline-none transition-all focus:ring-2 ${
                                        isExpenseInvalid
                                            ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-200'
                                            : 'border-gray-300 focus:border-transparent focus:ring-indigo-500 dark:border-slate-700'
                                    } dark:bg-slate-900 dark:text-slate-100`}
                                />
                                {isExpenseInvalid && (
                                    <p className='mt-2 text-sm text-rose-600 dark:text-rose-400'>
                                        {t('people.expensesError')}
                                    </p>
                                )}
                            </div>
                            <div>
                                <label className='mb-2 block text-sm font-medium text-gray-700 dark:text-slate-300'>
                                    {t('people.resultLabel')}
                                </label>
                                <div
                                    className={`rounded-lg px-3 py-2 text-center font-semibold ${
                                        person.duty > 0
                                            ? 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300'
                                            : person.duty < 0
                                            ? 'bg-green-100 text-green-700 dark:bg-emerald-900/40 dark:text-emerald-300'
                                            : 'bg-gray-100 text-gray-700 dark:bg-slate-900 dark:text-slate-200'
                                    }`}
                                >
                                    {person.duty === 0
                                        ? t('people.resultZero')
                                        : person.duty > 0
                                        ? t('people.resultDebtor', { amount: person.duty.toFixed(2) })
                                        : t('people.resultCreditor', {
                                              amount: Math.abs(person.duty).toFixed(2),
                                          })}
                                </div>
                            </div>
                            <div className='flex justify-center'>
                                {people.length > 1 && (
                                    <button
                                        onClick={() => removePerson(person.id)}
                                        className='rounded-lg p-2 text-red-500 transition-colors hover:bg-red-100 dark:text-rose-300 dark:hover:bg-rose-900/30'
                                    >
                                        <MinusCircle size={20} />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

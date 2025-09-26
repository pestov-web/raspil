import { MinusCircle } from 'lucide-react';
import * as React from 'react';
import type { Person } from '~entities/person';

interface PeopleTableProps {
    people: Person[];
    updatePerson: (id: number, field: string, value: string) => void;
    removePerson: (id: number) => void;
}

export const PeopleTable: React.FC<PeopleTableProps> = ({ people, updatePerson, removePerson }) => {
    return (
        <div className='space-y-4'>
            {people.map((person) => (
                <div key={person.id} className='bg-gray-50 p-4 rounded-xl border border-gray-200'>
                    <div className='grid md:grid-cols-4 gap-4 items-end'>
                        <div>
                            <label className='block text-sm font-medium text-gray-700 mb-2'>Имя</label>
                            <input
                                type='text'
                                placeholder='Введите имя'
                                value={person.name}
                                onChange={(e) => updatePerson(person.id, 'name', e.target.value)}
                                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all'
                            />
                        </div>
                        <div>
                            <label className='block text-sm font-medium text-gray-700 mb-2'>Потратил</label>
                            <input
                                type='number'
                                placeholder='0'
                                value={person.expenses}
                                onChange={(e) => updatePerson(person.id, 'expenses', e.target.value)}
                                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all'
                            />
                        </div>
                        <div>
                            <label className='block text-sm font-medium text-gray-700 mb-2'>Результат</label>
                            <div
                                className={`px-3 py-2 rounded-lg font-semibold text-center ${
                                    person.duty > 0
                                        ? 'bg-red-100 text-red-700'
                                        : person.duty < 0
                                        ? 'bg-green-100 text-green-700'
                                        : 'bg-gray-100 text-gray-700'
                                }`}
                            >
                                {person.duty === 0
                                    ? '0 ₽'
                                    : person.duty > 0
                                    ? `Должен: ${person.duty.toFixed(2)} ₽`
                                    : `Вернуть: ${Math.abs(person.duty).toFixed(2)} ₽`}
                            </div>
                        </div>
                        <div className='flex justify-center'>
                            {people.length > 1 && (
                                <button
                                    onClick={() => removePerson(person.id)}
                                    className='p-2 text-red-500 hover:bg-red-100 rounded-lg transition-colors'
                                >
                                    <MinusCircle size={20} />
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

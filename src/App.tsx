import { useState, useEffect } from 'react';
import { MinusCircle, Plus, Calculator, Users } from 'lucide-react';

function App() {
    const [people, setPeople] = useState([{ id: 1, name: '', expenses: '', duty: 0 }]);

    const addPerson = () => {
        const newId = Math.max(...people.map((p) => p.id), 0) + 1;
        setPeople([...people, { id: newId, name: '', expenses: '', duty: 0 }]);
    };

    const removePerson = (id) => {
        if (people.length > 1) {
            setPeople(people.filter((p) => p.id !== id));
        }
    };

    const updatePerson = (id, field, value) => {
        setPeople(people.map((p) => (p.id === id ? { ...p, [field]: value } : p)));
    };

    const calculateDuties = () => {
        const totalExpenses = people.reduce((sum, person) => {
            const expense = parseFloat(person.expenses) || 0;
            return sum + expense;
        }, 0);

        const perPersonShare = totalExpenses / people.length;

        const updatedPeople = people.map((person) => {
            const expense = parseFloat(person.expenses) || 0;
            const duty = perPersonShare - expense;
            return { ...person, duty: Math.round(duty * 100) / 100 };
        });

        setPeople(updatedPeople);
    };

    const getTotalExpenses = () => {
        return people.reduce((sum, person) => {
            const expense = parseFloat(person.expenses) || 0;
            return sum + expense;
        }, 0);
    };

    const getPerPersonShare = () => {
        const total = getTotalExpenses();
        return people.length > 0 ? Math.round((total / people.length) * 100) / 100 : 0;
    };

    return (
        <div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4'>
            <div className='max-w-4xl mx-auto'>
                <div className='bg-white rounded-2xl shadow-xl p-6 mb-6'>
                    <div className='flex items-center gap-3 mb-6'>
                        <Users className='text-indigo-600' size={32} />
                        <h1 className='text-3xl font-bold text-gray-800'>Калькулятор расходов</h1>
                    </div>

                    <div className='grid md:grid-cols-2 gap-6 mb-6'>
                        <div className='bg-gradient-to-r from-green-100 to-emerald-100 p-4 rounded-xl'>
                            <h3 className='text-lg font-semibold text-green-800 mb-2'>Общие расходы</h3>
                            <p className='text-2xl font-bold text-green-700'>{getTotalExpenses().toFixed(2)} ₽</p>
                        </div>
                        <div className='bg-gradient-to-r from-blue-100 to-cyan-100 p-4 rounded-xl'>
                            <h3 className='text-lg font-semibold text-blue-800 mb-2'>На каждого</h3>
                            <p className='text-2xl font-bold text-blue-700'>{getPerPersonShare().toFixed(2)} ₽</p>
                        </div>
                    </div>

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
                                        <label className='block text-sm font-medium text-gray-700 mb-2'>
                                            Результат
                                        </label>
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

                    <div className='flex gap-4 mt-6'>
                        <button
                            onClick={addPerson}
                            className='flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors'
                        >
                            <Plus size={20} />
                            Добавить человека
                        </button>
                        <button
                            onClick={calculateDuties}
                            className='flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors'
                        >
                            <Calculator size={20} />
                            Рассчитать
                        </button>
                    </div>

                    {getTotalExpenses() > 0 && (
                        <div className='mt-6 p-4 bg-blue-50 rounded-xl'>
                            <h3 className='text-lg font-semibold text-blue-800 mb-3'>Сводка расчетов</h3>
                            <div className='grid md:grid-cols-2 gap-4 text-sm'>
                                <div>
                                    <h4 className='font-semibold text-red-700 mb-2'>Должны доплатить:</h4>
                                    {people
                                        .filter((p) => p.duty > 0)
                                        .map((person) => (
                                            <div key={person.id} className='flex justify-between'>
                                                <span>{person.name || `Человек ${person.id}`}:</span>
                                                <span className='font-semibold text-red-600'>
                                                    {person.duty.toFixed(2)} ₽
                                                </span>
                                            </div>
                                        ))}
                                </div>
                                <div>
                                    <h4 className='font-semibold text-green-700 mb-2'>Нужно вернуть:</h4>
                                    {people
                                        .filter((p) => p.duty < 0)
                                        .map((person) => (
                                            <div key={person.id} className='flex justify-between'>
                                                <span>{person.name || `Человек ${person.id}`}:</span>
                                                <span className='font-semibold text-green-600'>
                                                    {Math.abs(person.duty).toFixed(2)} ₽
                                                </span>
                                            </div>
                                        ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default App;

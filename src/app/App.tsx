import { useState } from 'react';
import { Users } from 'lucide-react';
import type { Person } from '~entities/person';
import { createPerson } from '~entities/person';
import { calculateDuties, getTotalExpenses, getPerPersonShare } from '~shared/lib';
import { ExpenseStats } from '~widgets/expense-calculator';
import { PeopleManagerControls } from '~widgets/people-manager';
import { ExpenseSummary } from '~widgets/expense-summary';
import { PeopleTable } from '~widgets/people-table';

export function App() {
    const [people, setPeople] = useState<Person[]>([{ id: 1, name: '', expenses: '', duty: 0 }]);

    const addPerson = () => {
        const newPerson = createPerson({ name: '', expenses: '' }, people);
        setPeople([...people, newPerson]);
    };

    const removePerson = (id: number) => {
        if (people.length > 1) {
            setPeople(people.filter((p) => p.id !== id));
        }
    };

    const updatePerson = (id: number, field: string, value: string) => {
        setPeople(people.map((p) => (p.id === id ? { ...p, [field]: value } : p)));
    };

    const handleCalculateDuties = () => {
        const updatedPeople = calculateDuties(people);
        setPeople(updatedPeople);
    };

    const totalExpenses = getTotalExpenses(people);
    const perPersonShare = getPerPersonShare(people);

    return (
        <div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4'>
            <div className='max-w-4xl mx-auto'>
                <div className='bg-white rounded-2xl shadow-xl p-6 mb-6'>
                    <div className='flex items-center gap-3 mb-6'>
                        <Users className='text-indigo-600' size={32} />
                        <h1 className='text-3xl font-bold text-gray-800'>Калькулятор расходов</h1>
                    </div>

                    <ExpenseStats people={people} totalExpenses={totalExpenses} perPersonShare={perPersonShare} />

                    <PeopleTable people={people} updatePerson={updatePerson} removePerson={removePerson} />

                    <PeopleManagerControls
                        people={people}
                        onAddPerson={addPerson}
                        onCalculateDuties={handleCalculateDuties}
                    />

                    <ExpenseSummary people={people} totalExpenses={totalExpenses} perPersonShare={perPersonShare} />
                </div>
            </div>
        </div>
    );
}

import React from 'react';
import type { Person } from '~entities/person';
import { AddPersonButton } from '~features/add-person';
import { CalculateDutiesButton } from '~features/calculate-duties';

interface PeopleManagerProps {
    people: Person[];
    onAddPerson: () => void;
    onCalculateDuties: () => void;
}

export const PeopleManagerControls: React.FC<PeopleManagerProps> = ({
    people: _people,
    onAddPerson,
    onCalculateDuties,
}) => {
    return (
        <div className='flex gap-4 mt-6'>
            <AddPersonButton onAdd={onAddPerson} />
            <CalculateDutiesButton onCalculate={onCalculateDuties} />
        </div>
    );
};

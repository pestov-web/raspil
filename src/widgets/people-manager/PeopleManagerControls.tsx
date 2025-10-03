import React from 'react';
import { useTranslation } from 'react-i18next';
import { AddPersonButton } from '~features/add-person';
import { CalculateDutiesButton } from '~features/calculate-duties';

interface PeopleManagerProps {
    onAddPerson: () => void;
    onCalculateDuties: () => void;
    hasInvalidExpenses: boolean;
}

export const PeopleManagerControls: React.FC<PeopleManagerProps> = ({
    onAddPerson,
    onCalculateDuties,
    hasInvalidExpenses,
}) => {
    const { t } = useTranslation('translation', { keyPrefix: 'people' });

    return (
        <div className='mt-6 space-y-3'>
            <div className='flex flex-wrap gap-4'>
                <AddPersonButton onAdd={onAddPerson} />
                <CalculateDutiesButton onCalculate={onCalculateDuties} disabled={hasInvalidExpenses} />
            </div>
            {hasInvalidExpenses && <p className='text-sm text-rose-600 dark:text-rose-400'>{t('invalidExpenses')}</p>}
        </div>
    );
};

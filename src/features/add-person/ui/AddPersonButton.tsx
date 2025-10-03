import React from 'react';
import { Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface AddPersonButtonProps {
    onAdd: () => void;
    className?: string;
}

export const AddPersonButton: React.FC<AddPersonButtonProps> = ({ onAdd, className = '' }) => {
    const { t } = useTranslation('translation', { keyPrefix: 'people' });

    return (
        <button
            onClick={onAdd}
            className={`flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors ${className}`}
        >
            <Plus size={20} />
            {t('add')}
        </button>
    );
};

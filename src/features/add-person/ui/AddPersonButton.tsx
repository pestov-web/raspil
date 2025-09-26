import React from 'react';
import { Plus } from 'lucide-react';

interface AddPersonButtonProps {
    onAdd: () => void;
    className?: string;
}

export const AddPersonButton: React.FC<AddPersonButtonProps> = ({ onAdd, className = '' }) => {
    return (
        <button
            onClick={onAdd}
            className={`flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors ${className}`}
        >
            <Plus size={20} />
            Добавить человека
        </button>
    );
};

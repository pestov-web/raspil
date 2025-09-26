import React from 'react';
import { Save } from 'lucide-react';

interface SaveSessionButtonProps {
    onSave: () => void;
    disabled?: boolean;
    className?: string;
}

export const SaveSessionButton: React.FC<SaveSessionButtonProps> = ({ onSave, disabled = false, className = '' }) => {
    return (
        <button
            onClick={onSave}
            disabled={disabled}
            className={`flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors ${className}`}
        >
            <Save size={20} />
            Сохранить сессию
        </button>
    );
};

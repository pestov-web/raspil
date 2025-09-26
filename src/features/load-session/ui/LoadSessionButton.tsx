import React from 'react';
import { FolderOpen } from 'lucide-react';

interface LoadSessionButtonProps {
    onLoad: () => void;
    className?: string;
}

export const LoadSessionButton: React.FC<LoadSessionButtonProps> = ({ onLoad, className = '' }) => {
    return (
        <button
            onClick={onLoad}
            className={`flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors ${className}`}
        >
            <FolderOpen size={20} />
            Загрузить сессию
        </button>
    );
};

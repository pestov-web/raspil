import React from 'react';
import { Calculator } from 'lucide-react';

interface CalculateDutiesButtonProps {
    onCalculate: () => void;
    className?: string;
}

export const CalculateDutiesButton: React.FC<CalculateDutiesButtonProps> = ({ onCalculate, className = '' }) => {
    return (
        <button
            onClick={onCalculate}
            className={`flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors ${className}`}
        >
            <Calculator size={20} />
            Рассчитать
        </button>
    );
};

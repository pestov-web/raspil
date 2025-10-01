import React from 'react';
import { Calculator } from 'lucide-react';

interface CalculateDutiesButtonProps {
    onCalculate: () => void;
    className?: string;
    disabled?: boolean;
}

export const CalculateDutiesButton: React.FC<CalculateDutiesButtonProps> = ({
    onCalculate,
    className = '',
    disabled = false,
}) => {
    return (
        <button
            onClick={onCalculate}
            disabled={disabled}
            aria-disabled={disabled}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-white transition-colors ${
                disabled ? 'bg-green-600/60 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
            } ${className}`}
        >
            <Calculator size={20} />
            Рассчитать
        </button>
    );
};

import React from 'react';

interface StatCardProps {
    title: string;
    value: string;
    className?: string;
    icon?: React.ReactNode;
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, className = '', icon }) => {
    return (
        <div className={`p-4 rounded-xl ${className}`}>
            <h3 className='text-lg font-semibold mb-2 flex items-center gap-2'>
                {icon}
                {title}
            </h3>
            <p className='text-2xl font-bold'>{value}</p>
        </div>
    );
};

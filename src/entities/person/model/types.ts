export interface Person {
    id: number;
    name: string;
    expenses: string; // Строка для обработки ввода
    duty: number; // Рассчитанное значение (+ должен доплатить, - получить)
}

export interface PersonInput {
    id?: number;
    name: string;
    expenses: string;
}

export interface PersonCalculated extends Person {
    formattedDuty: string;
    isDebtor: boolean;
    isCreditor: boolean;
}

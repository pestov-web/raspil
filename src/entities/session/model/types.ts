import type { Person } from '~entities/person';

export interface Session {
    id: string;
    name: string;
    description?: string;
    people: Person[];
    createdAt: Date;
    updatedAt: Date;
    totalExpenses: number;
    isCalculated: boolean;
}

export interface SessionInput {
    name: string;
    description?: string;
    people?: Person[];
}

export interface SessionMetadata {
    id: string;
    name: string;
    description?: string;
    createdAt: Date;
    updatedAt: Date;
    totalExpenses: number;
    peopleCount: number;
}

export interface SessionExport {
    version: string;
    exportedAt: Date;
    sessions: Session[];
}

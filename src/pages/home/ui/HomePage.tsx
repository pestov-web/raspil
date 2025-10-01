import { useEffect, useState } from 'react';
import { Users } from 'lucide-react';
import type { Person } from '~entities/person';
import { createPerson } from '~entities/person';
import type { Session } from '~entities/session';
import { createSession, updateSession } from '~entities/session';
import { calculateDuties, getPerPersonShare, getTotalExpenses, createShareUrl, storage } from '~shared/lib';
import { ExpenseStats } from '~widgets/expense-calculator';
import { PeopleManagerControls } from '~widgets/people-manager';
import { ExpenseSummary } from '~widgets/expense-summary';
import { PeopleTable } from '~widgets/people-table';
import { SessionControls } from '~widgets/session-controls';
import { SessionManagerModal } from '~widgets/session-manager';

export const HomePage = () => {
    const [people, setPeople] = useState<Person[]>([{ id: 1, name: '', expenses: '', duty: 0 }]);
    const [currentSession, setCurrentSession] = useState<Session | null>(null);
    const [showSessionManager, setShowSessionManager] = useState(false);

    useEffect(() => {
        const savedSession = storage.loadCurrentSession();
        if (savedSession) {
            setCurrentSession(savedSession);
            setPeople(savedSession.people);
        } else {
            const newSession = createSession({
                name: 'Текущий расчет',
                description: 'Автоматически сохраненная сессия',
            });
            setCurrentSession(newSession);
        }
    }, []);

    useEffect(() => {
        if (currentSession) {
            const updatedSession = updateSession(currentSession, {
                people,
                totalExpenses: getTotalExpenses(people),
                isCalculated: people.some((p) => p.duty !== 0),
            });
            setCurrentSession(updatedSession);
            storage.saveCurrentSession(updatedSession);
        }
    }, [people]);

    const addPerson = () => {
        const newPerson = createPerson({ name: '', expenses: '' }, people);
        setPeople([...people, newPerson]);
    };

    const removePerson = (id: number) => {
        if (people.length > 1) {
            setPeople(people.filter((p) => p.id !== id));
        }
    };

    const updatePerson = (id: number, field: string, value: string) => {
        setPeople(people.map((p) => (p.id === id ? { ...p, [field]: value } : p)));
    };

    const handleCalculateDuties = () => {
        const updatedPeople = calculateDuties(people);
        setPeople(updatedPeople);
    };

    const handleSaveSession = () => {
        if (currentSession) {
            const sessionName = prompt('Введите название сессии:', currentSession.name);
            if (sessionName && sessionName.trim()) {
                const sessionToSave = updateSession(currentSession, {
                    name: sessionName.trim(),
                    people,
                    isCalculated: people.some((p) => p.duty !== 0),
                });
                storage.saveNamedSession(sessionToSave);
                alert('Сессия сохранена!');
            }
        }
    };

    const handleLoadSession = (sessionId: string) => {
        const savedSessions = storage.loadSavedSessions();
        const sessionToLoad = savedSessions.find((s) => s.id === sessionId);

        if (sessionToLoad) {
            setCurrentSession(sessionToLoad);
            setPeople(sessionToLoad.people);
            setShowSessionManager(false);
            alert(`Сессия "${sessionToLoad.name}" загружена!`);
        }
    };

    const handleDeleteSession = (sessionId: string) => {
        storage.deleteNamedSession(sessionId);
    };

    const handleNewSession = () => {
        const confirmed = confirm('Создать новую сессию? Текущий расчет будет сохранен автоматически.');
        if (confirmed) {
            const newSession = createSession({
                name: 'Новый расчет',
                description: 'Автоматически созданная сессия',
                people: [{ id: 1, name: '', expenses: '', duty: 0 }],
            });
            setCurrentSession(newSession);
            setPeople(newSession.people);
        }
    };

    const handleShareSession = async () => {
        if (!currentSession) return;

        const sessionToShare = updateSession(currentSession, {
            people,
            totalExpenses: getTotalExpenses(people),
            isCalculated: people.some((p) => p.duty !== 0),
        });
        setCurrentSession(sessionToShare);
        storage.saveCurrentSession(sessionToShare);

        const shareUrl = createShareUrl(sessionToShare);
        const summary = `Общие расходы: ${getTotalExpenses(people).toFixed(2)} ₽\nНа каждого: ${getPerPersonShare(
            people
        ).toFixed(2)} ₽`;

        if (navigator.share) {
            try {
                await navigator.share({
                    title: sessionToShare.name || 'Распил расходов',
                    text: summary,
                    url: shareUrl,
                });
                return;
            } catch (error) {
                console.warn('Web Share API failed, fallback to clipboard.', error);
            }
        }

        try {
            await navigator.clipboard.writeText(shareUrl);
            alert('Ссылка на расчет скопирована в буфер обмена!');
        } catch (error) {
            console.error('Failed to copy share link:', error);
            prompt('Скопируйте ссылку вручную:', shareUrl);
        }
    };

    const totalExpenses = getTotalExpenses(people);
    const perPersonShare = getPerPersonShare(people);

    return (
        <div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4'>
            <div className='max-w-4xl mx-auto'>
                <div className='bg-white rounded-2xl shadow-xl p-6 mb-6'>
                    <div className='flex items-center justify-between mb-6'>
                        <div className='flex items-center gap-3'>
                            <Users className='text-indigo-600' size={32} />
                            <div>
                                <h1 className='text-3xl font-bold text-gray-800'>Калькулятор расходов</h1>
                                {currentSession && (
                                    <p className='text-sm text-gray-600 mt-1'>Сессия: {currentSession.name}</p>
                                )}
                            </div>
                        </div>

                        <SessionControls
                            onOpenManager={() => setShowSessionManager(true)}
                            onSaveSession={handleSaveSession}
                            onNewSession={handleNewSession}
                            onShareSession={handleShareSession}
                        />
                    </div>

                    <ExpenseStats people={people} totalExpenses={totalExpenses} perPersonShare={perPersonShare} />

                    <PeopleTable people={people} updatePerson={updatePerson} removePerson={removePerson} />

                    <PeopleManagerControls
                        people={people}
                        onAddPerson={addPerson}
                        onCalculateDuties={handleCalculateDuties}
                    />

                    <ExpenseSummary people={people} totalExpenses={totalExpenses} perPersonShare={perPersonShare} />
                </div>
            </div>

            <SessionManagerModal
                isOpen={showSessionManager}
                onClose={() => setShowSessionManager(false)}
                onLoadSession={handleLoadSession}
                onDeleteSession={handleDeleteSession}
            />
        </div>
    );
};

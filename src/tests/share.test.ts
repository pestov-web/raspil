import { describe, expect, it, beforeEach, afterEach, vi } from 'vitest';
import { createSession } from '~entities/session';
import { encodeSessionForShare, decodeSessionFromShare, createShareUrl } from '~shared/lib';

let randomSpy: ReturnType<typeof vi.spyOn>;

describe('share utilities', () => {
    beforeEach(() => {
        vi.useFakeTimers({ toFake: ['Date'] });
        vi.setSystemTime(new Date('2024-01-01T12:00:00Z'));
        randomSpy = vi.spyOn(Math, 'random').mockReturnValue(0.123456789);
    });

    afterEach(() => {
        vi.useRealTimers();
        randomSpy.mockRestore();
    });

    it('encodes and decodes session preserving payload', () => {
        const session = createSession({
            name: 'Поездка',
            description: 'Алтай 2024',
            people: [
                { id: 1, name: 'Алиса', expenses: '1200', duty: 0 },
                { id: 2, name: 'Боб', expenses: '800', duty: 0 },
            ],
        });

        const encoded = encodeSessionForShare(session);
        expect(typeof encoded).toBe('string');
        expect(encoded).not.toHaveLength(0);
        expect(encoded).not.toMatch(/[+=/]/); // base64url без лишних символов

        const decoded = decodeSessionFromShare(encoded);
        expect(decoded.name).toBe(session.name);
        expect(decoded.description).toBe(session.description);
        expect(decoded.people).toHaveLength(2);
        expect(decoded.people[0].name).toBe('Алиса');
        expect(decoded.people[1].expenses).toBe('800');
        expect(decoded.isCalculated).toBe(false);
    });

    it('builds share URL with encoded data', () => {
        const session = createSession({ name: 'Тестовая сессия' });
        const url = createShareUrl(session);
        expect(url).toContain('/?');
        const [, query] = url.split('?');
        const params = new URLSearchParams(query);
        expect(params.get('data')).toBeTruthy();
    });

    it('throws when decoding invalid payload', () => {
        expect(() => decodeSessionFromShare('@@@')).toThrow();
    });

    it('decodes legacy payload with verbose JSON structure', () => {
        const legacyPayload = {
            version: 1,
            session: {
                name: 'Легаси',
                description: 'Старая структура',
                people: [
                    { id: 1, name: 'Олег', expenses: '100', duty: 0 },
                    { id: 2, name: 'Ира', expenses: '200', duty: 0 },
                ],
                isCalculated: true,
            },
        };

        const utf8 = encodeURIComponent(JSON.stringify(legacyPayload)).replace(/%([0-9A-F]{2})/g, (_, hex) =>
            String.fromCharCode(parseInt(hex as string, 16))
        );
        const encoded = btoa(utf8);

        const decoded = decodeSessionFromShare(encoded);
        expect(decoded.name).toBe('Легаси');
        expect(decoded.description).toBe('Старая структура');
        expect(decoded.people).toHaveLength(2);
        expect(decoded.people[0].name).toBe('Олег');
        expect(decoded.isCalculated).toBe(true);
    });
});

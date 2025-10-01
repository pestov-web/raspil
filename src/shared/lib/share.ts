import type { Person } from '~entities/person';
import type { Session } from '~entities/session';
import { createSession, updateSession } from '~entities/session';

type SharePersonTuple = [id: number, name: string, expenses: string, duty: number];

interface SessionSharePayloadV1 {
    version: number;
    session: {
        name: string;
        description?: string;
        people: Session['people'];
        isCalculated: boolean;
    };
}

interface SessionSharePayloadV2 {
    v: 2;
    s: {
        n: string;
        d?: string;
        c: boolean;
        p: SharePersonTuple[];
    };
}

type SessionSharePayload = SessionSharePayloadV2 | SessionSharePayloadV1;

const SHARE_PARAM = 'data';

const textEncoder = typeof TextEncoder !== 'undefined' ? new TextEncoder() : undefined;
const textDecoder = typeof TextDecoder !== 'undefined' ? new TextDecoder() : undefined;

const toBinaryString = (input: string): string => {
    if (!textEncoder) {
        // Fallback для окружений без TextEncoder (не ожидается в браузере/тестах)
        return input;
    }

    const bytes = textEncoder.encode(input);
    let binary = '';
    for (let index = 0; index < bytes.length; index += 1) {
        binary += String.fromCharCode(bytes[index]!);
    }
    return binary;
};

const fromBinaryString = (binary: string): string => {
    if (!textDecoder) {
        return binary;
    }

    const bytes = new Uint8Array(binary.length);
    for (let index = 0; index < binary.length; index += 1) {
        bytes[index] = binary.charCodeAt(index);
    }
    return textDecoder.decode(bytes);
};

const encodeToBase64Url = (input: string): string => {
    const base64 = btoa(toBinaryString(input));
    return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
};

const normaliseBase64Input = (value: string): string => {
    const cleaned = value.trim().replace(/\s+/g, '');
    const normalised = cleaned.replace(/-/g, '+').replace(/_/g, '/');
    const paddingLength = (4 - (normalised.length % 4)) % 4;
    return normalised + '='.repeat(paddingLength);
};

const decodeFromBase64Url = (encoded: string): string => {
    const normalised = normaliseBase64Input(encoded);
    const binary = atob(normalised);
    return fromBinaryString(binary);
};

const buildSharePayloadV2 = (session: Session): SessionSharePayloadV2 => ({
    v: 2,
    s: {
        n: session.name,
        d: session.description,
        c: session.isCalculated,
        p: session.people.map<SharePersonTuple>(({ id, name, expenses, duty }) => [id, name, expenses, duty]),
    },
});

const mapTupleToPeople = (tuples: SharePersonTuple[]): Person[] =>
    tuples.map<Person>(([id, name, expenses, duty], index) => ({
        id: Number.isFinite(id) ? id : index + 1,
        name: name ?? '',
        expenses: expenses ?? '',
        duty: typeof duty === 'number' ? duty : 0,
    }));

const decodePayload = (payload: SessionSharePayload): Session => {
    if ('v' in payload) {
        const people = mapTupleToPeople(payload.s.p);
        const session = createSession({
            name: payload.s.n || 'Полученный расчет',
            description: payload.s.d,
            people,
        });

        return updateSession(session, {
            people,
            isCalculated: payload.s.c,
        });
    }

    const session = createSession({
        name: payload.session.name || 'Полученный расчет',
        description: payload.session.description,
        people: payload.session.people,
    });

    return updateSession(session, {
        people: payload.session.people,
        isCalculated: payload.session.isCalculated,
    });
};

export const buildSharePayload = (session: Session): SessionSharePayloadV2 => buildSharePayloadV2(session);

export const encodeSessionForShare = (session: Session): string => {
    const payload = buildSharePayload(session);
    return encodeToBase64Url(JSON.stringify(payload));
};

export const createShareUrl = (session: Session): string => {
    const encoded = encodeSessionForShare(session);
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    return `${origin}/?${SHARE_PARAM}=${encoded}`;
};

export const decodeSessionFromShare = (encoded: string): Session => {
    try {
        const json = decodeFromBase64Url(encoded);
        const payload = JSON.parse(json) as SessionSharePayload;
        return decodePayload(payload);
    } catch (error) {
        console.error('Failed to decode shared session payload', error);
        throw new Error('Unable to decode shared session payload');
    }
};

export const SHARE_QUERY_PARAM = SHARE_PARAM;

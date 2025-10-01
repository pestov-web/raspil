import type { Session } from '~entities/session';
import { createSession, updateSession } from '~entities/session';

interface SessionSharePayload {
    version: number;
    session: {
        name: string;
        description?: string;
        people: Session['people'];
        isCalculated: boolean;
    };
}

const SHARE_PARAM = 'data';

const encodeToBase64 = (input: string): string => {
    const utf8String = encodeURIComponent(input).replace(/%([0-9A-F]{2})/g, (_, p1) =>
        String.fromCharCode(parseInt(p1, 16))
    );
    return btoa(utf8String);
};

const decodeFromBase64 = (encoded: string): string => {
    const binaryString = atob(encoded);
    const utf8String = Array.from(binaryString)
        .map((char) => `%${char.charCodeAt(0).toString(16).padStart(2, '0')}`)
        .join('');
    return decodeURIComponent(utf8String);
};

export const buildSharePayload = (session: Session): SessionSharePayload => ({
    version: 1,
    session: {
        name: session.name,
        description: session.description,
        people: session.people,
        isCalculated: session.isCalculated,
    },
});

export const encodeSessionForShare = (session: Session): string => {
    const payload = buildSharePayload(session);
    return encodeToBase64(JSON.stringify(payload));
};

export const createShareUrl = (session: Session): string => {
    const encoded = encodeSessionForShare(session);
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    return `${origin}/share?${SHARE_PARAM}=${encodeURIComponent(encoded)}`;
};

export const decodeSessionFromShare = (encoded: string): Session => {
    const json = decodeFromBase64(encoded);
    const payload = JSON.parse(json) as SessionSharePayload;

    const sharedSession = createSession({
        name: payload.session.name || 'Полученный расчет',
        description: payload.session.description,
        people: payload.session.people,
    });

    return updateSession(sharedSession, {
        people: payload.session.people,
        isCalculated: payload.session.isCalculated,
    });
};

export const SHARE_QUERY_PARAM = SHARE_PARAM;

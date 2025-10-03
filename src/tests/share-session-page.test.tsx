import { describe, expect, it, beforeEach, vi } from 'vitest';

const navigateMock = vi.fn();

vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
    return {
        ...actual,
        useNavigate: () => navigateMock,
    };
});

vi.mock('~shared/lib', () => ({
    decodeSessionFromShare: vi.fn(),
    SHARE_QUERY_PARAM: 'data',
}));

vi.mock('~shared/lib/storage', () => ({
    storage: {
        saveCurrentSession: vi.fn(),
        saveNamedSession: vi.fn(),
    },
}));

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { ShareSessionPage } from '~pages/share-session';
import { decodeSessionFromShare } from '~shared/lib';
import { storage } from '~shared/lib/storage';
import i18n from '~shared/lib/i18n';

describe('<ShareSessionPage />', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        navigateMock.mockReset();
    });

    it('imports session and redirects to home', async () => {
        const session = {
            id: 'session_test',
            name: 'Пикник',
            description: '4 июля',
            people: [{ id: 1, name: 'Алиса', expenses: '100', duty: 0 }],
            createdAt: new Date(),
            updatedAt: new Date(),
            totalExpenses: 100,
            isCalculated: true,
        };

        vi.mocked(decodeSessionFromShare).mockReturnValue(session);

        render(
            <MemoryRouter initialEntries={['/share?data=encoded']}>
                <Routes>
                    <Route path='/share' element={<ShareSessionPage />} />
                </Routes>
            </MemoryRouter>
        );

        const successText = i18n.t('shareSessionPage.success', { name: session.name });
        expect(await screen.findByText(successText)).toBeInTheDocument();
        expect(storage.saveCurrentSession).toHaveBeenCalledWith(session);
        expect(storage.saveNamedSession).toHaveBeenCalledWith(session);

        await waitFor(() => expect(navigateMock).toHaveBeenCalledWith('/', { replace: true }), {
            timeout: 2000,
        });
    });

    it('shows error when share parameter is missing', async () => {
        render(
            <MemoryRouter initialEntries={['/share']}>
                <Routes>
                    <Route path='/share' element={<ShareSessionPage />} />
                </Routes>
            </MemoryRouter>
        );

        const noDataText = i18n.t('shareSessionPage.noData');
        expect(await screen.findByText(noDataText)).toBeInTheDocument();
        expect(decodeSessionFromShare).not.toHaveBeenCalled();

        const backButtonText = i18n.t('shareSessionPage.back');
        fireEvent.click(screen.getByRole('button', { name: backButtonText }));
        expect(navigateMock).toHaveBeenCalledWith('/', { replace: true });
    });

    it('handles decode failure gracefully', async () => {
        vi.mocked(decodeSessionFromShare).mockImplementation(() => {
            throw new Error('bad payload');
        });

        render(
            <MemoryRouter initialEntries={['/share?data=broken']}>
                <Routes>
                    <Route path='/share' element={<ShareSessionPage />} />
                </Routes>
            </MemoryRouter>
        );

        const errorText = i18n.t('shareSessionPage.error');
        expect(await screen.findByText(errorText)).toBeInTheDocument();
        expect(storage.saveCurrentSession).not.toHaveBeenCalled();
        expect(storage.saveNamedSession).not.toHaveBeenCalled();
    });
});

import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import { HomePage } from '~pages/home';
import { ShareSessionPage } from '~pages/share-session';
import { ToastProvider } from '~shared/ui';
import i18n from '~shared/lib/i18n';

const router = createBrowserRouter([
    {
        path: '/',
        element: <HomePage />,
    },
    {
        path: '/share',
        element: <ShareSessionPage />,
    },
]);

export function App() {
    return (
        <I18nextProvider i18n={i18n}>
            <ToastProvider>
                <RouterProvider router={router} />
            </ToastProvider>
        </I18nextProvider>
    );
}

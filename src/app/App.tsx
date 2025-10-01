import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { HomePage } from '~pages/home';
import { ShareSessionPage } from '~pages/share-session';
import { ToastProvider } from '~shared/ui';

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
        <ToastProvider>
            <RouterProvider router={router} />
        </ToastProvider>
    );
}

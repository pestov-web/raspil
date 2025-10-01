import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { SHARE_QUERY_PARAM } from '~shared/lib';
import '~shared/styles/index.css';
import { App } from './App';

const bootstrapShareRoute = () => {
    if (typeof window === 'undefined') {
        return;
    }

    const { pathname, search } = window.location;
    if (pathname !== '/' || !search.includes(`${SHARE_QUERY_PARAM}=`)) {
        return;
    }

    const searchParams = new URLSearchParams(search);
    const encoded = searchParams.get(SHARE_QUERY_PARAM);
    if (!encoded) {
        return;
    }

    window.history.replaceState(null, '', `/share?${SHARE_QUERY_PARAM}=${encoded}`);
};

bootstrapShareRoute();

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <App />
    </StrictMode>
);

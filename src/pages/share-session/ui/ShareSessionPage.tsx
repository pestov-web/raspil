import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, Loader2, TriangleAlert } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { decodeSessionFromShare, SHARE_QUERY_PARAM } from '~shared/lib';
import { storage } from '~shared/lib/storage';

export const ShareSessionPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [messageKey, setMessageKey] = useState<'loading' | 'success' | 'noData' | 'error'>('loading');
    const [sessionName, setSessionName] = useState<string | null>(null);

    useEffect(() => {
        const encoded = searchParams.get(SHARE_QUERY_PARAM);
        if (!encoded) {
            setStatus('error');
            setMessageKey('noData');
            return;
        }

        try {
            const session = decodeSessionFromShare(encoded);
            storage.saveCurrentSession(session);
            storage.saveNamedSession(session);
            setStatus('success');
            setMessageKey('success');
            setSessionName(session.name);
            const timer = setTimeout(() => navigate('/', { replace: true }), 1500);
            return () => clearTimeout(timer);
        } catch (error) {
            console.error('Failed to decode shared session', error);
            setStatus('error');
            setMessageKey('error');
        }
    }, [navigate, searchParams, t]);
    const message = (() => {
        switch (messageKey) {
            case 'success':
                return t('shareSessionPage.success', {
                    name: sessionName && sessionName.trim().length > 0 ? sessionName : t('common.unnamedSession'),
                });
            case 'noData':
                return t('shareSessionPage.noData');
            case 'error':
                return t('shareSessionPage.error');
            case 'loading':
            default:
                return t('shareSessionPage.loading');
        }
    })();

    const Icon = status === 'success' ? CheckCircle : status === 'error' ? TriangleAlert : Loader2;

    return (
        <div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4'>
            <div className='bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center space-y-4'>
                <Icon
                    className={
                        status === 'loading' ? 'animate-spin text-indigo-600 mx-auto' : 'text-indigo-600 mx-auto'
                    }
                    size={48}
                />
                <h1 className='text-2xl font-bold text-gray-800'>{t('shareSessionPage.title')}</h1>
                <p className='text-gray-600'>{message}</p>
                {status === 'error' && (
                    <button
                        onClick={() => navigate('/', { replace: true })}
                        className='mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors'
                    >
                        {t('shareSessionPage.back')}
                    </button>
                )}
            </div>
        </div>
    );
};

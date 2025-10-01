import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, Loader2, TriangleAlert } from 'lucide-react';
import { decodeSessionFromShare, SHARE_QUERY_PARAM } from '~shared/lib';
import { storage } from '~shared/lib/storage';

export const ShareSessionPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [message, setMessage] = useState('Подготавливаем расчет...');

    useEffect(() => {
        const encoded = searchParams.get(SHARE_QUERY_PARAM);
        if (!encoded) {
            setStatus('error');
            setMessage('Не найдено данных для расчета. Убедитесь, что вы открыли корректную ссылку.');
            return;
        }

        try {
            const session = decodeSessionFromShare(encoded);
            storage.saveCurrentSession(session);
            storage.saveNamedSession(session);
            setStatus('success');
            setMessage(`Расчет «${session.name}» готов! Перенаправляем на главную...`);
            const timer = setTimeout(() => navigate('/', { replace: true }), 1500);
            return () => clearTimeout(timer);
        } catch (error) {
            console.error('Failed to decode shared session', error);
            setStatus('error');
            setMessage('Не удалось распознать ссылку. Проверьте, не была ли она повреждена.');
        }
    }, [navigate, searchParams]);

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
                <h1 className='text-2xl font-bold text-gray-800'>Импорт расчета</h1>
                <p className='text-gray-600'>{message}</p>
                {status === 'error' && (
                    <button
                        onClick={() => navigate('/', { replace: true })}
                        className='mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors'
                    >
                        На главную
                    </button>
                )}
            </div>
        </div>
    );
};

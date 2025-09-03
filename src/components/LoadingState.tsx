'use client';

import { AlertCircle, Loader2 } from 'lucide-react';

interface LoadingStateProps {
  isLoading?: boolean;
  error?: string | null;
  children?: React.ReactNode;
}

export default function LoadingState({ isLoading, error, children }: LoadingStateProps) {
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-sm border border-red-200 p-8 max-w-md">
          <div className="flex items-center text-red-600 mb-4">
            <AlertCircle className="w-6 h-6 mr-2" />
            <h3 className="text-lg font-medium">Ошибка</h3>
          </div>
          <p className="text-gray-700 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Попробовать снова
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center text-gray-600">
          <Loader2 className="w-8 h-8 mr-3 animate-spin" />
          <span className="text-lg">Загрузка...</span>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

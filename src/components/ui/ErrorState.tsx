import React from 'react';

type Props = {
  message?: string;
  onRetry?: () => void;
};

export const ErrorState: React.FC<Props> = ({ message = 'Something went wrong', onRetry }) => (
  <div className="w-full py-12 flex flex-col items-center gap-4">
    <div className="text-red-400 font-medium">{message}</div>
    {onRetry && (
      <button
        onClick={onRetry}
        className="px-4 py-2 rounded bg-sw-yellow text-black font-bold"
        aria-label="Retry"
      >
        Retry
      </button>
    )}
  </div>
);

import React from 'react';

export const Loading: React.FC = () => {
  return (
    <div className="w-full py-12 flex justify-center items-center">
      <div role="status" aria-live="polite" className="text-gray-400">
        Loading…
      </div>
    </div>
  );
};

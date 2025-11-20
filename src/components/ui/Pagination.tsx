import React from 'react';

type Props = {
  currentPage: number;
  nextUrl: string | null;
  prevUrl: string | null;
  onChangePage: (page: number) => void;
  totalCount: number;
};

export const Pagination: React.FC<Props> = ({ currentPage, nextUrl, prevUrl, onChangePage, totalCount }) => {
  const perPage = 10;
  const lastPage = Math.max(1, Math.ceil(totalCount / perPage));

  const goPrev = () => onChangePage(Math.max(1, currentPage - 1));
  const goNext = () => onChangePage(Math.min(lastPage, currentPage + 1));

  return (
    <div className="flex items-center justify-between mt-6">
      <div className="flex items-center gap-2">
        <button
          onClick={goPrev}
          disabled={!prevUrl}
          className="px-3 py-2 rounded-md bg-gray-800 text-sm font-medium disabled:opacity-50"
          aria-disabled={!prevUrl}
          aria-label="Previous page"
        >
          ← Prev
        </button>
        <button
          onClick={goNext}
          disabled={!nextUrl}
          className="px-3 py-2 rounded-md bg-gray-800 text-sm font-medium disabled:opacity-50"
          aria-disabled={!nextUrl}
          aria-label="Next page"
        >
          Next →
        </button>
      </div>

      <div className="text-sm text-gray-400">
        Page {currentPage} of {lastPage}
      </div>
    </div>
  );
};

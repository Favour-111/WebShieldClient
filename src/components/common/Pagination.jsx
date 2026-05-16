import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ page, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const pages = [];
  const maxVisible = 5;
  let startPage = Math.max(1, page - Math.floor(maxVisible / 2));
  let endPage = Math.min(totalPages, startPage + maxVisible - 1);
  if (endPage - startPage < maxVisible - 1) startPage = Math.max(1, endPage - maxVisible + 1);

  for (let i = startPage; i <= endPage; i++) pages.push(i);

  return (
    <div className="flex items-center gap-1.5">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-white/5 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronLeft size={16} />
      </button>

      {startPage > 1 && (
        <>
          <PageButton n={1} current={page} onClick={onPageChange} />
          {startPage > 2 && <span className="text-slate-600 px-1 text-sm">…</span>}
        </>
      )}

      {pages.map((n) => (
        <PageButton key={n} n={n} current={page} onClick={onPageChange} />
      ))}

      {endPage < totalPages && (
        <>
          {endPage < totalPages - 1 && <span className="text-slate-600 px-1 text-sm">…</span>}
          <PageButton n={totalPages} current={page} onClick={onPageChange} />
        </>
      )}

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-white/5 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
};

const PageButton = ({ n, current, onClick }) => (
  <button
    onClick={() => onClick(n)}
    className={`w-8 h-8 rounded-lg text-sm font-medium transition-all ${
      n === current
        ? 'bg-[#00ff9d]/10 text-[#00ff9d] border border-[#00ff9d]/30'
        : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
    }`}
  >
    {n}
  </button>
);

export default Pagination;

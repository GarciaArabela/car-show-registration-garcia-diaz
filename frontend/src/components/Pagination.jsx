import { ChevronLeft, ChevronRight } from 'lucide-react'

const buttonBase = 'grid h-10 min-w-10 place-items-center rounded-lg border text-sm transition focus:outline-none focus:ring-2 focus:ring-blue-200 disabled:cursor-not-allowed disabled:opacity-40'

export default function Pagination({ page, totalPages, pageSize, totalCount, onPage, onPageSize, disabled = false }) {
  const firstItem = totalCount === 0 ? 0 : (page - 1) * pageSize + 1
  const lastItem = Math.min(page * pageSize, totalCount)
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1)

  return (
    <div className="flex flex-col gap-4 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-slate-600">Showing {firstItem}–{lastItem} of {totalCount} registrations</p>
      <div className="flex flex-wrap items-center gap-2">
        <label className="mr-1 flex items-center gap-2 text-sm text-slate-700">
          Per page:
          <select
            aria-label="Registrations per page"
            disabled={disabled}
            value={pageSize}
            onChange={(event) => onPageSize(Number(event.target.value))}
            className="h-10 rounded-lg border border-slate-300 bg-white px-3 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:opacity-50"
          >
            {[5, 10, 20].map((size) => <option key={size} value={size}>{size}</option>)}
          </select>
        </label>
        <button type="button" aria-label="Previous page" disabled={disabled || page <= 1} onClick={() => onPage(page - 1)} className={`${buttonBase} border-slate-300 text-slate-700 hover:bg-slate-50`}>
          <ChevronLeft aria-hidden="true" size={18}/>
        </button>
        {pages.map((number) => (
          <button
            type="button"
            key={number}
            aria-label={`Page ${number}`}
            aria-current={number === page ? 'page' : undefined}
            disabled={disabled}
            onClick={() => onPage(number)}
            className={`${buttonBase} ${number === page ? 'border-blue-600 bg-blue-600 font-semibold text-white shadow-sm' : 'border-slate-300 text-slate-700 hover:bg-slate-50'}`}
          >{number}</button>
        ))}
        <button type="button" aria-label="Next page" disabled={disabled || page >= totalPages} onClick={() => onPage(page + 1)} className={`${buttonBase} border-slate-300 text-slate-700 hover:bg-slate-50`}>
          <ChevronRight aria-hidden="true" size={18}/>
        </button>
      </div>
    </div>
  )
}

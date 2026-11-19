import { RotateCcw, Search, Shapes, Tag } from 'lucide-react'

const fieldClass = 'h-11 w-full rounded-lg border border-slate-300 bg-white text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100'

export default function RegistrationFilters({ search, onSearch, type, onType, status, onStatus, onClear }) {
  return (
    <div className="grid gap-3 border-t border-slate-100 pt-4 md:grid-cols-[minmax(220px,1.7fr)_minmax(155px,.9fr)_minmax(155px,.9fr)_auto]">
      <label className="relative block">
        <span className="sr-only">Search participant name</span>
        <Search aria-hidden="true" size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
        <input
          type="search"
          value={search}
          onChange={(event) => onSearch(event.target.value)}
          placeholder="Search participant name..."
          className={`${fieldClass} pl-10 pr-3`}
        />
      </label>

      <label className="relative block">
        <span className="sr-only">Registration type</span>
        <Shapes aria-hidden="true" size={17} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" />
        <select value={type} onChange={(event) => onType(event.target.value)} className={`${fieldClass} appearance-none px-10`}>
          <option value="All">All Types</option>
          <option value="Exhibitor">Exhibitor</option>
          <option value="Competitor">Competitor</option>
          <option value="VIP">VIP</option>
        </select>
        <span aria-hidden="true" className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-600">⌄</span>
      </label>

      <label className="relative block">
        <span className="sr-only">Registration status</span>
        <Tag aria-hidden="true" size={17} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" />
        <select value={status} onChange={(event) => onStatus(event.target.value)} className={`${fieldClass} appearance-none px-10`}>
          <option value="All">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Confirmed">Confirmed</option>
          <option value="CheckedIn">Checked In</option>
          <option value="Cancelled">Cancelled</option>
        </select>
        <span aria-hidden="true" className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-600">⌄</span>
      </label>

      <button type="button" onClick={onClear} className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 text-sm font-medium text-slate-800 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-200">
        <RotateCcw aria-hidden="true" size={16} />Clear Filters
      </button>
    </div>
  )
}

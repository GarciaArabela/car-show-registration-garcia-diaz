const statusStyles = {
  Pending: 'bg-amber-100 text-amber-800',
  Confirmed: 'bg-green-100 text-green-800',
  CheckedIn: 'bg-blue-100 text-blue-800',
  Cancelled: 'bg-red-100 text-red-800',
}

export default function StatusBadge({ status }) {
  const label = status === 'CheckedIn' ? 'Checked In' : status
  return (
    <span className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyles[status] || 'bg-slate-100 text-slate-700'}`}>
      <span aria-hidden="true" className="h-2 w-2 rounded-full bg-current" />
      {label}
    </span>
  )
}

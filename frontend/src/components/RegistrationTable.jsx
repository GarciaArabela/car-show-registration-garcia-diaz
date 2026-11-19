import { CarFront } from 'lucide-react'
import PaymentBadge from './PaymentBadge'
import StatusBadge from './StatusBadge'

const currency = new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' })
const dateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true, timeZone: 'Asia/Manila',
})

const typeStyles = {
  Exhibitor: 'bg-sky-100 text-sky-800',
  Competitor: 'bg-violet-100 text-violet-800',
  VIP: 'bg-pink-100 text-pink-800',
}

function formatRegistrationDate(value) {
  return dateFormatter.format(new Date(value)).replace(/, (\d{2}:)/, ' $1')
}

function initials(name) {
  return name.trim().split(/\s+/).slice(0, 2).map((part) => part[0]).join('').toUpperCase()
}

export default function RegistrationTable({ items, loading = false, error = false, onRetry, onClear }) {
  if (loading) {
    return (
      <div aria-live="polite" className="space-y-3 py-5">
        <p className="text-center text-sm font-medium text-slate-600">Loading registrations...</p>
        {Array.from({ length: 4 }, (_, index) => <div key={index} aria-hidden="true" className="h-14 animate-pulse rounded-lg bg-slate-100" />)}
      </div>
    )
  }

  if (error) {
    return (
      <div role="alert" className="py-12 text-center">
        <p className="font-semibold text-slate-900">Cannot reach the API.</p>
        <p className="mt-1 text-sm text-slate-600">Check the connection and try again.</p>
        <button type="button" onClick={onRetry} className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300">Try again</button>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="font-semibold text-slate-900">No registrations match your filters.</p>
        <button type="button" onClick={onClear} className="mt-3 text-sm font-semibold text-blue-700 hover:text-blue-800">Clear filters</button>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-lg">
      <table className="w-full min-w-[1080px] border-collapse text-left text-sm">
        <thead className="bg-slate-50 text-xs font-semibold text-slate-700">
          <tr>
            {['Reg. No.', 'Date', 'Participant', 'Car', 'Type', 'Status', 'Fee / Paid', 'Payment'].map((heading) => (
              <th key={heading} scope="col" className="whitespace-nowrap px-3 py-3.5">{heading}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {items.map((registration) => (
            <tr key={registration.id} className="transition-colors hover:bg-blue-50/40">
              <td className="whitespace-nowrap px-3 py-3.5 font-bold text-blue-700">{registration.registrationNumber}</td>
              <td className="whitespace-nowrap px-3 py-3.5 text-slate-600">{formatRegistrationDate(registration.registrationDate)}</td>
              <td className="min-w-52 px-3 py-3.5">
                <div className="flex items-center gap-3">
                  <span aria-hidden="true" className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">{initials(registration.participantName)}</span>
                  <span className="min-w-0"><strong className="block truncate font-semibold text-slate-900">{registration.participantName}</strong><small className="text-slate-500">{registration.contactNumber || registration.email}</small></span>
                </div>
              </td>
              <td className="min-w-52 px-3 py-3.5">
                <div className="flex items-start gap-2"><CarFront aria-hidden="true" size={18} className="mt-0.5 shrink-0 text-slate-500"/><span><strong className="block font-semibold text-slate-900">{registration.carMakeModel}</strong><small className="text-slate-500">{registration.plateNumber}</small></span></div>
              </td>
              <td className="px-3 py-3.5"><span className={`whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ${typeStyles[registration.registrationType] || 'bg-slate-100 text-slate-700'}`}>{registration.registrationType}</span></td>
              <td className="px-3 py-3.5"><StatusBadge status={registration.status}/></td>
              <td className="whitespace-nowrap px-3 py-3.5 text-right font-semibold text-slate-900">{currency.format(registration.registrationFee)} / {currency.format(registration.amountPaid)}</td>
              <td className="px-3 py-3.5"><PaymentBadge status={registration.paymentStatus}/></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

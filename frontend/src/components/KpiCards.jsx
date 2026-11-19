import { Banknote, CarFront, CircleDollarSign, ShieldCheck, UsersRound } from 'lucide-react'
import KpiCard from './KpiCard'

const money = new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' })

export default function KpiCards({ summary }) {
  const cards = [
    { title: 'Total Registrations', value: summary.totalRegistrations.toLocaleString(), icon: UsersRound, accent: 'bg-blue-100 text-blue-700' },
    { title: 'Total Payments', value: money.format(summary.totalPayments), icon: Banknote, accent: 'bg-emerald-100 text-emerald-700' },
    { title: 'Uncollected Payments', value: money.format(summary.uncollectedPayments), icon: CircleDollarSign, accent: 'bg-orange-100 text-orange-700' },
    { title: 'Confirmed', value: summary.confirmed.toLocaleString(), icon: ShieldCheck, accent: 'bg-violet-100 text-violet-700' },
    { title: 'Checked In', value: summary.checkedIn.toLocaleString(), icon: CarFront, accent: 'bg-sky-100 text-sky-700' },
  ]

  return (
    <section aria-label="Registration summary" className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 xl:grid-cols-5">
      {cards.map((card) => <KpiCard key={card.title} {...card} />)}
    </section>
  )
}

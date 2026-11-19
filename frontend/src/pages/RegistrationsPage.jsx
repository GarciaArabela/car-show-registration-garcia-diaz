import { useEffect, useMemo, useState } from 'react'
import {
  Bell, CalendarDays, ChartNoAxesColumnIncreasing, ChevronDown, ClipboardList,
  CreditCard, Download, MapPin, Menu, Plus, Settings, UsersRound, X,
} from 'lucide-react'
import { createSampleRegistration, getRegistrations, getSummary, registrations } from '../api/sample-data'
import useDebounce from '../hooks/useDebounce'
import KpiCards from '../components/KpiCards'
import Pagination from '../components/Pagination'
import RegistrationFilters from '../components/RegistrationFilters'
import RegistrationTable from '../components/RegistrationTable'
import PaymentBadge from '../components/PaymentBadge'

const initialSummary = { totalRegistrations: 0, totalPayments: 0, uncollectedPayments: 0, confirmed: 0, checkedIn: 0 }
const sectionDescriptions = {
  Participants: 'Browse participant contacts, vehicles, and registration statuses.',
  Payments: 'Review fees, collected amounts, and outstanding balances.',
  Reports: 'See event registration totals and participant breakdowns.',
  'Event Info': 'Event details for AutoVista Events and the registration team.',
  Settings: 'Review the active workspace and data-source configuration.',
}

function CarShowLogo() {
  return (
    <svg viewBox="0 0 100 35" className="h-8 w-24" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden="true">
      <path d="M7 23h8l8-10c3-4 7-6 13-6h24c8 0 13 5 19 11l8 2c4 1 6 3 6 7v2h-9m-60 0H9v-4c0-1 1-2 3-2h4m60 6H33m25-18 11 10H27l8-10h23Z" />
      <circle cx="25" cy="29" r="5" /><circle cx="79" cy="29" r="5" />
    </svg>
  )
}

function RegistrationDialog({ onClose, onCreate }) {
  const [form, setForm] = useState({ participantName: '', contactNumber: '', email: '', address: '', carMakeModel: '', plateNumber: '', registrationType: 'Exhibitor' })
  const [formError, setFormError] = useState('')
  const set = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }))
  const submit = (event) => {
    event.preventDefault()
    try {
      onCreate(form)
      onClose()
    } catch (error) {
      setFormError(error.message)
    }
  }
  const inputClass = 'mt-1 h-10 w-full rounded-lg border border-slate-300 px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100'

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/50 p-4" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}>
      <section role="dialog" aria-modal="true" aria-labelledby="add-registration-title" className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-5 shadow-xl sm:p-7">
        <div className="mb-5 flex items-start justify-between"><div><h2 id="add-registration-title" className="text-xl font-bold">Add Registration</h2><p className="mt-1 text-sm text-slate-600">Create a sample registration for the dashboard.</p></div><button type="button" onClick={onClose} aria-label="Close dialog" className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"><X size={20}/></button></div>
        <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-medium">Participant name<input required name="participantName" value={form.participantName} onChange={set} className={inputClass}/></label>
          <label className="text-sm font-medium">Contact number<input required name="contactNumber" value={form.contactNumber} onChange={set} className={inputClass}/></label>
          <label className="text-sm font-medium">Email<input type="email" name="email" value={form.email} onChange={set} className={inputClass}/></label>
          <label className="text-sm font-medium">Address<input required name="address" value={form.address} onChange={set} className={inputClass}/></label>
          <label className="text-sm font-medium">Car make and model<input required name="carMakeModel" value={form.carMakeModel} onChange={set} className={inputClass}/></label>
          <label className="text-sm font-medium">Plate number<input required name="plateNumber" value={form.plateNumber} onChange={set} className={inputClass}/></label>
          <label className="text-sm font-medium sm:col-span-2">Registration type<select name="registrationType" value={form.registrationType} onChange={set} className={inputClass}><option>Exhibitor</option><option>Competitor</option><option>VIP</option></select></label>
          {formError && <p role="alert" className="text-sm font-medium text-red-700 sm:col-span-2">{formError}</p>}
          <div className="flex justify-end gap-2 pt-2 sm:col-span-2"><button type="button" onClick={onClose} className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold">Cancel</button><button type="submit" className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">Save Registration</button></div>
        </form>
      </section>
    </div>
  )
}

function downloadCsv(items) {
  const columns = ['registrationNumber', 'registrationDate', 'participantName', 'contactNumber', 'email', 'carMakeModel', 'plateNumber', 'registrationType', 'status', 'registrationFee', 'amountPaid', 'paymentStatus']
  const escape = (value) => `"${String(value ?? '').replaceAll('"', '""')}"`
  const csv = [columns.join(','), ...items.map((item) => columns.map((key) => escape(item[key])).join(','))].join('\r\n')
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }))
  const link = document.createElement('a')
  link.href = url
  link.download = 'car-show-2027-registrations.csv'
  link.click()
  URL.revokeObjectURL(url)
}

const currency = new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' })

function ParticipantsSection({ items }) {
  return <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6"><div className="mb-5"><h3 className="text-xl font-bold">Participants</h3><p className="mt-1 text-sm text-slate-600">Directory of registered drivers and vehicle owners.</p></div><div className="overflow-x-auto"><table className="w-full min-w-[760px] text-left text-sm"><thead className="bg-slate-50 text-xs text-slate-600"><tr>{['Participant','Contact','Vehicle','Registration','Status'].map(label => <th key={label} className="px-4 py-3">{label}</th>)}</tr></thead><tbody className="divide-y divide-slate-100">{items.map(item => <tr key={item.id} className="hover:bg-slate-50"><td className="px-4 py-3 font-semibold">{item.participantName}</td><td className="px-4 py-3 text-slate-600">{item.contactNumber}<span className="block text-xs">{item.email}</span></td><td className="px-4 py-3">{item.carMakeModel}<span className="block text-xs text-slate-500">{item.plateNumber}</span></td><td className="px-4 py-3">{item.registrationNumber}<span className="block text-xs text-slate-500">{item.registrationType}</span></td><td className="px-4 py-3"><span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold">{item.status === 'CheckedIn' ? 'Checked In' : item.status}</span></td></tr>)}</tbody></table></div></section>
}

function PaymentsSection({ items, summary }) {
  const paidCount = items.filter(item => item.paymentStatus === 'Paid').length
  const partialCount = items.filter(item => item.paymentStatus === 'Partial').length
  const unpaidCount = items.filter(item => item.paymentStatus === 'Unpaid').length
  const metrics = [['Total fees', currency.format(summary.totalFees)], ['Collected', currency.format(summary.totalPayments)], ['Outstanding', currency.format(summary.uncollectedPayments)]]
  return <div className="space-y-5"><section aria-label="Payment summary" className="grid gap-3 sm:grid-cols-3">{metrics.map(([label,value]) => <article key={label} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"><p className="text-sm text-slate-600">{label}</p><p className="mt-2 text-xl font-bold">{value}</p></article>)}</section><section className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6"><div className="mb-5 flex flex-wrap items-end justify-between gap-3"><div><h3 className="text-xl font-bold">Payment Ledger</h3><p className="mt-1 text-sm text-slate-600">{paidCount} paid · {partialCount} partial · {unpaidCount} unpaid</p></div></div><div className="overflow-x-auto"><table className="w-full min-w-[720px] text-left text-sm"><thead className="bg-slate-50 text-xs text-slate-600"><tr>{['Registration','Participant','Fee','Paid','Balance','Payment'].map(label => <th key={label} className="px-4 py-3">{label}</th>)}</tr></thead><tbody className="divide-y divide-slate-100">{items.map(item => <tr key={item.id} className="hover:bg-slate-50"><td className="px-4 py-3 font-semibold text-blue-700">{item.registrationNumber}</td><td className="px-4 py-3">{item.participantName}</td><td className="px-4 py-3">{currency.format(item.registrationFee)}</td><td className="px-4 py-3">{currency.format(item.amountPaid)}</td><td className="px-4 py-3">{currency.format(item.registrationFee - item.amountPaid)}</td><td className="px-4 py-3"><PaymentBadge status={item.paymentStatus}/></td></tr>)}</tbody></table></div></section></div>
}

function ReportsSection({ items, summary }) {
  const statuses = ['Confirmed', 'CheckedIn', 'Pending', 'Cancelled'].map(status => [status === 'CheckedIn' ? 'Checked In' : status, items.filter(item => item.status === status).length])
  const types = ['Exhibitor', 'Competitor', 'VIP'].map(type => [type, items.filter(item => item.registrationType === type).length])
  return <div className="grid gap-5 xl:grid-cols-2"><section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><h3 className="text-xl font-bold">Registration status</h3><p className="mt-1 text-sm text-slate-600">Current status breakdown across all registrations.</p><div className="mt-5 divide-y divide-slate-100">{statuses.map(([label,count]) => <div key={label} className="flex items-center justify-between py-3"><span className="text-sm text-slate-700">{label}</span><strong>{count}</strong></div>)}</div></section><section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><h3 className="text-xl font-bold">Registration types</h3><p className="mt-1 text-sm text-slate-600">Participant distribution by registration type.</p><div className="mt-5 divide-y divide-slate-100">{types.map(([label,count]) => <div key={label} className="flex items-center justify-between py-3"><span className="text-sm text-slate-700">{label}</span><strong>{count}</strong></div>)}</div></section><section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm xl:col-span-2"><h3 className="text-xl font-bold">Event totals</h3><div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">{[['Registrations',summary.totalRegistrations],['Confirmed',summary.confirmed],['Checked in',summary.checkedIn],['Payments collected',currency.format(summary.totalPayments)]].map(([label,value])=><div key={label} className="rounded-xl bg-slate-50 p-4"><p className="text-xs text-slate-600">{label}</p><p className="mt-1 font-bold">{value}</p></div>)}</div></section></div>
}

function EventInfoSection() {
  return <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7"><div className="flex items-center gap-3"><span className="grid h-11 w-11 place-items-center rounded-xl bg-blue-100 text-blue-700"><CalendarDays/></span><div><h3 className="text-xl font-bold">Car Show 2027</h3><p className="text-sm text-slate-600">Event information</p></div></div><dl className="mt-6 grid gap-4 sm:grid-cols-2">{[['Organizer','AutoVista Events'],['Location','Sorsogon City Coliseum'],['Duration','Three days'],['Event year','2027'],['Registration desk','Event Admin'],['Program','Vehicle exhibition, competition, and VIP showcase']].map(([label,value])=><div key={label} className="rounded-xl border border-slate-200 p-4"><dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</dt><dd className="mt-1 font-semibold text-slate-900">{label==='Location'&&<MapPin size={16} className="mr-1 inline text-blue-600"/>}{value}</dd></div>)}</dl></section>
}

function SettingsSection() {
  return <section className="max-w-3xl rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7"><h3 className="text-xl font-bold">Workspace Settings</h3><p className="mt-1 text-sm text-slate-600">Dashboard and event configuration currently in use.</p><dl className="mt-5 divide-y divide-slate-100">{[['Workspace','AutoVista Events'],['Active event','Car Show 2027'],['Location','Sorsogon City Coliseum'],['Currency','Philippine Peso (PHP)'],['Data source','Local sample registrations'],['API endpoint','http://localhost:5205']].map(([label,value])=><div key={label} className="flex flex-col gap-1 py-4 sm:flex-row sm:items-center sm:justify-between"><dt className="text-sm text-slate-600">{label}</dt><dd className="text-sm font-semibold text-slate-900">{value}</dd></div>)}</dl><p className="mt-4 rounded-lg bg-blue-50 p-3 text-xs leading-5 text-blue-900">The dashboard is using sample data. Switch to the API client after the backend is running and its response has been confirmed.</p></section>
}

export default function RegistrationsPage() {
  const [results, setResults] = useState({ items: [], page: 1, pageSize: 5, totalCount: 0, totalPages: 1 })
  const [summary, setSummary] = useState(initialSummary)
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 400)
  const [type, setType] = useState('All')
  const [status, setStatus] = useState('All')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(5)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [reloadKey, setReloadKey] = useState(0)
  const [showAdd, setShowAdd] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [activeSection, setActiveSection] = useState('Registrations')
  const [allItems, setAllItems] = useState(() => [...registrations])

  useEffect(() => {
    const controller = new AbortController()
    let active = true
    const load = async () => {
      setLoading(true)
      setError(false)
      try {
        const [nextResults, nextSummary] = await Promise.all([
          getRegistrations({ participantName: debouncedSearch, type, status, page, pageSize }),
          getSummary(),
        ])
        if (!active) return
        setResults(nextResults)
        setSummary(nextSummary)
      } catch (loadError) {
        if (active && loadError.name !== 'AbortError') setError(true)
      } finally {
        if (active) setLoading(false)
      }
    }
    const timeout = window.setTimeout(load, 0)
    return () => { active = false; controller.abort(); window.clearTimeout(timeout) }
  }, [debouncedSearch, type, status, page, pageSize, reloadKey])

  const visibleItems = useMemo(() => results.items, [results.items])
  const clearFilters = () => { setSearch(''); setType('All'); setStatus('All'); setPage(1) }
  const updateSearch = (value) => { setSearch(value); setPage(1) }
  const updateType = (value) => { setType(value); setPage(1) }
  const updateStatus = (value) => { setStatus(value); setPage(1) }
  const addRegistration = (values) => {
    createSampleRegistration(values)
    setAllItems([...registrations])
    setPage(1)
    setSearch('')
    setType('All')
    setStatus('All')
    setReloadKey((key) => key + 1)
  }

  const navigation = [
    { label: 'Registrations', icon: ClipboardList, group: 'MAIN' },
    { label: 'Participants', icon: UsersRound, group: 'MAIN' },
    { label: 'Payments', icon: CreditCard, group: 'MAIN' },
    { label: 'Reports', icon: ChartNoAxesColumnIncreasing, group: 'MAIN' },
    { label: 'Event Info', icon: CalendarDays, group: 'EVENT' },
    { label: 'Settings', icon: Settings, group: 'EVENT' },
  ]
  const sidebar = (
    <aside id="primary-sidebar" className="flex h-full w-[228px] shrink-0 flex-col bg-[#071a35] px-3 text-white">
      <div className="flex flex-col items-center border-b border-white/20 px-2 pb-6 pt-2 lg:pt-6"><div className="flex h-8 w-full justify-end lg:hidden"><button type="button" onClick={() => setMobileMenuOpen(false)} aria-label="Close navigation" className="grid h-8 w-8 place-items-center rounded-lg text-slate-200 hover:bg-white/10"><X size={18}/></button></div><CarShowLogo/><strong className="mt-2 text-lg">Car Show 2027</strong><span className="text-sm text-slate-300">AutoVista Events</span></div>
      <nav aria-label="Main navigation" className="space-y-1">
        {navigation.map(({ label, icon: Icon, group }, index) => (
          <div key={label}>
            {(index === 0 || navigation[index - 1].group !== group) && <p className={`px-3 pb-2 text-xs font-semibold tracking-wide text-slate-300 ${group === 'MAIN' ? 'pt-6' : 'mt-4 border-t border-white/20 pt-5'}`}>{group}</p>}
            <button type="button" aria-current={activeSection === label ? 'page' : undefined} onClick={() => { setActiveSection(label); setMobileMenuOpen(false) }} className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium transition ${activeSection === label ? 'bg-blue-600 text-white' : 'text-slate-200 hover:bg-white/10'}`}>
              <Icon size={20} aria-hidden="true"/>{label}
            </button>
          </div>
        ))}
      </nav>
      <div className="mt-auto h-36 rounded-t-full bg-gradient-to-br from-sky-500/30 via-blue-400/10 to-transparent"/>
    </aside>
  )

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      {!sidebarCollapsed && <div className="fixed inset-y-0 left-0 z-20 hidden lg:flex">{sidebar}</div>}
      {mobileMenuOpen && <div role="presentation" className="fixed inset-0 z-30 bg-slate-950/50 lg:hidden" onMouseDown={(event) => { if (event.target === event.currentTarget) setMobileMenuOpen(false) }}><div role="dialog" aria-label="Main navigation" className="h-full w-[min(290px,85vw)] shadow-xl">{sidebar}</div></div>}

      <div className={sidebarCollapsed ? '' : 'lg:pl-[228px]'}>
        <header className="sticky top-0 z-10 flex h-[86px] items-center justify-between border-b border-slate-200 bg-white/95 px-4 shadow-sm backdrop-blur sm:px-8">
          <div className="flex min-w-0 items-center gap-2 sm:gap-5"><button type="button" onClick={() => { if (window.matchMedia('(min-width: 1024px)').matches) setSidebarCollapsed((collapsed) => !collapsed); else setMobileMenuOpen((open) => !open) }} aria-label={sidebarCollapsed ? 'Show sidebar' : 'Hide sidebar'} aria-controls="primary-sidebar" aria-expanded={window.innerWidth >= 1024 ? !sidebarCollapsed : mobileMenuOpen} className="grid h-11 w-11 shrink-0 place-items-center rounded-lg text-slate-700 hover:bg-slate-100"><Menu size={24}/></button><div className="min-w-0"><h1 className="whitespace-nowrap text-xl font-bold tracking-tight sm:text-2xl">Car Show <span className="text-blue-600">2027</span></h1><p className="hidden text-sm text-slate-600 sm:block">AutoVista Events <span className="px-1">•</span> Sorsogon City Coliseum</p></div></div>
          <div className="flex shrink-0 items-center gap-2 sm:gap-5"><div className="relative border-r border-slate-200 pr-2 sm:pr-4"><button type="button" aria-label="Notifications" aria-expanded={showNotifications} onClick={() => setShowNotifications((visible) => !visible)} className="relative grid h-11 w-11 place-items-center rounded-lg text-slate-700 hover:bg-slate-100"><Bell size={23}/><span aria-hidden="true" className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-red-600"/></button>{showNotifications && <div className="absolute right-0 top-12 w-64 rounded-xl border border-slate-200 bg-white p-4 text-sm shadow-lg"><strong>Notifications</strong><p className="mt-2 text-slate-600">You’re all caught up.</p></div>}</div><span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-blue-100 font-bold text-blue-700 sm:h-11 sm:w-11">AV</span><div className="hidden sm:block"><strong className="block text-sm">Event Admin</strong><span className="text-xs text-slate-600">Registration Desk</span></div><ChevronDown size={18} className="hidden sm:block"/></div>
        </header>

        <main className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 lg:px-7">
          <div className="mb-5"><h2 className="text-3xl font-bold tracking-tight">{activeSection}</h2><p className="mt-1 text-sm text-slate-600 sm:text-base">{activeSection === 'Registrations' ? 'Monitor participant registrations and payments for Car Show 2027.' : sectionDescriptions[activeSection]}</p></div>
          {activeSection === 'Registrations' && <>
          <KpiCards summary={summary}/>
          <section id="registrations" className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
            <div className="mb-4 flex flex-col gap-4 border-b border-slate-100 pb-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-blue-100 text-blue-700"><ClipboardList size={22}/></span><div><h3 className="text-xl font-bold tracking-tight">Registrations</h3><p className="text-sm text-slate-600">Browse participant and vehicle details.</p></div></div>
              <div className="grid grid-cols-2 gap-2 sm:flex"><button type="button" onClick={() => downloadCsv(visibleItems)} className="inline-flex min-h-11 items-center justify-center gap-2 whitespace-nowrap rounded-lg border border-slate-300 px-3 text-sm font-semibold hover:bg-slate-50 sm:px-4"><Download size={17}/>Export</button><button type="button" onClick={() => setShowAdd(true)} className="inline-flex min-h-11 items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-blue-600 px-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 sm:px-4"><Plus size={18}/>Add Registration</button></div>
            </div>
            <RegistrationFilters search={search} onSearch={updateSearch} type={type} onType={updateType} status={status} onStatus={updateStatus} onClear={clearFilters}/>
            <div className="mt-5"><RegistrationTable items={visibleItems} loading={loading} error={error} onRetry={() => setReloadKey((key) => key + 1)} onClear={clearFilters}/></div>
            <div className="mt-4"><Pagination page={results.page} totalPages={results.totalPages} pageSize={pageSize} totalCount={results.totalCount} onPage={setPage} onPageSize={(size) => { setPageSize(size); setPage(1) }} disabled={loading || error}/></div>
          </section>
          <p className="mt-4 text-center text-xs text-slate-500">Car Show 2027 · Sorsogon City Coliseum · Sample registration data</p>
          </>}
          {activeSection === 'Participants' && <ParticipantsSection items={allItems}/>}
          {activeSection === 'Payments' && <PaymentsSection items={allItems} summary={summary}/>}
          {activeSection === 'Reports' && <ReportsSection items={allItems} summary={summary}/>}
          {activeSection === 'Event Info' && <EventInfoSection/>}
          {activeSection === 'Settings' && <SettingsSection/>}
        </main>
      </div>
      {showAdd && <RegistrationDialog onClose={() => setShowAdd(false)} onCreate={addRegistration}/ >}
    </div>
  )
}

export default function KpiCard({ title, value, icon: Icon, accent }) {
  return (
    <article className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md sm:p-5">
      <div className="relative z-10 flex items-center gap-3">
        <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${accent}`}>
          <Icon aria-hidden="true" size={20} strokeWidth={2} />
        </span>
        <h3 className="text-sm font-medium leading-5 text-slate-700">{title}</h3>
      </div>
      <p className="relative z-10 mt-3 break-words text-xl font-bold tracking-tight text-slate-950 sm:text-2xl">{value}</p>
      <span aria-hidden="true" className="absolute -bottom-9 -right-4 h-16 w-32 rounded-[50%] bg-sky-100/70 transition group-hover:bg-sky-200/70" />
    </article>
  )
}

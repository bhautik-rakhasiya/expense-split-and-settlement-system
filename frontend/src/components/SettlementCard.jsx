const SettlementCard = ({ from, to, amount }) => {
  const formatted = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
  }).format(amount);

  const fromInitials = from.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
  const toInitials = to.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <div className="card p-5 flex items-center gap-4 hover:shadow-md transition hover:-translate-y-0.5">
      {/* From */}
      <div className="flex flex-col items-center gap-1 min-w-[72px]">
        <div className="w-11 h-11 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-sm">
          {fromInitials}
        </div>
        <span className="text-xs font-medium text-slate-600 text-center leading-tight">{from}</span>
      </div>

      {/* Arrow */}
      <div className="flex-1 flex flex-col items-center gap-1">
        <span className="text-lg font-bold text-brand-700">{formatted}</span>
        <div className="flex items-center w-full gap-1">
          <div className="flex-1 h-px bg-gradient-to-r from-rose-300 to-brand-400" />
          <svg className="w-4 h-4 text-brand-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
          <div className="flex-1 h-px bg-gradient-to-r from-brand-400 to-emerald-300" />
        </div>
        <span className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold">Pay</span>
      </div>

      {/* To */}
      <div className="flex flex-col items-center gap-1 min-w-[72px]">
        <div className="w-11 h-11 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm">
          {toInitials}
        </div>
        <span className="text-xs font-medium text-slate-600 text-center leading-tight">{to}</span>
      </div>
    </div>
  );
};

export default SettlementCard;
